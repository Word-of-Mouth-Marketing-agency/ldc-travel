"use server";

import { validateInquiry, type ContactFormState } from "../../../lib/inquiry-validation";
import { isUiPreviewMode } from "../../../lib/preview";

export async function submitInquiry(_previousState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const validation = validateInquiry(formData);

  if (!validation.success) {
    return {
      status: "error",
      message: validation.formError ?? "Please check the form and try again.",
      fieldErrors: validation.fieldErrors,
    };
  }

  if (isUiPreviewMode()) {
    return {
      status: "error",
      message: "Preview mode: this form is not connected to a database, so your inquiry was not sent. Please contact us on WhatsApp instead.",
      fieldErrors: {},
    };
  }

  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    return {
      status: "error",
      message: "We couldn’t send your inquiry right now. Please contact us on WhatsApp.",
      fieldErrors: {},
    };
  }

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../../../payload.config");
    const payload = await getPayload({ config });

    await payload.create({
      collection: "inquiries",
      data: {
        ...validation.data,
        source: "contact-page",
        status: "new",
      },
      overrideAccess: true,
    });

    return {
      status: "success",
      message: "Thanks, your inquiry has been received. Our team will get back to you soon.",
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Contact inquiry submission failed.", error instanceof Error ? error.message : "Unknown error");

    return {
      status: "error",
      message: "We couldn’t send your inquiry right now. Please contact us on WhatsApp.",
      fieldErrors: {},
    };
  }
}
