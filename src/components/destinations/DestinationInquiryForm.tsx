"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { submitDestinationInquiry } from "../../app/(frontend)/destinations/[slug]/actions";
import type { DestinationInquiryField, DestinationInquiryFormState } from "../../lib/inquiry-validation";
import { Icon } from "../homepage/Icon";

const initialState: DestinationInquiryFormState = { status: "idle", message: "", fieldErrors: {}, values: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button-light destination-inquiry-submit" type="submit" disabled={pending}>{pending ? "Sending…" : "Send my details"}<Icon name="arrow" size={16} /></button>;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="form-field-error" id={id} role="alert">{message}</p> : null;
}

export function DestinationInquiryForm({ destinationTitle, slug, whatsappHref }: { destinationTitle: string; slug: string; whatsappHref: string }) {
  const [state, formAction] = useActionState(submitDestinationInquiry.bind(null, slug), initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      return;
    }

    if (state.status !== "error") return;
    const fieldOrder: DestinationInquiryField[] = ["fullName", "email", "phone"];
    const firstInvalidField = fieldOrder.find((field) => state.fieldErrors[field]);
    if (firstInvalidField) document.getElementById(`destination-${firstInvalidField}`)?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="destination-inquiry-success" role="status" aria-live="polite">
        <span className="contact-form-success-icon" aria-hidden="true"><Icon name="check" size={25} strokeWidth={2.2} /></span>
        <p className="section-eyebrow">Thank you</p>
        <h2>We have your details.</h2>
        <p>{state.message}</p>
        <a className="button button-light" href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us</a>
      </div>
    );
  }

  const errors = state.fieldErrors;

  return (
    <form key={`destination-form-${state.status}-${JSON.stringify(state.values)}`} ref={formRef} className="destination-inquiry-form" action={formAction} noValidate aria-labelledby="destination-inquiry-heading">
      <div className="destination-inquiry-heading">
        <p className="section-eyebrow">Plan your {destinationTitle} journey</p>
        <h2 id="destination-inquiry-heading">Interested in {destinationTitle}?</h2>
        <p>Leave your details and the LDC Travel team will contact you.</p>
      </div>
      {state.message ? (
        <div className="destination-inquiry-message" role="alert" aria-live="polite">
          <p>{state.message}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us</a>
        </div>
      ) : null}
      <div className="destination-inquiry-fields">
        <div className="form-field">
          <label htmlFor="destination-fullName">Name <span aria-hidden="true">*</span></label>
          <input id="destination-fullName" name="fullName" type="text" autoComplete="name" maxLength={80} required defaultValue={state.values.fullName ?? ""} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "destination-fullName-error" : undefined} />
          <FieldError id="destination-fullName-error" message={errors.fullName} />
        </div>
        <div className="form-field">
          <label htmlFor="destination-email">Email <span aria-hidden="true">*</span></label>
          <input id="destination-email" name="email" type="email" autoComplete="email" maxLength={160} required defaultValue={state.values.email ?? ""} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "destination-email-error" : undefined} />
          <FieldError id="destination-email-error" message={errors.email} />
        </div>
        <div className="form-field">
          <label htmlFor="destination-phone">Phone <span aria-hidden="true">*</span></label>
          <input id="destination-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} required defaultValue={state.values.phone ?? ""} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "destination-phone-error" : undefined} />
          <FieldError id="destination-phone-error" message={errors.phone} />
        </div>
      </div>
      <div className="destination-inquiry-honeypot" aria-hidden="true">
        <label htmlFor="destination-website">Website</label>
        <input id="destination-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="destination-inquiry-footer">
        <p><span aria-hidden="true">*</span> Required fields</p>
        <SubmitButton />
      </div>
    </form>
  );
}
