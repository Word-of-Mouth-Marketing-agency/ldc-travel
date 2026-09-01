"use client";

export default function HomepageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-shell">
      <div className="error-shell-inner">
        <p className="error-shell-mark">LDC Travel · Tourism Marketing</p>
        <h1>We’re refreshing this page.</h1>
        <p>Our travel content is temporarily unavailable. Please try again in a moment.</p>
        <button className="button button-primary" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
