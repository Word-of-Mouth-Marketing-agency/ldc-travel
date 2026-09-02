"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { submitInquiry } from "../../app/(frontend)/contact/actions";
import type { ContactFormState, InquiryField } from "../../lib/inquiry-validation";
import { Icon } from "../homepage/Icon";

const initialState: ContactFormState = { status: "idle", message: "", fieldErrors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary contact-submit" type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send inquiry"}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="form-field-error" id={id} role="alert">{message}</p> : null;
}

export function ContactForm({ whatsappHref }: { whatsappHref: string }) {
  const [state, formAction] = useActionState(submitInquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      return;
    }

    if (state.status !== "error") return;

    const fieldOrder: InquiryField[] = ["fullName", "email", "phone", "inquiryType", "subject", "message"];
    const firstInvalidField = fieldOrder.find((field) => state.fieldErrors[field]);
    if (firstInvalidField) document.getElementById(`contact-${firstInvalidField}`)?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="contact-form-success" role="status" aria-live="polite">
        <span className="contact-form-success-icon" aria-hidden="true"><Icon name="check" size={25} strokeWidth={2.2} /></span>
        <h2>Inquiry received</h2>
        <p>{state.message}</p>
        <a className="button button-secondary" href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us</a>
      </div>
    );
  }

  const errors = state.fieldErrors;

  return (
    <form ref={formRef} className="contact-form" action={formAction} noValidate>
      <div className="contact-form-heading">
        <p className="section-eyebrow">Start a conversation</p>
        <h2 id="inquiry-heading">Tell us what you’re planning.</h2>
        <p>Share a few details and we’ll help shape the right next step.</p>
      </div>
      {state.message ? (
        <div className="contact-form-message" role="alert">
          <p>{state.message}</p>
          {state.message.includes("WhatsApp") ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us</a> : null}
        </div>
      ) : null}
      <fieldset>
        <legend>Contact details</legend>
        <div className="contact-form-fields contact-form-fields-two">
          <div className="form-field">
            <label htmlFor="contact-fullName">Full name <span aria-hidden="true">*</span></label>
            <input id="contact-fullName" name="fullName" type="text" autoComplete="name" maxLength={80} required aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "contact-fullName-error" : undefined} />
            <FieldError id="contact-fullName-error" message={errors.fullName} />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={160} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
            <FieldError id="contact-email-error" message={errors.email} />
          </div>
          <div className="form-field">
            <label htmlFor="contact-phone">Phone / WhatsApp</label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} />
            <FieldError id="contact-phone-error" message={errors.phone} />
          </div>
        </div>
        <p className="form-help">Please provide an email address or a phone / WhatsApp number.</p>
      </fieldset>
      <fieldset>
        <legend>Inquiry details</legend>
        <div className="contact-form-fields contact-form-fields-two">
          <div className="form-field">
            <label htmlFor="contact-inquiryType">Inquiry type <span aria-hidden="true">*</span></label>
            <select id="contact-inquiryType" name="inquiryType" defaultValue="general" required aria-invalid={Boolean(errors.inquiryType)} aria-describedby={errors.inquiryType ? "contact-inquiryType-error" : undefined}>
              <option value="general">General Inquiry</option>
              <option value="program">Travel Program</option>
              <option value="destination">Destination</option>
              <option value="event">Festival / Event</option>
              <option value="custom-trip">Custom Trip</option>
              <option value="corporate-group">Corporate / Group Travel</option>
              <option value="other">Other</option>
            </select>
            <FieldError id="contact-inquiryType-error" message={errors.inquiryType} />
          </div>
          <div className="form-field">
            <label htmlFor="contact-subject">Subject</label>
            <input id="contact-subject" name="subject" type="text" maxLength={120} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined} />
            <FieldError id="contact-subject-error" message={errors.subject} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" rows={6} minLength={10} maxLength={2000} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} />
          <FieldError id="contact-message-error" message={errors.message} />
        </div>
      </fieldset>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="contact-form-footer">
        <p><span aria-hidden="true">*</span> Required fields</p>
        <SubmitButton />
      </div>
    </form>
  );
}
