# Step-by-Step Drawing Tutorial Platform
## Complete Product & Development Specification

---

# 1. PRODUCT OVERVIEW

Build a fast, SEO-focused drawing tutorial website that teaches users how to draw the same subject at different skill levels.

Every drawing subject can have three versions:

- Beginner
- Intermediate
- Advanced

Examples:

- Coconut Tree
- Palm Tree
- Boat on a Shore
- Sunset
- Tropical Beach
- Lighthouse
- Surfboard
- Beach House
- Dog
- Butterfly
- Flower
- Mountain
- Sailboat
- Seashell

The core product concept is:

> Learn to draw the same subject at your skill level.

A visitor might start with:

Coconut Tree — Beginner

and later progress to:

Coconut Tree — Intermediate

and finally:

Coconut Tree — Advanced

The website should make this progression extremely clear.

---

# 2. BUSINESS MODEL

Use a freemium model.

## Beginner

Beginner tutorials are generally free.

Goals:

- attract visitors through Google
- attract visitors through social media and Pinterest
- introduce users to the teaching style
- allow users to experience the product without registration
- encourage progression to higher levels

No account should be required to view free tutorials.

---

## Intermediate

Intermediate tutorials use mixed access.

Some are:

FREE

Others are:

PREMIUM

Free intermediate tutorials demonstrate the additional value available beyond beginner lessons.

---

## Advanced

Advanced tutorials are primarily premium.

However, the platform must allow selected advanced tutorials to be made free.

This allows high-quality advanced tutorials to serve as premium samples.

---

# 3. FUTURE PRODUCTS

The architecture should eventually support:

- monthly membership
- annual membership
- one-time tutorial packs
- printable collections
- themed drawing packs
- downloadable PDFs

Possible future packs:

Tropical Drawing Pack

Animal Drawing Pack

Flower Drawing Pack

Landscape Drawing Pack

Ocean & Beach Drawing Pack

Architecture Drawing Pack

Do NOT implement one-time packs in the initi unless explicitly requested later.

The architecture should simply avoid making them impossible to add.

---

# 4. IMPORTANT CONTENT PRODUCTION RULE

Tutorial artwork is NOT created by the website.

Tutorial images will be created separately outside the application.

The content-production workflow is independent from software development.

The website is responsible for:

- publishing
- organizing
- displaying
- protecting
- monetizing
- searching
- categorizing
- tracking

tutorial content.

It is NOT responsible for generating the drawings.

DO NOT implement AI image generation.

DO NOT integrate image-generation APIs.

DO NOT automatically create tutorial artwork.

---

# 5. TUTORIAL CONTENT WORKFLOW

Tutorial images are created externally.

The workflow is:

Create tutorial artwork externally

↓

Review tutorial manually

↓

Correct drawing/instruction problems

↓

Export final image

↓

Open website Admin

↓

Find or create tutorial subject

↓

Choose Beginner / Intermediate / Advanced

↓

Upload finished tutorial image

↓

Upload optional preview

↓

Upload optional printable PDF

↓

Add/update written information

↓

Preview page

↓

Publish

---

# 6. EXAMPLE CONTENT WORKFLOW

Subject:

Coconut Tree

Assets might be:

Beginner
- beginner coconut tree tutorial

Intermediate
- intermediate coconut tree tutorial

Advanced
- advanced coconut tree tutorial

Each difficulty level is independent.

Updating:

Advanced Coconut Tree

must NOT affect:

Beginner Coconut Tree

or:

Intermediate Coconut Tree.

---

# 7. CONTENT CAN BE RELEASED GRADUALLY

A tutorial does NOT require all three difficulty levels before publishing.

Example:

Week 1:

Coconut Tree
- Beginner ✓
- Intermediate ○
- Advanced ○

Week 2:

Coconut Tree
- Beginner ✓
- Intermediate ✓
- Advanced ○

Week 3:

Coconut Tree
- Beginner ✓
- Intermediate ✓
- Advanced ✓

The URL remains:

/draw/coconut-tree

throughout the entire process.

Do not create a new URL when a new difficulty level is added.

---

# 8. CORE TECH STACK

Use:

## Application

Next.js

TypeScript

App Router

React Server Components where appropriate

---

## Styling

Tailwind CSS

shadcn/ui

Lucide icons

---

## Database

Supabase

PostgreSQL

---

## Authentication

Supabase Auth

Initially support:

- email/password
- magic link

Architecture should allow Google OAuth later.

---

## Payments

Stripe

Initially support:

- monthly subscription
- annual subscription

Later:

- one-time tutorial packs

---

## Asset Storage

Cloudflare R2

Store:

- thumbnails
- tutorial images
- premium tutorial images
- preview images
- printable PDFs
- downloadable assets

---

## Email

Resend

Use when transactional email becomes necessary.

---

## Analytics

Start with:

- Google Search Console

Add product analytics such as PostHog when useful.

The application should have an analytics abstraction so analytics providers can change later.

---

## Monitoring

Sentry can be introduced after the MVP.

---

## Deployment

Vercel

---

# 9. DEVELOPMENT PRINCIPLES

Optimize for:

1. SEO
2. fast page loads
3. mobile-first UX
4. simple content administration
5. low infrastructure cost
6. secure premium content
7. scalability to hundreds or thousands of tutorials
8. minimal maintenance
9. easy content replacement
10. clear Beginner → Intermediate → Advanced progression

Do NOT over-engineer.

Do NOT use microservices.

Use one Next.js application and managed external services.

---

# 10. HIGH-LEVEL APPLICATION STRUCTURE

Recommended structure:

app/
    page.tsx

    draw/
        page.tsx

        [slug]/
            page.tsx

        category/
            [slug]/
                page.tsx

    search/
        page.tsx

    pricing/
        page.tsx

    login/
        page.tsx

    signup/
        page.tsx

    account/
        page.tsx

    admin/
        page.tsx

        tutorials/
            page.tsx

            new/
                page.tsx

            [id]/
                page.tsx

        categories/
            page.tsx

    api/
        stripe/
            checkout/
            webhook/
            portal/

        assets/
            signed-url/

components/
    layout/
    tutorial/
    paywall/
    auth/
    pricing/
    search/
    admin/
    ui/

lib/
    supabase/
    stripe/
    r2/
    auth/
    tutorials/
    entitlements/
    seo/
    analytics/

types/

public/

---

# 11. DATABASE MODEL

Use migrations for all schema changes.

---

# 12. PROFILES TABLE

Table:

profiles

Fields:

id UUID PRIMARY KEY

display_name TEXT

avatar_url TEXT

role TEXT DEFAULT 'user'

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

The ID corresponds to the Supabase Auth user.

Possible roles:

user

admin

Do not trust a role supplied by the client.

---

# 13. CATEGORIES TABLE

Table:

categories

Fields:

id UUID PRIMARY KEY

name TEXT NOT NULL

slug TEXT UNIQUE NOT NULL

description TEXT

image_key TEXT

sort_order INTEGER DEFAULT 0

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

Examples:

Animals

Beach & Ocean

Nature

Flowers

Landscapes

Buile tutorials table represents the SUBJECT.

Example:

Coconut Tree

NOT:

Advanced Coconut Tree

Fields:

id UUID PRIMARY KEY

title TEXT NOT NULL

slug TEXT UNIQUE NOT NULL

description TEXT

category_id UUID REFERENCES categories(id)

featured_image_key TEXT

seo_title TEXT

seo_description TEXT

status TEXT

featured BOOLEAN DEFAULT FALSE

published_at TIMESTAMPTZ

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

Status values:

draft

published

archived

---

# 15. TUTORIAL LEVELS TABLE

Each tutorial can have three difficulty levels.

Table:

tutorial_levels

Fields:

id UUID PRIMARY KEY

tutorial_id UUID REFERENCES tutorials(id)

difficulty TEXT NOT NULL

access_type TEXT NOT NULL

tutorial_image_key TEXT

preview_image_key TEXT

printable_file_key TEXT

introduction TEXT

step_count INTEGER

artwork_status TEXT

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

Difficulty values:

beginner

intermediate

advanced

Access values:

free

premium

Artwork status values initially:

draft

published

Potential future values:

missing

draft

review

approved

published

Constraint:

UNIQUE(tutorial_id, difficulty)

---

# 16. TUTORIAL STEPS TABLE

Structured steps are OPTIONAL for MVP.

The uploaded tutorial image is the authoritative visual learning asset.

Do NOT require structured steps in order to publish a tutorial.

A future table may be:

tutorial_steps

Fields:

id UUID PRIMARY KEY

tutorial_level_id UUID REFERENCES tutorial_levels(id)

step_number INTEGER

title TEXT

instruction TEXT

image_key TEXT

created_at TIMESTAMPTZ

Structured steps may eventually support:

- accessibility
- interactive step mode
- individual step zooming
- SEO content
- mobile step-by-step mode
- alternative printable formats

They must NOT be used to automatically generate tutorial artwork.

---

# 17. SUBSCRIPTIONS TABLE

Table:

subscriptions

Fields:

id UUID PRIMARY KEY

user_id UUID

stripe_customer_id TEXT

stripe_subscription_id TEXT UNIQUE

stripe_price_id TEXT

status TEXT

current_period_end TIMESTAMPTZ

cancel_at_period_end BOOLEAN

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

Stripe webhook events are the source of truth.

Never trust client-side subscription state.

---

# 18. FAVORITES TABLE

This is optional after MVP.

Table:

favorites

Fields:

user_id UUID

tutorial_id UUID

created_at TIMESTAMPTZ

Composite primary key:

user_id + tutorial_id

---

# 19. ASSET DATABASE RULE

Store R2 OBJECT KEYS in the database.

Do NOT store temporary signed URLs.

Example:

tutorials/coconut-tree/advanced/tutorial-uuid.webp

The application generates the appropriate URL when needed.

---

# 20. ASSET ORGANIZATION

Recommended R2 structure:

tutorials/
    coconut-tree/
        thumbnail/
            thumbnail.webp

        beginner/
            tutorial-uuid.webp
            printable-uuid.pdf

        intermediate/
            tutorial-uuid.webp
            preview-uuid.webp
            printable-uuid.pdf

        advanced/
            tutorial-uuid.webp
            preview-uuid.webp
            printable-uuid.pdf

    butterfly/
        thumbnail/
            thumbnail.webp

        beginner/
            tutorial-uuid.webp

        intermediate/
            tutorial-uuid.webp
            preview-uuid.webp

        advanced/
            tutorial-uuid.webp
            preview-uuid.webp
            printable-uuid.pdf

Use unique/versioned filenames.

Avoid relying on overwriting the exact same object key.

This helps avoid CDN caching problems.

---

# 21. IMAGE TYPES

The system should distinguish between:

## Thumbnail

Used for:

- tutorial cards
- category pages
- homepage
- related tutorials

---

## Tutorial Image

The primary instructional worksheet.

---

## Preview Image

A deliberately created public preview for premium content.

The preview must NOT simply be the protected full-resolution image blurred with CSS.

---

## Printable File

Usually:

PDF

or high-resolution print asset.

Premium printable files must be protected.

---

# 22. IMAGE REPLACEMENT

Replacing artwork must be easy.

When replacing an image:

1. Upload new asset.
2. Validate file.
3. Store new asset in R2.
4. Update database reference.
5. Revalidate affected page.
6. Confirm new asset works.
7. Old asset can be cleaned up later.

Do NOT delete the previous asset before the new database update succeeds.

The tutorial URL must remain unchanged.

Example:

/draw/coconut-tree

must remain the same after replacing the artwork.

---

# 23. ADMIN CONTENT PROGRESS

Admin should clearly show which artwork exists.

Example:

| Tutorial | Beginner | Intermediate | Advanced | Status |
|---|---|---|---|---|
| Coconut Tree | ✓ | ✓ | ✓ | Published |
| Sunset | ✓ | ✓ | ✓ | Published |
| Butterfly | ✓ | ○ | ○ | Partial |
| Lighthouse | ✓ | ✓ | ○ | Partial |
| Dog | ✓ | ○ | ○ | Partial |

Eventually support filters:

Missing Beginner

Missing Intermediate

Missing Advanced

Draft

Published

MVP only needs simple status indicators.

---

# 24. URL ARCHITECTURE

Each drawing subject gets ONE primary SEO URL.

Examples:

/draw/coconut-tree

/draw/dog

/draw/butterfly

/draw/sunset

/draw/boat-on-shore

/draw/lighthouse

Do NOT create primary URLs such as:

/beginner/coconut-tree

/intermediate/coconut-tree

/advanced/coconut-tree

The canonical subject page contains the difficulty progression.

---

# 25. CATEGORY URLS

Examples:

/draw/category/animals

/draw/category/beach-ocean

/draw/category/nature

/draw/category/flowers

/draw/category/landscapes

/draw/category/buildings

/draw/category/objects

These pages should be indexable.

---

# 26. TUTORIAL PAGE

Example:

/draw/coconut-tree

Structure:

Breadcrumb

Beach & Ocean > Coconut Tree

H1:

How to Draw a Coconut Tree

Short description

Difficulty selector:

Beginner

Intermediate

Advanced

Then display the selected tutorial.

Below:

Written introduction/instructions

Download or Print controls when available

Progression CTA

Related Tutorials

Premium CTA when appropriate

---

# 27. DIFFICULTY SELECTOR

Example:

[ Beginner ] [ Intermediate ] [ Advanced 🔒 ]

The active level should be obvious.

Changing difficulty should be fast and intuitive.

On mobile it must remain easy to use.

---

# 28. BEGINNER BEHAVIOR

Beginner tutorials are normally free.

Display:

complete tutorial

written explanation if available

related tutorials

progression CTA

Example:

Ready for a challenge?

Try the Intermediate Coconut Tree tutorial.

---

# 29. INTERMEDIATE BEHAVIOR

Intermediate can be either:

free

or:

premium

If free:

show complete tutorial.

If premium:

show:

title

description

public preview

premium benefits

upgrade CTA

Do NOT send the protected original asset to the browser.

---

# 30. ADVANCED BEHAVIOR

Advanced is premium by default.

Display to non-premium users:

title

description

public preview

premium CTA

optionally a manually-created sample of early steps

Do NOT expose the original premium asset.

Selected advanced tutorials can be marked free for promotional purposes.

---

# 31. MISSING DIFFICULTY LEVELS

The application must gracefully handle missing artwork.

Example:

[Beginner] [Intermediate] [Advanced — Coming Soon]

Do NOT show broken images.

A missing level may:

- not appear at all

or

- appear as Coming Soon

Make this behavior configurable later if needed.

For MVP, a simple Coming Soon state is acceptable.

---

# 32. PREMIUM CONTENT SECURITY

Never protect premium content only through frontend behavior.

BAD:

<img src="premium-image.webp" class="blur">

BAD:

download full image and cover it with a paywall.

GOOD:

Browser

↓

Next.js server

↓

Check authenticated Supabase user

↓

Check entitlement

↓

If authorized:

generate short-lived signed R2 URL

↓

Return protected asset

If unauthorized:

return public preview only.

---

# 33. ENTITLEMENT FUNCTION

Create centralized business logic such as:

canAccessTutorialLevel(user, tutorialLevel)

Rules:

If access_type === "free":

allow.

If access_type === "premium":

require active premium entitlement.

Do not duplicate subscription logic across components.

---

# 34. HOMEPAGE

Primary goals:

1. explain the product
2. get visitors drawing quickly
3. expose the three-level system
4. send visitors to tutorials

Suggested hero:

Learn to Draw,
One Step at a Time

Choose your level and follow clear step-by-step drawing tutorials.

CTA:

Start Drawing

---

# 35. HOMEPAGE SECTIONS

Suggested sections:

Hero

Popular Tutorials

Choose Your Level

Beginner

Intermediate

Advanced

Categories

New Tutorials

Example Progression

Premium Benefits

Footer

---

# 36. PROGRESSION DEMONSTRATION

A key marketing element should visually demonstrate:

COCONUT TREE

Beginner
↓

Intermediate
↓

Advanced

This communicates the product concept immediately.

---

# 37. DRAW/BROWSE PAGE

URL:

/draw

Include:

Search

Categories

Tutorial grid

Potential filters:

All

Beginner

Intermediate

Advanced

Free

Premium

Category

Do not overbuild filters for MVP.

---

# 38. TUTORIAL CARD

Each card should show:

Thumbnail

Tutorial title

Category if useful

Available levels

Example:

Coconut Tree

Beginner ✓

Intermediate ✓

Advanced 🔒

Clicking opens:

/draw/coconut-tree

---

# 39. CATEGORY PAGE

Example:

/draw/category/beach-ocean

H1:

Beach & Ocean Drawing Tutorials

Include:

category description

tutorial grid

popular tutorials

related categories if useful

---

# 40. SEARCH

MVP search should use PostgreSQL/Supabase.

Search:

tutorial title

description

category

Example searches:

tree

dog

beach

boat

sunset

Do NOT introduce Elasticsearch or Algolia initially.

---

# 41. AUTHENTICATION

Users do NOT need accounts for free tutorials.

Authentication is required for:

premium subscriptions

premium tutorials

premium downloads

account management

future favorites

Initially support:

email/password

magic link

---

# 42. PREMIUM USER FLOW

User opens tutorial.

↓

Selects Advanced.

↓

Sees premium preview.

↓

Clicks Unlock.

↓

If unauthenticated:

sign up/login.

↓

Select plan.

↓

Stripe Checkout.

↓

Stripe webhook confirms subscription.

↓

Database entitlement updates.

↓

User gets premium access.

---

# 43. STRIPE PRODUCTS

Initially create:

Drawing Premium Monthly

Drawing Premium Annual

Prices should be configured through Stripe/environment configuration.

Do not hard-code prices throughout the application.

---

# 44. STRIPE ENDPOINTS

Implement:

POST /api/stripe/checkout

Creates Stripe Checkout Session.

POST /api/stripe/webhook

Handles webhook events.

POST /api/stripe/portal

Creates Customer Portal session.

---

# 45. STRIPE WEBHOOKS

Handle relevant events including:

checkout.session.completed

customer.subscription.created

customer.subscription.updated

customer.subscription.deleted

invoice.payment_failed

Subscription state in the database must be synchronized from Stripe.

Verify webhook signatures.

---

# 46. CUSTOMER PORTAL

Premium users should manage:

payment method

billing

subscription

cancellation

through Stripe Customer Portal where practical.

Do not build custom billing-management infrastructure unnecessarily.

---

# 47. PRICING PAGE

URL:

/pricing

Keep it simple.

## FREE

Possible benefits:

Beginner tutorials

Selected intermediate tutorials

Selected advanced samples

Browse all subjects

---

## PREMIUM

Possible benefits:

Premium intermediate tutorials

All premium advanced tutorials

Printable worksheets

High-resolution downloads

Future premium collections

Offer:

Monthly

Annual

Highlight annual when appropriate.

---

# 48. ACCOUNT PAGE

URL:

/account

Show:

User email

Subscription status

FREE

or

PREMIUM

If Premium:

Plan

Renewal date

Manage Billing button

Future additions:

Favorites

Recently Viewed

Downloads

Do not build those until necessary.

---

# 49. ADMIN ACCESS

All /admin routes require admin authorization.

Do not rely solely on hidden navigation.

Server-side authorization is required.

---

# 50. ADMIN DASHBOARD

URL:

/admin

Show:

Total Tutorials

Published Tutorials

Draft Tutorials

Partial Tutorials

Categories

Potential future metrics:

Premium Tutorials

Missing Advanced Artwork

---

# 51. ADMIN TUTORIAL LIST

URL:

/admin/tutorials

Columns:

Title

Category

Beginner

Intermediate

Advanced

Status

Updated

Actions

Actions:

Edit

Preview

Publish

Archive

---

# 52. CREATE TUTORIAL

URL:

/admin/tutorials/new

Fields:

Title

Slug

Category

Description

SEO Title

SEO Description

Featured Image

Status

Creating the subject should NOT require artwork immediately.

---

# 53. EDIT TUTORIAL

URL:

/admin/tutorials/[id]

Structure:

GENERAL INFORMATION

Title

Slug

Category

Description

SEO Title

SEO Description

Featured Image

---

BEGINNER

Current Tutorial Image

[Replace Image]

Preview Image

[Replace Image]

Printable PDF

[Replace File]

Access:

Free / Premium

Introduction

Step Count

Artwork Status

[Preview Beginner]

---

INTERMEDIATE

Current Tutorial Image

[Replace Image]

Preview Image

[Replace Image]

Printable PDF

[Replace File]

Access:

Free / Premium

Introduction

Step Count

Artwork Status

[Preview Intermediate]

---

ADVANCED

Current Tutorial Image

[Replace Image]

Preview Image

[Replace Image]

Printable PDF

[Replace File]

Access:

Free / Premium

Introduction

Step Count

Artwork Status

[Preview Advanced]

Each level is independently editable.

---

# 54. ADMIN UPLOAD WORKFLOW

Admin selects file.

↓

Application validates:

type

size

allowed extension

↓

Application requests secure upload authorization.

↓

Browser uploads directly to R2 where practical.

↓

Database stores object key.

↓

Admin sees preview.

↓

Admin saves.

Do not proxy large uploads through the Next.js server unnecessarily.

---

# 55. PREVIEW BEFORE PUBLISHING

Admin must be able to preview a tutorial before making it public.

Preview should closely resemble the public page.

This is particularly important because tutorial artwork is created externally and requires visual quality review.

---

# 56. TUTORIAL QUALITY WORKFLOW

Before publishing paid artwork, manually check:

- spelling
- instruction accuracy
- step progression
- drawing continuity
- consistent proportions
- image quality
- print readability
- final drawing matches previous steps
- no unexplained major elements appear
- difficulty level is appropriate

This quality process happens outside the automatic software workflow.

The website only needs to support draft → preview → publish.

---

# 57. IMAGE OPTIMIZATION

Create appropriate versions where useful:

thumbnail

preview

display

print

Preferred web formats:

WebP

AVIF where appropriate

PDF for printables.

Example dimensions:

Thumbnail:
~400 px wide

Display:
~1200–1600 px wide

Print:
high-resolution source

Exact dimensions can be adjusted based on actual artwork.

---

# 58. MOBILE EXPERIENCE

The site must be mobile-first.

Tutorial images are vertical worksheets, so mobile viewing is especially important.

Support:

responsive image sizing

tap to enlarge

zoom where practical

easy difficulty switching

clear premium CTA

comfortable reading

Avoid tiny tutorial images embedded inside overly wide layouts.

---

# 59. DESKTOP EXPERIENCE

Desktop should provide:

centered tutorial content

large worksheet display

comfortable whitespace

clear progression controls

related tutorials

optional sidebar where useful

---

# 60. SEO STRATEGY

SEO is a core feature, not an afterthought.

Each tutorial page requires:

unique title

meta description

canonical URL

OpenGraph metadata

social image

breadcrumbs

appropriate structured data where valid

---

# 61. EXAMPLE SEO

Page:

/draw/coconut-tree

Title:

How to Draw a Coconut Tree Step by Step | Site Name

Description:

Learn how to draw a coconut tree step by step with beginner, intermediate and advanced drawing tutorials.

---

# 62. CANONICAL STRATEGY

Canonical subject URL:

/draw/coconut-tree

Do not fragment SEO authority across unnecessary difficulty URLs.

If query parameters or UI state select difficulty, canonical should still generally point to the main subject URL unless architecture changes later for a specific SEO reason.

---

# 63. SITEMAP

Automatically generate sitemap.

Include:

/

/draw

/draw/[slug]

/draw/category/[slug]

Potentially:

/pricing

Do not include private/admin pages.

---

# 64. ROBOTS

Create robots.txt.

Prevent indexing of:

/admin

/account

/login

/signup

internal API routes

private preview routes where applicable.

---

# 65. STRUCTURED DATA

Use only valid structured data.

Potential types:

BreadcrumbList

Article

HowTo only when page structure/content legitimately satisfies current search-engine requirements.

Do not create misleading schema.

---

# 66. INTERNAL LINKING

Every tutorial should link to relevant tutorials.

Example:

Coconut Tree

Related:

Palm Tree

Tropical Beach

Sunset

Boat on a Shore

Category pages link to tutorials.

Tutorials link back to categories.

Tutorials link to related subjects.

---

# 67. SOCIAL SHARING

Tutorial pages should have strong OpenGraph images.

Create public promotional assets separately when needed.

Do NOT expose premium originals through social metadata.

The visual nature of the product should be optimized for platforms such as Pinterest and other image-oriented discovery channels.

---

# 68. ANALYTICS EVENTS

Create an analytics abstraction.

Potential events:

tutorial_viewed

difficulty_selected

premium_preview_viewed

upgrade_clicked

checkout_started

subscription_completed

tutorial_downloaded

search_performed

related_tutorial_clicked

category_viewed

---

# 69. CORE CONVERSION FUNNEL

Measure:

Visitor

↓

Tutorial

↓

Intermediate / Advanced

↓

Premium Preview

↓

Upgrade Click

↓

Checkout

↓

Subscription

This funnel is more important than vanity metrics.

---

# 70. ACCESSIBILITY

Requirements:

semantic HTML

keyboard navigation

visible focus states

good contrast

accessible dialogs

form labels

alt text

meaningful headings

Premium/free status must not be communicated through color alone.

Tutorial image alt text should describe the purpose of the worksheet without attempting to reproduce every visual detail.

---

# 71. PERFORMANCE

Target strong Core Web Vitals.

Use:

Server Components by default

static generation where appropriate

caching

revalidation

CDN delivery

responsive images

lazy loading

minimal client JavaScript

Tutorial content changes infrequently, so cache aggressively while supporting explicit revalidation after admin updates.

---

# 72. SECURITY

Implement:

Supabase Row Level Security

server-side authorization

admin role validation

Stripe webhook verification

signed R2 URLs

input validation

secure headers

rate limiting on sensitive endpoints where appropriate

Never expose server secrets to client code.

---

# 73. PREMIUM ASSET SECURITY TEST

The following must fail:

Unauthenticated user manually requesting premium asset.

Free user manually requesting premium asset.

Expired subscriber requesting premium asset.

The following must succeed:

Active premium subscriber requesting authorized premium asset.

Do not consider CSS blur or hidden DOM elements security.

---

# 74. ENVIRONMENT VARIABLES

Example:

NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

STRIPE_MONTHLY_PRICE_ID=

STRIPE_ANNUAL_PRICE_ID=

R2_ACCOUNT_ID=

R2_ACCESS_KEY_ID=

R2_SECRET_ACCESS_KEY=

R2_BUCKET=

R2_PUBLIC_URL=

RESEND_API_KEY=

Never commit production secrets.

Validate required environment variables at startup/build where appropriate.

---

# 75. MVP SCOPE

The first production version should include:

Homepage

Browse tutorials

Categories

Tutorial pages

Beginner / Intermediate / Advanced levels

Externally-created image uploads

Independent artwork management per level

Free/premium access

Authentication

Stripe subscription

Secure premium assets

Pricing page

Account page

Simple Admin

Image replacement

Draft/publish workflow

Basic search

SEO

Responsive design

Analytics foundation

---

# 76. DO NOT BUILD FOR MVP

Do NOT initially build:

comments

forums

community

drawing uploads from users

gamification

achievements

streaks

mobile apps

AI image generation

automatic tutorial generation

social network features

complex recommendations

real-time collaboration

complex course builder

custom billing system

Elasticsearch

microservices

These can be evaluated only after real usage justifies them.

---

# 77. INITIAL CONTENT STRATEGY

Launch with approximately:

20–30 subjects

20–30 beginner tutorials

10–15 intermediate tutorials

5–10 advanced tutorials

Exact numbers are flexible.

Quality is more important than hitting arbitrary counts.

---

# 78. FIRST CONTENT COLLECTION

A strong initial collection could be:

BEACH & TROPICAL

Subjects:

Coconut Tree

Palm Tree

Boat on a Shore

Sunset

Tropical Beach

Lighthouse

Surfboard

Beach House

Seashell

Sailboat

This creates a coherent first library and matches existing tutorial production.

---

# 79. DESIGN DIRECTION

The website should feel:

clean

friendly

educational

visual

modern

calm

professional

Avoid making it look like:

a corporate SaaS dashboard

a children's toy website

a generic AI website

The tutorial artwork should remain the visual focus.

---

# 80. DESIGN SYSTEM

Use neutral backgrounds with restrained accent colors.

The tutorial artwork itself is primarily black-and-white, so the website should not compete visually with it.

Establish tokens for:

background

foreground

muted

border

primary

secondary

premium accent

success

warning

destructive

spacing

border radius

typography

Do not scatter arbitrary colors throughout components.

---

# 81. COMPONENTS

Potential reusable components:

Header

Footer

TutorialCard

TutorialGrid

CategoryCard

DifficultySelector

TutorialViewer

TutorialImage

PremiumPreview

PaywallCard

UpgradeCTA

RelatedTutorials

Breadcrumbs

SearchInput

SearchResults

PricingCard

SubscriptionStatus

AdminTutorialTable

ArtworkStatus

ImageUploader

FileUploader

TutorialLevelEditor

PublishControls

EmptyState

LoadingState

---

# 82. DEVELOPMENT PHASES

Development must happen incrementally.

Do NOT attempt the entire project in one implementation pass.

---

# PHASE 1 — FOUNDATION

Tasks:

- Create Next.js application
- Configure TypeScript
- Enable strict mode
- Configure Tailwind
- Configure shadcn/ui
- Add Lucide icons
- Establish folder structure
- Configure linting
- Configure formatting
- Add environment validation foundation
- Create design tokens
- Create responsive header
- Create footer
- Create base typography
- Create homepage skeleton
- Create /draw skeleton
- Create /pricing skeleton
- Use mock tutorial data

Do NOT integrate:

Supabase

Stripe

R2

authentication

yet.

Deliverable:

Responsive application shell running locally and in preview deployment.

---

# PHASE 2 — DATABASE

Tasks:

- Create Supabase project
- Configure PostgreSQL
- Create migrations
- Create profiles
- Create categories
- Create tutorials
- Create tutorial_levels
- Create subscriptions
- Configure RLS
- Seed categories
- Seed sample tutorials
- Create typed database utilities

Deliverable:

Application can query real categories and tutorial metadata.

---

# PHASE 3 — PUBLIC TUTORIAL EXPERIENCE

Build:

/

/draw

/draw/[slug]

/draw/category/[slug]

Components:

TutorialCard

TutorialGrid

DifficultySelector

TutorialViewer

Breadcrumbs

RelatedTutorials

Use temporary/mock artwork if R2 is not yet configured.

Deliverable:

Visitor can browse subjects and switch available difficulty levels.

---

# PHASE 4 — ADMIN FOUNDATION

Build:

/admin

/admin/tutorials

/admin/tutorials/new

/admin/tutorials/[id]

/admin/categories

Implement:

create tutorial

edit tutorial

create/edit levels

publish

archive

Deliverable:

Tutorial metadata can be managed without editing source code.

---

# PHASE 5 — TUTORIAL ARTWORK MANAGEMENT

This phase is critical.

Remember:

ALL ARTWORK IS CREATED EXTERNALLY.

Implement:

Beginner image upload

Intermediate image upload

Advanced image upload

Independent image replacement

Current-image preview

Missing-image state

Draft/published artwork state

Preview image upload

Printable PDF upload

Access setting per level

Admin preview

Deliverable:

Admin can independently upload, replace, preview and publish externally-created artwork for every difficulty level.

There must be NO image generation functionality.

---

# PHASE 6 — R2 STORAGE

Configure Cloudflare R2.

Implement:

secure upload authorization

direct uploads where appropriate

public assets

private premium assets

object-key storage

preview assets

printable files

signed URLs

asset replacement

Deliverable:

Tutorial assets are stored outside the repository and can be securely retrieved.

---

# PHASE 7 — AUTHENTICATION

Configure Supabase Auth.

Build:

/login

/signup

/account

Implement:

email/password

magic link

session handling

protected account routes

admin authorization

Deliverable:

Users can create accounts and sign in.

---

# PHASE 8 — PREMIUM ENTITLEMENTS

Create centralized entitlement logic.

Rules:

Free content:

accessible to everyone.

Premium content:

requires active premium subscription.

Apply checks server-side.

Protect:

premium tutorial image

premium printable file

premium high-resolution download

Deliverable:

Premium assets cannot be accessed by free users.

---

# PHASE 9 — STRIPE

Configure:

monthly subscription

annual subscription

Build:

checkout endpoint

webhook endpoint

customer portal endpoint

pricing page integration

subscription synchronization

Deliverable:

User can subscribe and receive premium access.

---

# PHASE 10 — SEARCH

Implement PostgreSQL-based search.

Search:

title

description

category

Deliverable:

Users can find drawing subjects quickly.

---

# PHASE 11 — SEO

Implement:

metadata

canonical URLs

OpenGraph

sitemap

robots.txt

breadcrumbs

structured data where valid

category descriptions

related tutorial linking

Deliverable:

Public tutorial pages are search-engine ready.

---

# PHASE 12 — ANALYTICS

Implement analytics abstraction.

Track:

tutorial_viewed

difficulty_selected

premium_preview_viewed

upgrade_clicked

checkout_started

subscription_completed

tutorial_downloaded

search_performed

related_tutorial_clicked

Deliverable:

Free → Premium conversion can be measured.

---

# PHASE 13 — POLISH

Improve:

mobile tutorial viewer

image enlargement

zoom behavior

loading states

empty states

error states

Coming Soon states

premium messaging

admin workflow

accessibility

performance

Deliverable:

Professional production-ready experience.

---

# PHASE 14 — QA

Test:

desktop

mobile

authentication

admin authorization

subscription purchase

subscription cancellation

expired subscription

premium authorization

R2 signed URLs

artwork replacement

missing artwork

draft tutorials

published tutorials

SEO metadata

404 pages

loading states

Stripe webhook failures

asset failures

search

responsive layouts

Deliverable:

Production-ready MVP.

---

# 83. CONTENT WORKFLOW TEST

Before launch, perform this exact test.

1. Create Coconut Tree in Admin.

2. licly.

6. Confirm Intermediate and Advanced gracefully show unavailable/Coming Soon.

7. Later upload Intermediate Coconut Tree.

8. Confirm the SAME URL now offers Intermediate.

9. Upload Advanced Coconut Tree.

10. Mark Advanced Premium.

11. Upload a public Advanced preview.

12. Confirm free visitors see only the preview.

13. Confirm free visitors cannot retrieve the premium original.

14. Subscribe with a test account.

15. Confirm premium account sees Advanced.

16. Confirm premium account can access printable file if provided.

17. Replace Advanced artwork with an improved version.

18. Confirm the URL does not change.

19. Confirm new artwork appears.

20. Confirm previous artwork is no longer referenced.

This workflow must be reliable before launch.

---

# 84. TESTING STRATEGY

Automate business-critical behavior.

## Unit Tests

Test:

entitlement logic

slug utilities

subscription-state logic

asset permission logic

SEO helpers

---

## Integration Tests

Test:

Stripe webhooks

database access

signed asset authorization

admin permissions

subscription synchronization

---

## End-to-End Tests

Test:

Visitor opens free tutorial.

Visitor switches difficulty.

Visitor encounters premium tutorial.

Visitor sees premium preview.

User creates account.

User begins checkout.

Premium user accesses Advanced tutorial.

Free user cannot access premium original.

Admin creates tutorial.

Admin uploads Beginner artwork.

Admin later uploads Advanced artwork.

Admin replaces artwork.

Tutorial URL remains unchanged.

---

# 85. DEFINITION OF DONE

MVP is complete when:

1. Visitors can discover tutorials without accounts.

2. Search engines can index public tutorial/category pages.

3. Beginner tutorials can be consumed for free.

4. Free and premium intermediate tutorials are supported.

5. Advanced tutorials can be securely paywalled.

6. Tutorial artwork can be uploaded independently.

7. Artwork can be replaced without changing URLs.

8. Tutorials can exist with only one or two difficulty levels.

9. Missing levels are handled gracefully.

10. Users can create accounts.

11. Users can purchase subscriptions.

12. Stripe webhooks correctly control entitlements.

13. Premium assets cannot be retrieved without authorization.

14. Admin can create and publish tutorials.

15. Admin can independently manage Beginner, Intermediate and Advanced artwork.

16. Printable files can be protected.

17. Site works well on mobile and desktop.

18. SEO metadata is correct.

19. Search works.

20. Analytics can measure the free → premium funnel.

---

# 86. CODING RULES FOR AI AGENTS

When implementing this project:

- Work ONE PHASE at a time.
- Do not implement later phases prematurely.
- Stop after completing each phase.
- Summarize what was implemented.
- Wait for approval before beginning the next phase.
- Prefer simple solutions.
- Keep TypeScript strict.
- Avoid `any`.
- Use Server Components by default.
- Use Client Components only when required.
- Keep secrets server-side.
- Validate all external input.
- Perform authorization server-side.
- Never use frontend state as security.
- Keep components focused and reusable.
- Keep business logic outside UI components.
- Centralize entitlement logic.
- Use database migrations.
- Use Supabase RLS.
- Do not introduce dependencies without justification.
- Do not implement features outside MVP scope.
- Run linting after every phase.
- Run type checking after every phase.
- Run relevant tests after every phase.
- Run production build before declaring a major phase complete.
- Fix errors before continuing.
- Document important architectural decisions.
- Update this specification when architecture materially changes.

---

# 87. CRITICAL AI AGENT RULE: TUTORIAL ARTWORK

The coding agent must understand:

Tutorial artwork is created separately by the project owner.

The coding agent must NOT:

- generate tutorial artwork
- call image-generation APIs
- build an AI tutorial generator
- automatically alter tutorial images
- reconstruct tutorial worksheets
- automatically add drawing steps to images

The coding agent builds the system used to upload, organize, publish, protect and sell finished tutorial artwork.

The uploaded tutorial worksheet is the authoritative visual asset.

---

# 88. CRITICAL AI AGENT RULE: DO NOT OVERBUILD

Do not add features because they "might be useful."

Before adding something not explicitly specified, ask:

Is this required for the current development phase?

If no:

do not implement it.

Examples of things that should NOT appear unexpectedly:

Redux

microservices

GraphQL

Elasticsearch

complex queues

AI APIs

custom authentication

custom payment processing

complex CMS frameworks

real-time subscriptions

social functionality

---

# 89. ARCHITECTURAL PRIORITIES

When choosing between implementations, prioritize in this order:

1. Security
2. Simplicity
3. Content management usability
4. SEO
5. Performance
6. Maintainability
7. Developer experience
8. Extensibility

Do not sacrifice security for convenience.

Do not sacrifice simplicity for hypothetical future requirements.

---

# 90. PRODUCT PRIORITIES

The core experience is:

DISCOVER

↓

DRAW

↓

PROGRESS

↓

UPGRADE

A user should be able to arrive from Google, immediately understand the tutorial, successfully draw something, discover a more advanced version of the same subject, and understand what Premium provides.

Everything else is secondary.

---

# 91. FIRST IMPLEMENTATION TASK

START WITH PHASE 1 ONLY.

Create the Next.js application.

Configure:

TypeScript

Tailwind CSS

shadcn/ui

Lucide

strict TypeScript

linting

formatting

project structure

design tokens

responsive Header

Footer

base typography

Homepage skeleton

/draw skeleton

/pricing skeleton

Use mock tutorial data.

Create enough mock data to demonstrate:

Coconut Tree

Beginner

Intermediate

Advanced

Also create a few mock tutorial cards such as:

Sunset

Boat on a Shore

Butterfly

Dog

Lighthouse

Do NOT implement:

Supabase

Stripe

Cloudflare R2

authentication

real payments

real admin

yet.

The Phase 1 UI should demonstrate the intended product experience using mock data.

---

# 92. PHASE 1 DESIGN REQUIREMENT

The UI should make this concept immediately understandable:

"Learn the same drawing at your level."

The Coconut Tree mock tutorial should visibly demonstrate:

Beginner
→
Intermediate
→
Advanced

The website should be designed around the tutorial artwork.

Avoid generic SaaS styling.

Use generous whitespace.

Tutorial cards should emphasize artwork.

Mobile design is required from the beginning.

---

# 93. PHASE COMPLETION PROCEDURE

At the end of each development phase:

1. Run lint.

2. Run TypeScript type checking.

3. Run relevant tests.

4. Run production build.

5. Fix all errors.

6. Review responsive behavior.

7. Summarize files created or modified.

8. Summarize architectural decisions.

9. List any unresolved issues.

10. STOP.

Do not automatically begin the next phase.

Wait for explicit approval.

---

# 94. LONG-TERM POSSIBILITIES

These are NOT MVP requirements.

Only consider them after the core product demonstrates real usage/revenue.

Possible future features:

Interactive individual drawing steps

Progress tracking

Favorites

Recently viewed tutorials

Tutorial collections

One-time drawing packs

Gift purchases

Teacher/classroom accounts

Children/parent accounts if appropriate

Drawing challenges

User-submitted drawings

Tutorial ratings

Personalized recommendations

Multiple languages

Native mobile applications

Affiliate art supplies

Video companions

Printable books

Physical drawing books

Course bundles

Email drawing challenges

"Draw one thing every day" programs

These should not influence MVP architecture beyond avoiding unnecessary dead ends.

---

# 95. FINAL PRODUCT VISION

The product should eventually feel like a structured visual drawing library rather than a collection of unrelated tutorials.

Example:

BEACH & OCEAN

Coconut Tree
Beginner → Intermediate → Advanced

Palm Tree
Beginner → Intermediate → Advanced

Boat on a Shore
Beginner → Intermediate → Advanced

Sunset
Beginner → Intermediate → Advanced

Tropical Beach
Beginner → Intermediate → Advanced


ANIMALS

Dog
Beginner → Intermediate → Advanced

Butterfly
Beginner → Intermediate → Advanced

Cat
Beginner → Intermediate → Advanced


NATURE

Flower
Beginner → Intermediate → Advanced

Mountain
Beginner → Intermediate → Advanced

Tree
Beginner → Intermediate → Advanced

The progression system is the central differentiator.

The user should never wonder:

"What should I draw next?"

The product should naturally guide them toward either:

- another subject at their current level

or

- the same subject at the next level.

---

# 96. FINAL INSTRUCTION TO CODING AGENT

Read this entire PROJECT_PLAN.md before making architectural decisions.

Treat it as the source of truth for the project.

Do not attempt to implement the entire specification at once.

Begin with PHASE 1 ONLY.

Before coding:

1. Review the Phase 1 requirements.
2. Briefly state the implementation approach.
3. Identify any true blockers.
4. If there are no blockers, begin implementation without asking unnecessary questions.

After implementation:

1. Run lint.
2. Run TypeScript checks.
3. Run tests if applicable.
4. Run production build.
5. Fix all errors.
6. Summarize the completed work.
7. STOP.

Wait for approval before Phase 2.

Most importantly:

THE TUTORIAL IMAGES ARE CREATED EXTERNALLY AND UPLOADED TO EACH TUTORIAL PAGE INDIVIDUALLY.

THE WEBSITE MUST NOT GENERATE THE TUTORIAL ARTWORK.
