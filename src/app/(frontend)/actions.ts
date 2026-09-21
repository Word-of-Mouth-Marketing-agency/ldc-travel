"use server";

import { isUiPreviewMode } from "../../lib/preview";
import { validateCustomTripInquiry, type CustomTripInquiryFormState } from "../../lib/inquiry-validation";

export async function submitCustomTripInquiry(
  _previousState: CustomTripInquiryFormState,
  formData: FormData,
): Promise<CustomTripInquiryFormState> {
  const validation = validateCustomTripInquiry(formData);

  if (!validation.success) {
    return {
      status: "error",
      message: validation.formError ?? "Please check the form and try again.",
      fieldErrors: validation.fieldErrors,
      values: validation.values,
    };
  }

  if (isUiPreviewMode()) {
    return {
      status: "error",
      message: "This is a website preview. Your trip request was not submitted. Please contact LDC Travel on WhatsApp.",
      fieldErrors: {},
      values: { ...validation.data, travelers: String(validation.data.travelers) },
    };
  }

  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    return {
      status: "error",
      message: "We couldn’t send your request right now. Please try again or contact LDC Travel on WhatsApp.",
      fieldErrors: {},
      values: { ...validation.data, travelers: String(validation.data.travelers) },
    };
  }

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../../payload.config");
    const payload = await getPayload({ config });

    await payload.create({
      collection: "inquiries",
      data: {
        fullName: validation.data.fullName,
        email: validation.data.email,
        phone: validation.data.phone,
        destinationText: validation.data.destinationText,
        travelers: validation.data.travelers,
        preferredTravelDates: validation.data.preferredTravelDates || undefined,
        inquiryType: "custom-trip",
        subject: `Custom trip request: ${validation.data.destinationText}`,
        message: validation.data.tripNotes || "Custom trip request submitted through the Design Your Trip form.",
        source: "design-your-trip-modal",
        status: "new",
      },
      overrideAccess: true,
    });

    return {
      status: "success",
      message: "Thanks — we’ve received your trip request. The LDC Travel team will contact you to continue planning.",
      fieldErrors: {},
      values: {},
    };
  } catch (error) {
    console.error("Custom trip inquiry submission failed.", error instanceof Error ? error.message : "Unknown error");

    return {
      status: "error",
      message: "We couldn’t send your request right now. Please try again or contact LDC Travel on WhatsApp.",
      fieldErrors: {},
      values: { ...validation.data, travelers: String(validation.data.travelers) },
    };
  }
}
