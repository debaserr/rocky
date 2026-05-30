'use client';

import { useState, useTransition } from 'react';
import { RKButton } from '@/components/ui/rk-button';
import { sendMagicLink } from './actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);
      await sendMagicLink(formData);
      setSubmitted(true);
    });
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '36px 28px 28px',
        minHeight: '100dvh',
      }}
    >
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: 'var(--rk-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--rk-accent-ink)',
            font: '700 17px var(--rk-font)',
            letterSpacing: -0.5,
          }}
        >
          R
        </div>
        <div style={{ font: '700 22px var(--rk-font)', letterSpacing: -0.6 }}>rocky</div>
      </div>

      <div style={{ flex: 1 }} />

      {!submitted ? (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: -0.8,
              }}
            >
              Sign in.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: 'var(--rk-text-dim)',
                margin: '12px 0 0',
                lineHeight: 1.4,
                maxWidth: 280,
              }}
            >
              We&apos;ll email you a magic link. No password.
            </p>
          </div>

          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: 8,
              fontFamily: 'var(--rk-font)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: 'var(--rk-text-muted)',
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@workout.gym"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{
              height: 60,
              padding: '0 18px',
              borderRadius: 12,
              background: 'var(--rk-surface)',
              border: '1px solid var(--rk-line)',
              color: 'var(--rk-text)',
              font: '500 17px var(--rk-font)',
              outline: 'none',
              marginBottom: 14,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
          <RKButton onClick={handleSubmit} disabled={pending || !email}>
            Send magic link
          </RKButton>

          <p
            style={{
              fontSize: 12,
              color: 'var(--rk-text-muted)',
              textAlign: 'center',
              marginTop: 24,
              fontFamily: 'var(--rk-mono)',
              letterSpacing: 0.2,
            }}
          >
            BWF Primer · v0.4
          </p>
        </>
      ) : (
        <ConfirmationCard email={email} />
      )}

      <div style={{ height: 32 }} />
    </div>
  );
}

function ConfirmationCard({ email }: { email: string }) {
  return (
    <div style={{ textAlign: 'left' }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'var(--rk-surface)',
          border: '1px solid var(--rk-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 22,
        }}
      >
        <svg
          width={26}
          height={26}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--rk-accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.1,
          margin: 0,
          letterSpacing: -0.6,
        }}
      >
        Check your email.
      </h1>
      <p
        style={{
          fontSize: 16,
          color: 'var(--rk-text-dim)',
          margin: '12px 0 24px',
          lineHeight: 1.5,
        }}
      >
        We sent a link to <span style={{ color: 'var(--rk-text)' }}>{email}</span>. Tap it on this
        device to sign in.
      </p>
    </div>
  );
}
