"use client";

import { createContext, type ReactNode, type RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitCustomTripInquiry } from "../../app/(frontend)/actions";
import type { CustomTripInquiryField, CustomTripInquiryFormState } from "../../lib/inquiry-validation";
import { Icon } from "../homepage/Icon";

type DesignYourTripContextValue = {
  openDesignYourTrip: (trigger?: HTMLButtonElement | null, focusReturnTarget?: HTMLElement | null) => void;
};

const DesignYourTripContext = createContext<DesignYourTripContextValue | null>(null);

const initialState: CustomTripInquiryFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {},
};

function useDesignYourTrip() {
  const context = useContext(DesignYourTripContext);
  if (!context) throw new Error("DesignYourTrip components must be rendered inside DesignYourTripProvider.");
  return context;
}

export function DesignYourTripProvider({ children, whatsappHref }: { children: ReactNode; whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);

  const openDesignYourTrip = useCallback((trigger?: HTMLButtonElement | null, focusReturnTarget?: HTMLElement | null) => {
    triggerRef.current = trigger ?? (document.activeElement instanceof HTMLButtonElement ? document.activeElement : null);
    focusReturnRef.current = focusReturnTarget ?? triggerRef.current;
    setOpen(true);
  }, []);

  const closeDesignYourTrip = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => focusReturnRef.current?.focus());
  }, []);

  return (
    <DesignYourTripContext.Provider value={{ openDesignYourTrip }}>
      {children}
      <DesignYourTripDialog open={open} onClose={closeDesignYourTrip} whatsappHref={whatsappHref} />
    </DesignYourTripContext.Provider>
  );
}

export function DesignYourTripTrigger({ className, onOpen, returnFocusRef }: { className: string; onOpen?: () => void; returnFocusRef?: RefObject<HTMLElement | null> }) {
  const { openDesignYourTrip } = useDesignYourTrip();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={triggerRef}
      className={className}
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        onOpen?.();
        openDesignYourTrip(triggerRef.current, returnFocusRef?.current);
      }}
    >
      <span>Design Your Trip</span>
      <Icon name="arrow" size={16} />
    </button>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary design-trip-submit" type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send My Trip Request"}
      <Icon name="arrow" size={16} />
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="form-field-error" id={id} role="alert">{message}</p> : null;
}

function DesignYourTripDialog({ open, onClose, whatsappHref }: { open: boolean; onClose: () => void; whatsappHref: string }) {
  const [state, formAction] = useActionState(submitCustomTripInquiry, initialState);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (state.status !== "error") return;
    const fieldOrder: CustomTripInquiryField[] = ["fullName", "email", "phone", "destinationText", "travelers", "preferredTravelDates", "tripNotes"];
    const firstInvalidField = fieldOrder.find((field) => state.fieldErrors[field]);
    if (firstInvalidField) document.getElementById(`design-trip-${firstInvalidField}`)?.focus();
  }, [state]);

  if (!open) return null;

  const errors = state.fieldErrors;

  return (
    <div className="design-trip-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} className="design-trip-dialog" role="dialog" aria-modal="true" aria-labelledby="design-trip-heading" aria-describedby="design-trip-description">
        <div className="design-trip-dialog-header">
          <div>
            <p className="section-eyebrow">Tailored for You</p>
            <h2 id="design-trip-heading">Design Your Trip</h2>
          </div>
          <button ref={closeButtonRef} className="design-trip-close" type="button" aria-label="Close Design Your Trip form" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <p id="design-trip-description" className="design-trip-description">Tell us what you have in mind and the LDC Travel team will help shape your trip.</p>

        {state.status === "success" ? (
          <div className="design-trip-success" role="status" aria-live="polite">
            <span className="contact-form-success-icon" aria-hidden="true"><Icon name="check" size={25} strokeWidth={2.2} /></span>
            <h3>Thanks — we’ve received your request.</h3>
            <p>{state.message}</p>
            <a className="button button-secondary" href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us</a>
          </div>
        ) : (
          <form key={`design-trip-form-${state.status}-${JSON.stringify(state.values)}`} className="design-trip-form" action={formAction} noValidate>
            {state.message ? (
              <div className="design-trip-message" role="alert" aria-live="polite">
                <p>{state.message}</p>
                {state.message.includes("WhatsApp") ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us</a> : null}
              </div>
            ) : null}

            <div className="design-trip-fields">
              <div className="form-field">
                <label htmlFor="design-trip-fullName">Full name <span aria-hidden="true">*</span></label>
                <input id="design-trip-fullName" name="fullName" type="text" autoComplete="name" maxLength={80} required defaultValue={state.values.fullName ?? ""} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "design-trip-fullName-error" : undefined} />
                <FieldError id="design-trip-fullName-error" message={errors.fullName} />
              </div>
              <div className="form-field">
                <label htmlFor="design-trip-email">Email <span aria-hidden="true">*</span></label>
                <input id="design-trip-email" name="email" type="email" autoComplete="email" maxLength={160} required defaultValue={state.values.email ?? ""} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "design-trip-email-error" : undefined} />
                <FieldError id="design-trip-email-error" message={errors.email} />
              </div>
              <div className="form-field">
                <label htmlFor="design-trip-phone">Phone <span aria-hidden="true">*</span></label>
                <input id="design-trip-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} required placeholder="+966 5X XXX XXXX" defaultValue={state.values.phone ?? ""} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "design-trip-phone-error" : undefined} />
                <FieldError id="design-trip-phone-error" message={errors.phone} />
              </div>
              <div className="form-field">
                <label htmlFor="design-trip-travelers">Number of travelers <span aria-hidden="true">*</span></label>
                <input id="design-trip-travelers" name="travelers" type="number" min={1} max={100} step={1} inputMode="numeric" required defaultValue={state.values.travelers ?? ""} aria-invalid={Boolean(errors.travelers)} aria-describedby={errors.travelers ? "design-trip-travelers-error" : undefined} />
                <FieldError id="design-trip-travelers-error" message={errors.travelers} />
              </div>
              <div className="form-field design-trip-field-wide">
                <label htmlFor="design-trip-destinationText">Destination <span aria-hidden="true">*</span></label>
                <input id="design-trip-destinationText" name="destinationText" type="text" autoComplete="off" maxLength={120} required placeholder="Where would you like to go?" defaultValue={state.values.destinationText ?? ""} aria-invalid={Boolean(errors.destinationText)} aria-describedby={errors.destinationText ? "design-trip-destinationText-error" : undefined} />
                <FieldError id="design-trip-destinationText-error" message={errors.destinationText} />
              </div>
              <div className="form-field design-trip-field-wide">
                <label htmlFor="design-trip-preferredTravelDates">Preferred travel dates <span className="design-trip-optional">Optional</span></label>
                <input id="design-trip-preferredTravelDates" name="preferredTravelDates" type="text" autoComplete="off" maxLength={120} placeholder="e.g. 10–17 December" defaultValue={state.values.preferredTravelDates ?? ""} aria-invalid={Boolean(errors.preferredTravelDates)} aria-describedby={errors.preferredTravelDates ? "design-trip-preferredTravelDates-error" : undefined} />
                <FieldError id="design-trip-preferredTravelDates-error" message={errors.preferredTravelDates} />
              </div>
              <div className="form-field design-trip-field-wide">
                <label htmlFor="design-trip-tripNotes">Tell us about your trip <span className="design-trip-optional">Optional</span></label>
                <textarea id="design-trip-tripNotes" name="tripNotes" rows={4} maxLength={2000} placeholder="Tell us anything you’d like us to know about your trip." defaultValue={state.values.tripNotes ?? ""} aria-invalid={Boolean(errors.tripNotes)} aria-describedby={errors.tripNotes ? "design-trip-tripNotes-error" : undefined} />
                <FieldError id="design-trip-tripNotes-error" message={errors.tripNotes} />
              </div>
            </div>

            <div className="design-trip-honeypot" aria-hidden="true">
              <label htmlFor="design-trip-website">Website</label>
              <input id="design-trip-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="design-trip-form-footer">
              <p><span aria-hidden="true">*</span> Required fields</p>
              <SubmitButton />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
