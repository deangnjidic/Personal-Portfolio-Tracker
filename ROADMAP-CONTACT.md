# 📬 Contact & Support Page — Roadmap

Planning document for adding a contact/feedback system to both the web app and future Capacitor phone apps.

---

## Constraints

The app has **no backend server** and must stay that way. All contact options must work client-side only, preserving the zero-infrastructure design.

---

## Recommended Approach: Formspree + GitHub Issues

| Channel | Purpose |
|---|---|
| [Formspree](https://formspree.io) contact form | Bug reports, general questions, feature requests |
| GitHub Issues link | Technical users, open source contributors |
| Email (mailto fallback) | Direct contact, shown after form submit |

**Formspree free tier** allows 50 submissions/month — more than enough for a niche portfolio tracker. No backend, no API keys visible to users, submissions arrive in your email inbox.

---

## Phase 1 — Create `contact.html`

### Content sections

```
1. Header
   "Get in Touch" / "Support & Feedback"
   Subtitle: "Found a bug? Have a feature idea? Just want to say hi?"

2. Contact Form (Formspree)
   - Name (optional)
   - Email (required — so you can reply)
   - Subject dropdown:
       Bug Report
       Feature Request
       Question
       Other
   - Message textarea
   - [ Send Message ] button
   - Honeypot field (spam protection, hidden via CSS)

3. Alternative channels
   - GitHub Issues link → for technical reports
   - Email address (obfuscated to reduce spam bots)

4. Response time notice
   "I typically respond within 1–3 business days."
```

### Setup steps
- [ ] Sign up at [formspree.io](https://formspree.io) (free)
- [ ] Create a new form → get the form endpoint `https://formspree.io/f/XXXXXXXX`
- [ ] Build `contact.html` with the form pointing to that endpoint
- [ ] Add spam honeypot field (`<input name="_gotcha" style="display:none">`)
- [ ] Set Formspree redirect after submit back to `contact.html?sent=1`
- [ ] Show a success message if `?sent=1` is in the URL

---

## Phase 2 — Add Contact Links Across the Site

Once `contact.html` exists, link to it from:

- [ ] Navigation bar — add "📬 Contact" link to `navigation.css` pages
- [ ] Footer on every page
- [ ] FAQ page — "Still have a question? [Contact us →]" at the bottom
- [ ] 404 page — "Something broken? [Let us know →]"
- [ ] Updates page — "Have feedback on this release? [Get in touch →]"
- [ ] `sitemap.xml` — add `contact.html` entry

---

## Phase 3 — In-App Feedback Widget (optional enhancement)

A small persistent feedback button on the main portfolio page (`app.html`) for quick access without navigating away:

```
[?] Feedback  ← fixed button, bottom-right corner
```

Clicking opens a minimal modal:
```
┌──────────────────────────────┐
│  💬 Send Feedback            │
│                              │
│  [ Bug Report ▼ ]            │
│  ┌────────────────────────┐  │
│  │  Describe the issue... │  │
│  └────────────────────────┘  │
│                              │
│  [ Send ]  [ Cancel ]        │
└──────────────────────────────┘
```

Submits to the same Formspree endpoint. Optionally auto-appends device/browser info to the message body to help with debugging.

---

## Phase 4 — Capacitor (Phone App)

The contact form is a regular web page — it works inside the Capacitor WebView with zero changes.

Two additional considerations for the native app:

### Email client integration
```js
// Opens native mail app pre-filled
import { Browser } from '@capacitor/browser';
await Browser.open({ url: 'mailto:support@freeportfoliotracker.com?subject=App Feedback' });
```

### Native share for bug reports
```js
// Lets user share their "portfolio summary" as context for a bug report
import { Share } from '@capacitor/share';
await Share.share({
  title: 'Bug Report — Free Portfolio Tracker',
  text: `App version: 1.x\nDevice: ${deviceInfo}\n\n[Describe issue here]`,
  dialogTitle: 'Send Bug Report'
});
```

---

## Spam Protection

- Formspree has built-in spam filtering
- Add a CSS-hidden honeypot field (`_gotcha`) — bots fill it, humans don't, Formspree discards those submissions automatically
- Do **not** display your email address in plain text — use `mailto:` only after form submit, or encode it

---

## Estimated Effort

| Task | Effort |
|---|---|
| Formspree account + form setup | 20 min |
| Build `contact.html` | 1–2 hrs |
| Add nav/footer links sitewide | 30 min |
| In-app feedback widget | 1–2 hrs |
| Capacitor native integration | 30 min |
| **Total** | **~3–5 hours** |
