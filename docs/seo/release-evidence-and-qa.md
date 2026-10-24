# MzansiChat SEO / GA4 release evidence and acceptance checklist
Updated 24 October 2026. Status: IN PROGRESS. PR #5 is draft; do not merge until gates pass.

## Verified project evidence
- Canonical live domain: `https://www.mzansichat.co.za`. Cloudflare root-to-www 301 rule `Apex to WWW` shown active (1/10); human browser screenshot confirms `/growth-setup?source=redirect-test` reaches same path at www, preserves query; the link-opening UI also added `utm_source=chatgpt.com`.
- Google Analytics property screenshot: name `Mzansichat AI`, stream URL `https://mzansichat.co.za`, stream ID `13210804420`, Measurement ID `G-S5FQXPML7X`, enhanced measurement enabled. Identity is CONFIRMED; the old `data collection isn't active` warning is not proof of failed code while the branch is unmerged.
- Six pages: GA4 loader/config source, all 25 detected WhatsApp links with `data-link-location` attributes, valid JSON-LD parsed from fetched page source; canonical/OG metadata present. No claim of successful live collection.
- Sitemap/robots/optional llms and icon files are in PR #5; not yet on live site.
- Proposed niche and editorial outlines are documents under `docs/seo/`, not published pages.

## Pre-merge gates
1. **LEGAL / PRIVACY — APPROVE:** Review exact privacy notice change describing GA4, browser/device data and cookie use. Determine any necessary cookie/consent controls; do not assume a written policy alone establishes lawful consent. Approval must be explicit. No passwords/tokens required.
2. **TRACKING — CONFIRMED ID, TEST NOT STARTED:** After approved preview or production deployment, visit each page; confirm GA4 page_view and `whatsapp_click` in GA4 DebugView or real-time events; check per-link `page_path` and `link_location`; no customer phone numbers, WhatsApp prefilled messages or names in custom event payloads. Test WhatsApp CTA on desktop and phone; ensure correct +27663303413 recipient.
3. **STATIC FILES:** Test HTTPS 200 for `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/favicon.ico`; ensure XML parses and all six sitemap URLs respond 200 and canonicalise to www.
4. **SEO:** Inspect titles, descriptions, OG preview, H1, JSON-LD and mobile layouts. Validate FAQ JSON-LD content against visible homepage answers. Confirm no duplicate canonicals and the existing founding biography remains intact.
5. **IMAGES — OPEN:** Original 1080×1350 Quick Cuts posters remain loaded with `loading=lazy`, `decoding=async`, width/height and descriptive alt. Six 540×675 WebPs prepared separately (288,774 bytes combined) but not in this branch. Upload to `public/images/quick-cuts/`, then add only matching verified `srcset` for thumbnails while retaining originals for full-size viewing. Recheck rendering/mobile before merge.
6. **CLOUDFLARE:** Repeat checks for root homepage and one other deep link with query, including HTTPS and HTTP input; check www HTTPS remains direct and secure. Keep MX, DKIM, SPF, mail subdomains, existing www CNAME and Cloudflare nameservers unchanged.
7. **BUSINESS FACTS:** Confirm pricing remains R5,950 build / R3,495 monthly, the Meta-approved-template promise is accurate, client bookings remain client-handled, and no fictitious Quick Cuts performance stats.
8. **RELEASE CONTROL:** PR #5 stays draft until Stephen's sign-off, privacy gate, preview QA and measurement test plan are accepted. After merge, monitor Cloudflare production deployment; run all live checks; keep rollback as revert PR/previous successful Pages deployment. Record evidence before DONE.

## Final outcome measures (not assumed)
- Organic search: GA4 engaged sessions and Google Search Console clicks/impressions per landing page (baseline unknown until enabled).
- WhatsApp: labelled CTA clicks by page/location; separate actual conversations/enquiries/bookings when client data exists.
- AI search: crawler access and qualified referral visits; no guaranteed rankings or inclusion claim.

## Live test addresses
- `http://mzansichat.co.za/` -> `https://www.mzansichat.co.za/`
- `https://mzansichat.co.za/about-us?source=seo-test` -> `https://www.mzansichat.co.za/about-us?source=seo-test`
- `https://www.mzansichat.co.za/growth-setup#example-month` -> correct anchored section
- `https://www.mzansichat.co.za/robots.txt`, `/sitemap.xml`, `/llms.txt`

## Human approvals still genuinely needed
- Stephen: approve exact revised privacy wording/consent approach; approve releasing PR #5 only after reviewed preview tests.
- Google Search Console: verified property access and sitemap submission when deployed; account-dependent.
