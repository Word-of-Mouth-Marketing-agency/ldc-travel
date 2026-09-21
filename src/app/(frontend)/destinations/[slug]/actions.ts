"use server";

import { approvedDestinationSlugs } from "../../../../content/destinations";
import {
  validateDestinationInquiry,
  type DestinationInquiryFormState,
} from "../../../../lib/inquiry-validation";
import { isUiPreviewMode } from "../../../../lib/preview";

export async function submitDestinationInquiry(
  slug: string,
  _previousState: DestinationInquiryFormState,
  formData: FormData,
): Promise<DestinationInquiryFormState> {
  const validation = validateDestinationInquiry(formData);

  if (!validation.success) {
    return {
      status: "error",
      message: validation.formError ?? "Please check the form and try again.",
      fieldErrors: validation.fieldErrors,
      values: validation.values,
    };
  }

  if (!approvedDestinationSlugs.includes(slug)) {
    return { status: "error", message: "This destination is not available. Please contact us on WhatsApp.", fieldErrors: {}, values: validation.data };
  }

  if (isUiPreviewMode()) {
    return {
      status: "error",
      message: "This is a website preview. Your details were not submitted. Please contact LDC Travel on WhatsApp.",
      fieldErrors: {},
      values: validation.data,
    };
  }

  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    return {
      status: "error",
      message: "We couldn’t send your inquiry right now. Please contact us on WhatsApp.",
      fieldErrors: {},
      values: validation.data,
    };
  }

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../../../../payload.config");
    const payload = await getPayload({ config });
    const destinationResult = await payload.find({
      collection: "destinations",
      where: { and: [{ slug: { equals: slug } }, { status: { equals: "published" } }] },
      limit: 1,
      depth: 0,
    });
    const destination = destinationResult.docs[0];

    if (!destination) {
      return { status: "error", message: "We couldn’t find that destination right now. Please contact us on WhatsApp.", fieldErrors: {}, values: validation.data };
    }

    await payload.create({
      collection: "inquiries",
      data: {
        ...validation.data,
        destination: destination.id,
        inquiryType: "destination",
        subject: `Destination inquiry: ${destination.title}`,
        message: `The visitor requested more information about ${destination.title}.`,
        source: "destination-page",
        status: "new",
      },
      overrideAccess: true,
    });

    return {
      status: "success",
      message: "Thanks — we've received your details. The LDC Travel team will contact you soon.",
      fieldErrors: {},
      values: {},
    };
  } catch (error) {
    console.error("Destination inquiry submission failed.", error instanceof Error ? error.message : "Unknown error");
    return {
      status: "error",
      message: "We couldn’t send your inquiry right now. Please contact us on WhatsApp.",
      fieldErrors: {},
      values: validation.data,
    };
  }
}
