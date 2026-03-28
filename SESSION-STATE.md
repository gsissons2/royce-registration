# Royce Registration PWA - Session State

## Last Updated
2026-03-29 00:20 AEDT

## Current Status
**MVP FUNCTIONAL** - Core features working, needs real-world testing

## What's Working
- ✅ Home page with Staff Login button
- ✅ Admin page with PDF upload and registration list
- ✅ PDF parsing using `unpdf` library (Node.js compatible)
- ✅ Vercel Blob storage (using shared blob from amenity-cards project)
- ✅ API endpoints: /api/upload, /api/registrations, /api/registrations/[id], /api/registrations/[id]/sign
- ✅ Signature component with Apple Pencil support
- ✅ Marketing opt-out checkbox
- ✅ Dark/light mode (system preference)
- ✅ Error boundary for graceful error handling

## Known Issues / Blockers
1. **PDF field extraction** - Template PDFs have mail-merge placeholders (e.g., «cTitleGivenSurname»). Need to test with actual filled PDFs to verify regex patterns work.
2. **PWA disabled** - Service worker was causing caching issues, temporarily disabled
3. **iPad testing needed** - Haven't tested the full signing flow on iPad Pro 11" (2420x1668)

## Active Subagents
None currently running

## Repository
- GitHub: https://github.com/gsissons2/royce-registration
- Live URL: https://royce-registration.vercel.app

## GitHub Issues Status
- #1-9: Closed (completed)
- #10: Open (Integration & polish - needs E2E testing)
- #11-15: Open (bugs found during deep analysis, most now fixed)

## Next Actions (Priority Order)
1. **Test with real filled PDF** - Get a PDF with actual guest data to verify field extraction
2. **Test on iPad** - Full E2E flow: upload PDF → copy link → sign on iPad → verify submission
3. **Re-enable PWA** - Add service worker back with proper API exclusions
4. **Polish UI** - Animations, loading states, success confirmations

## Key Files Changed
- lib/pdf-parser.ts - Using `unpdf` library for Node.js PDF text extraction
- lib/storage.ts - Using Vercel Blob storage
- app/admin/page.tsx - PDF upload with error handling
- app/sign/[id]/page.tsx - iPad signing interface
- components/Signature.tsx - Apple Pencil signature pad

## Environment Variables (Production)
- BLOB_READ_WRITE_TOKEN - Shared from royce-amenity-cards project
