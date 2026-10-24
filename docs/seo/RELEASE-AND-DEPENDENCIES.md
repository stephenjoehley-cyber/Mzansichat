# MzansiChat SEO / AI-search rollout — implementation and acceptance controls
Date prepared: 24 October 2026
Status: DRAFT — no production deployment authorised.

## Implemented in the Draft PR
- Six-page GA4 tag (`G-S5FQXPML7X`), consent/analytics disclosure update and `whatsapp_click` events with source location labels; click does **not** mean a message was sent or a booking made
- Exact approved four-page SEO title/description copy; all six-page Open Graph location/site tags; self-canonical preserved
- Answer-first sentences, existing founder biography preserved, added Person schema, ProfessionalService+WebSite on home, WebPage on other routes, matching on-page FAQPage on home
- 10 homepage FAQs, including appropriate opt-in/POPIA caution
- New `sitemap.xml`, `robots.txt`, optional `llms.txt`, dedicated favicon ICO/SVG and Apple touch PNG
- Quick Cuts example-month links from About and Contact; previous Growth Setup links preserved
- Three niche page drafts and three article outlines in `docs/seo/` only — not published and not included in sitemap

## Blocks before production acceptance

### 1) DNS and HTTPS — READY FOR HUMAN ACTION (read-only evidence first)
The submitted brief reports a Cloudflare apex 403 Error 1000 and uncertainty about HTTP → HTTPS. Neither is independently verified in this chat because direct external website requests return an upstream fetch error. **Do not delete A/AAAA, move nameservers or alter MX/SPF/DKIM.**

Stephen: in the **active delegated** Cloudflare zone for `mzansichat.co.za`, supply a screenshot of the DNS records filtered to root `@` and `www`, including proxied flags, and Workers & Pages → mzansichat → Custom domains. Redact unrelated sensitive items. Only then choose a smallest-safe Cloudflare Pages apex association and a 301 apex → `https://www.mzansichat.co.za` preserving path/query. Verify both HTTP and HTTPS and all site/email DNS remain healthy. Avoid changing nameservers. Follow current Cloudflare official documentation, not an old configuration guess.

### 2) Analytics permission and accuracy — TESTING
- Confirm measurement ID `G-S5FQXPML7X` belongs to Stephen's intended MzansiChat GA4 web stream before release.
- GA4/Google may use cookies and collect technical data. The privacy notice now discloses this material addition and has a new update date. Stephen must approve the changed legal text and any consent-banner/consent-mode requirement for his audience before activating GA4 in production.
- Test one click on each major WhatsApp CTA using GA4 Realtime or DebugView. `whatsapp_click` should contain `link_location` and `page_path`, but never the prefilled enquiry string or phone number. `example-month` must not be mislabelled `footer`.
- In GA4, create event-scoped custom dimension `link_location` and mark `whatsapp_click` a key event **only after observed events confirm correct measurement**. This is a click proxy, not a lead/booking.
- Document GA4 property ownership and measurement access. Do not claim live tracking before verified.

### 3) Search engines and AI bots — TESTING
- Check the deployed site's `/robots.txt` and confirm Cloudflare-managed Content Signals remain present if enabled; static robots directives and WAF policy are separate controls. Do not silently turn off AI training blocks in Cloudflare if deliberate client policy.
- Check Cloudflare AI Crawl Control/Bot Preference Sync for search and agent crawlers, and verify Googlebot is not blocked.
- Validate `/sitemap.xml` returns HTTP 200, contains only six actual published canonical pages, and XML parses.
- Check JSON-LD syntax with Schema Markup Validator, then Google Rich Results Test. Note: Google normally restricts FAQ rich results to authoritative government and health sites; a syntax PASS does not mean MzansiChat is eligible. A service-area business without a public street address may not qualify for every LocalBusiness rich result.
- No `llms.txt` Google ranking claim: Google's search documentation says Google Search ignores it.
- Check desktop, 393px mobile, navigation, live images, Console and core web vitals. Verify old `#quick-cuts-example-month` and new `#example-month` anchors.

### 4) Search Console and offsite business records — READY FOR HUMAN ACTION
- Stephen authenticates/authorises a Google Search Console domain property for `mzansichat.co.za`, adds only the exact TXT value Google provides to the verified active DNS zone, and then submits `https://www.mzansichat.co.za/sitemap.xml` **after deployment**.
- Google Business Profile: Stephen creates/verifies a truthful service-area listing without disclosing a street address; share verified URL to incorporate in `sameAs`.
- LinkedIn company page, verified local directories and relevant genuine editorial mentions: future offsite tasks, never fabricate backlinks or profiles.
- Request review from Andi only after a real GBP review link is available; no fabricated reviews.

### 5) Image derivatives — READY FOR HUMAN ACTION
- Original six 1080×1350 WebP images remain unchanged.
- Six 540×675 mobile derivative WebPs are prepared as a separate upload packet. **They must be uploaded to the feature branch** at `public/images/quick-cuts/`, never directly to main. Only after their SHA/file presence is verified should `srcset` reference them on the six Growth gallery cards and P01/P04/P07 homepage teaser.
- This avoids shipping broken mobile thumbnail URLs.
- Verify no deterioration in artwork readability; source images must remain as high-density 2× choices.

### 6) Niche/article drafts — APPROVE, not published
The `docs/seo/` outlines are not public landing pages. After Stephen approves subject-specific copy and customer outcomes, implement and test each as a separate follow-on change, then add it to the sitemap and home/footer navigation. Do not link to unpublished pages.

## Release gate
- [ ] Stephen approves visible page copy, FAQ copy and privacy notice change.
- [ ] External DNS baseline and safe redirect approach verified, with explicit operator authorisation for DNS changes.
- [ ] All WebP derivatives uploaded and checked if `srcset` is to be part of this PR.
- [ ] Desktop/mobile, structured data, sitemap, robots and clicks checked in Cloudflare Preview.
- [ ] PR reviewed, no broken links or missing assets.
- [ ] Merge only after Stephen's approval.
- [ ] Capture Cloudflare production deployment commit and post-deploy smoke tests; only then mark production DONE.

## Authoritative context and caveats
Google Search Central's guidance for AI Overviews/AI Mode says useful, reliable content and conventional SEO are foundational, with **no separate AI schema requirement**. Google Search ignores `llms.txt`. FAQ structured data does not routinely yield search enhancements for commercial sites. Cloudflare managed robots policies can be injected or affect traffic independently. No traffic/ranking guarantees are made.
