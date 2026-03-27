# Royce Hotel Registration Card PWA

## North Star
iPad landscape PWA for guest registration signing. Single screen, no scroll, Apple Pencil signature, dark/light mode, minimal luxury aesthetic.

## Repository
https://github.com/gsissons2/royce-registration

## Requirements Checklist
- [ ] iPad landscape, single screen, no scroll
- [ ] Apple Pencil signature with pressure sensitivity
- [ ] Dark/light mode (system preference)
- [ ] PDF upload extracts guest data
- [ ] Marketing opt-out checkbox
- [ ] Royce branding (logo, colors, typography)
- [ ] PWA installable on iPad
- [ ] Vercel deployment

## Build Phases

### Phase 1: Scaffolding ✅
- [x] Next.js 14 + TypeScript + Tailwind
- [x] PWA configuration
- [x] iPad viewport lock

### Phase 2: Core Components (IN PROGRESS)
- [ ] Branding (logo, colors, typography)
- [ ] PDF parser service
- [ ] Signature component
- [x] Marketing opt-out checkbox ✅
- [ ] Data persistence

### Phase 3: UI Integration (PENDING)
- [ ] Dark/light theming
- [ ] Registration card layout
- [ ] Admin upload interface

### Phase 4: Polish & Deploy (PENDING)
- [ ] E2E flow testing
- [ ] Animations
- [ ] Vercel deployment
- [ ] Final QA on iPad

## Quality Gates
Before each phase completion:
1. npm run build succeeds
2. No TypeScript errors
3. Components render correctly in both themes
4. Touch/pencil interactions work

## Design Reference
- Website: https://roycehotel.com.au
- Style: Golden-age glamour, opulent but refined
- Colors: Gold/brass accents, warm whites, rich darks
