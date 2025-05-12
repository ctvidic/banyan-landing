# Landing Page Enhancement TODOs

Based on o3's feedback:

## 1. Nail the Hero Message

- [ ] Update H1 to: "Pay Your Child to Learn
- [ ] Style H1: Make "Pay" bold and use brand green color, rest near-black.
- [ ] Add H2 (supporting, one line): "They'll master real‑world money skills and earn up to $40/mo back from your subscription."

## 2. Make the Value Obvious at a Glance

- [ ] Replace the current money gauge animation with an "Up to $40/mo" donut chart that animates from 0 to 40 on load.
- [ ] Overlay a short (3-4 sec) looped, muted video on the phone mock-up showing XP gain, balance increase, and mascot thumbs-up.
- [ ] Change Primary CTA text to: "Join the Waitlist – It's Free".
- [ ] Ensure Primary CTA is full-width on mobile.
- [ ] Change Secondary CTA to a ghost button style with text: "How It Works".
- [ ] Add Trust Badges below CTAs: FDIC-insured partner bank logo, COPPA-compliant icon, Apple/Google Pay icons.

## 3. Instantly Convey Exclusivity & Scarcity

- [ ] Add a live counter under the primary CTA: "[Number] families on the waitlist" (needs mechanism to auto-increment).
- [ ] Add a ribbon/banner in the navigation bar: "Next Cohort Opens [Month] →".
- [ ] Implement a sticky CTA: Subtly darken the primary CTA button when the user scrolls past the first fold.

## 4. Visual Storytelling Tweaks

- [x] Integrate Red-Panda Mascot:
    - [x] Add a semi-transparent panda silhouette behind the hero gradient (left side).
    - [x] Add a full-color panda badge onto the phone screen mock-up/video.
- [ ] Upgrade Hero Gradient: Introduce a warmer secondary color (e.g., sunrise gold) sweeping in from the bottom-left.
- [ ] Use Luxury Micro-copy:
    - [ ] Replace standard bullet points with feather or leaf icons.
    - [ ] Use phrases like "curated curriculum" and "bespoke learning path" where appropriate.

## 5. Surface the "Learn → Earn" Mechanics

- [ ] Add a 3-step horizontal graphic bar directly below the hero section: Learn → Quiz → Earn $.
    - [ ] Each step needs an icon and a short (~4 word) caption.
    - [ ] Implement hover/tap tooltips for each step with a brief explanation (max 15 words).
- [ ] Add a small, inline "Earnings Estimator" widget.
    - [ ] Use a slider for "modules completed per week".
    - [ ] Display the estimated monthly dollar earnings based on the slider input.

## 6. Social Proof & Authority

- [ ] Re-enable and enhance the Parent Testimonial section (currently commented out).
    - [ ] Ensure it appears by the third scroll depth.
    - [ ] Format: Headshot, quote overlay, teen's first name.
- [ ] Add an "Expert Endorsement" badge/section near the module grid: "Curriculum designed by CFA® charterholders and former Google AI educators."

## 7. Performance & UX Polish

- [ ] Optimize for First Contentful Paint (< 1.5s):
    - [ ] Serve the hero phone mock-up image/video in WebP format.
    - [ ] Implement lazy loading for all images below the fold.
- [ ] Accessibility Check: Ensure color contrast for text (especially the mint-green CTA) on gradient backgrounds meets WCAG AA standards.
- [ ] Mobile Responsiveness (≤768px viewport):
    - [ ] Move the phone mock-up below the headline text.
    - [ ] Ensure CTAs are stacked vertically. 