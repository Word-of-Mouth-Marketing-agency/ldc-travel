export const inquiryTypeOptions = [
  { label: "General Inquiry", value: "general" },
  { label: "Travel Program", value: "program" },
  { label: "Destination", value: "destination" },
  { label: "Festival / Event", value: "event" },
  { label: "Custom Trip", value: "custom-trip" },
  { label: "Corporate / Group Travel", value: "corporate-group" },
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
};

export type InquiryValidationResult =
  | { success: true; data: InquiryFormValues }
  | { success: false; fieldErrors: InquiryFieldErrors; formError?: string; isSpam?: boolean };

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
    return { success: false, fieldErrors: {}, formError: "Please try again.", isSpam: true };
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
    return { success: false, fieldErrors, formError: "Please check the highlighted fields and try again." };
  }

  return {
    success: true,
    data: { fullName, email, phone, inquiryType, subject, message },
  };
}
