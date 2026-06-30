# Constitution

These are the non-negotiable principles of The Digital Diary. Any change to
the product, design, or codebase should be checked against this document
first.

## 1. It is a diary, not a tool

The Digital Diary exists for private reflection. It is not a productivity
app, not a dashboard, and not a note-taking SaaS product. Features that
optimize for engagement, streaks, gamification, or productivity metrics do
not belong here.

## 2. Calm over clever

When in doubt, choose the calmer option: less motion, less color, less
chrome, more whitespace. The interface should never compete for the user's
attention — it should recede and let the writing matter.

## 3. Timeless over trendy

Avoid visual trends that will date quickly (heavy gradients, glassmorphism,
neon, skeuomorphism). The aesthetic target is closer to a well-made paper
notebook than to a contemporary app.

## 4. Privacy by default

This is a private diary. Any future feature involving storage, sync, or
sharing must default to the most private option available, and sharing must
always be an explicit, deliberate user action — never a default.

## 5. Build only what the current milestone requires

Each release has an explicit, scoped definition of done (see
`docs/definition-of-done.md`). Do not build ahead of the current milestone,
even if a future feature seems easy to add while already in a related file.
Scope discipline keeps the project reviewable and prevents premature
architecture decisions.

## 6. Accessibility is not optional

Semantic HTML, full keyboard operability, visible focus states, and respect
for `prefers-reduced-motion` are baseline requirements for every release, not
a future milestone.

## 7. The codebase should read like the product feels

Calm, clear, unhurried code: small functions, small components, no dead code,
no unnecessary abstraction. A future contributor (human or AI) should be able
to understand any file without additional context.
