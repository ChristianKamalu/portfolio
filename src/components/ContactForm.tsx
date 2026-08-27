import { useState, type FormEvent } from 'react';
import { LINKS } from '../data';
import Icon from './Icon';

/**
 * Netlify Forms, because `mailto:` is not a contact method.
 *
 * The primary CTA used to be a mailto link, which does nothing at all — no
 * error, no tab, no feedback — for anyone without a desktop mail client
 * configured, which is most people who read mail in a browser. A silently
 * dead conversion path on a lead-generating site is the worst possible bug:
 * the visitor concludes the site is broken and leaves, and nothing is logged.
 *
 * Netlify detects the form from the deployed HTML at build time, which works
 * here only because the page is prerendered. The hidden static twin in
 * index.html is the belt to that braces: if prerendering ever regresses, form
 * detection would otherwise fail silently. Keep the two field lists in sync —
 * Netlify only accepts fields it saw at deploy time.
 */

const FORM_NAME = 'contact';

interface Fields {
  name: string;
  email: string;
  message: string;
}

const EMPTY: Fields = { name: '', email: '', message: '' };

const encode = (data: Record<string, string>) =>
  Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = 'Please add your name.';
    if (!fields.email.trim()) next.email = 'Please add an email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim()))
      next.email = 'That address looks incomplete.';
    if (!fields.message.trim()) next.message = 'Tell me a little about the project.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, ...fields }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      // Never a dead end: the address is right there in the error state.
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-sent" role="status">
        <span className="form-sent-mark"><Icon name="check" size={22} /></span>
        <p className="form-sent-title">Got it &mdash; thanks{fields.name ? `, ${fields.name.trim().split(' ')[0]}` : ''}.</p>
        <p className="form-sent-body">
          I read everything that comes through here and I&rsquo;ll get back to you personally.
          If it&rsquo;s urgent, <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a> reaches me too.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} noValidate>
      {/* Netlify needs both of these in the submitted body, not just the markup. */}
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hp-field">
        <label>Leave this empty if you&rsquo;re human: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
      </p>

      <div className="field-row">
        <label className="field">
          <span className="field-label">Your name</span>
          <input
            name="name"
            value={fields.name}
            onChange={set('name')}
            aria-invalid={!!errors.name}
            autoComplete="name"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            name="email"
            type="email"
            value={fields.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
      </div>

      <label className="field">
        <span className="field-label">What do you need?</span>
        <textarea
          name="message"
          rows={4}
          value={fields.message}
          onChange={set('message')}
          aria-invalid={!!errors.message}
          placeholder="What the site needs to do, who it needs to reach, and roughly when."
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Start a project'}
        </button>
        <span className="form-alt">
          or email <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
        </span>
      </div>

      {status === 'error' && (
        <p className="form-error-note" role="alert">
          That didn&rsquo;t send &mdash; something went wrong on the way out. Please email{' '}
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a> and I&rsquo;ll pick it up there.
        </p>
      )}
    </form>
  );
}
