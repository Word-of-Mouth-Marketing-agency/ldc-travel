export const inquiryTypeOptions = [
  { label: "General Inquiry", value: "general" },
  { label: "Destination", value: "destination" },
  { label: "Custom travel request", value: "custom-trip" },
  { label: "Other", value: "other" },
] as const;

export const inquiryTypes = inquiryTypeOptions.map(({ value }) => value) as [string, ...string[]];
export type InquiryType = (typeof inquiryTypeOptions)[number]["value"];

export type InquiryFormValues = {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
};

export type InquiryField = keyof InquiryFormValues;
export type InquiryFieldErrors = Partial<Record<InquiryField, string>>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: InquiryFieldErrors;
  values: Partial<InquiryFormValues>;
};

export type DestinationInquiryValues = {
  fullName: string;
  email: string;
  phone: string;
};

export type DestinationInquiryField = keyof DestinationInquiryValues;
export type DestinationInquiryFieldErrors = Partial<Record<DestinationInquiryField, string>>;

export type DestinationInquiryFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: DestinationInquiryFieldErrors;
  values: Partial<DestinationInquiryValues>;
};

export type CustomTripInquiryValues = {
  fullName: string;
  email: string;
  phone: string;
  destinationText: string;
  travelers: string;
  preferredTravelDates: string;
  tripNotes: string;
};

export type CustomTripInquiryData = Omit<CustomTripInquiryValues, "travelers"> & {
  travelers: number;
};

export type CustomTripInquiryField = keyof CustomTripInquiryValues;
export type CustomTripInquiryFieldErrors = Partial<Record<CustomTripInquiryField, string>>;

export type CustomTripInquiryFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: CustomTripInquiryFieldErrors;
  values: Partial<CustomTripInquiryValues>;
};

export type InquiryValidationResult =
  | { success: true; data: InquiryFormValues }
  | { success: false; fieldErrors: InquiryFieldErrors; formError?: string; isSpam?: boolean; values: Partial<InquiryFormValues> };

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^[0-9+()\s-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
}

export function validateInquiry(formData: FormData): InquiryValidationResult {
  const fullName = readString(formData, "fullName");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const inquiryType = readString(formData, "inquiryType") as InquiryType;
  const subject = readString(formData, "subject");
  const message = readString(formData, "message");
  const fieldErrors: InquiryFieldErrors = {};

  if (readString(formData, "website")) {
    return { success: false, fieldErrors: {}, formError: "Please try again.", isSpam: true, values: { fullName, email, phone, inquiryType, subject, message } };
  }

  if (fullName.length < 2 || fullName.length > 80) fieldErrors.fullName = "Please enter your name (2–80 characters).";
  if (email && (email.length > 160 || !isValidEmail(email))) fieldErrors.email = "Please enter a valid email address.";
  if (phone && (phone.length > 30 || !isValidPhone(phone))) fieldErrors.phone = "Please enter a valid phone or WhatsApp number.";
  if (!email && !phone) {
    fieldErrors.email = "Add an email or phone number.";
    fieldErrors.phone = "Add an email or phone number.";
  }
  if (!inquiryTypes.includes(inquiryType)) fieldErrors.inquiryType = "Please choose an inquiry type.";
  if (subject.length > 120) fieldErrors.subject = "Keep the subject under 120 characters.";
  if (message.length < 10 || message.length > 2000) fieldErrors.message = "Please share 10–2,000 characters about your request.";

  if (Object.keys(fieldErrors).length) {
    return { success: false, fieldErrors, formError: "Please check the highlighted fields and try again.", values: { fullName, email, phone, inquiryType, subject, message } };
  }

  return {
    success: true,
    data: { fullName, email, phone, inquiryType, subject, message },
  };
}

export type DestinationInquiryValidationResult =
  | { success: true; data: DestinationInquiryValues }
  | { success: false; fieldErrors: DestinationInquiryFieldErrors; formError?: string; isSpam?: boolean; values: Partial<DestinationInquiryValues> };

export function validateDestinationInquiry(formData: FormData): DestinationInquiryValidationResult {
  const fullName = readString(formData, "fullName");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const fieldErrors: DestinationInquiryFieldErrors = {};

  if (readString(formData, "website")) {
    return { success: false, fieldErrors: {}, formError: "Please try again.", isSpam: true, values: { fullName, email, phone } };
  }

  if (fullName.length < 2 || fullName.length > 80) fieldErrors.fullName = "Please enter your name (2–80 characters).";
  if (!email || email.length > 160 || !isValidEmail(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!phone || phone.length > 30 || !isValidPhone(phone)) fieldErrors.phone = "Please enter a valid phone or WhatsApp number.";

  if (Object.keys(fieldErrors).length) {
    return { success: false, fieldErrors, formError: "Please check the highlighted fields and try again.", values: { fullName, email, phone } };
  }

  return { success: true, data: { fullName, email, phone } };
}

export type CustomTripInquiryValidationResult =
  | { success: true; data: CustomTripInquiryData }
  | { success: false; fieldErrors: CustomTripInquiryFieldErrors; formError?: string; isSpam?: boolean; values: Partial<CustomTripInquiryValues> };

export function validateCustomTripInquiry(formData: FormData): CustomTripInquiryValidationResult {
  const fullName = readString(formData, "fullName");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const destinationText = readString(formData, "destinationText");
  const travelers = readString(formData, "travelers");
  const preferredTravelDates = readString(formData, "preferredTravelDates");
  const tripNotes = readString(formData, "tripNotes");
  const fieldErrors: CustomTripInquiryFieldErrors = {};

  const values = { fullName, email, phone, destinationText, travelers, preferredTravelDates, tripNotes };

  if (readString(formData, "website")) {
    return { success: false, fieldErrors: {}, formError: "Please try again.", isSpam: true, values };
  }

  if (fullName.length < 2 || fullName.length > 80) fieldErrors.fullName = "Please enter your name (2–80 characters).";
  if (!email || email.length > 160 || !isValidEmail(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!phone || phone.length > 30 || !isValidPhone(phone)) fieldErrors.phone = "Please enter a valid phone or WhatsApp number.";
  if (destinationText.length < 2 || destinationText.length > 120) fieldErrors.destinationText = "Please tell us where you would like to go.";

  const travelerCount = Number(travelers);
  if (!travelers || !Number.isInteger(travelerCount) || travelerCount < 1 || travelerCount > 100) {
    fieldErrors.travelers = "Enter a whole number from 1 to 100.";
  }

  if (preferredTravelDates.length > 120) fieldErrors.preferredTravelDates = "Keep your preferred dates under 120 characters.";
  if (tripNotes.length > 2000) fieldErrors.tripNotes = "Keep your trip notes under 2,000 characters.";

  if (Object.keys(fieldErrors).length) {
    return { success: false, fieldErrors, formError: "Please check the highlighted fields and try again.", values };
  }

  return {
    success: true,
    data: { fullName, email, phone, destinationText, travelers: travelerCount, preferredTravelDates, tripNotes },
  };
}
