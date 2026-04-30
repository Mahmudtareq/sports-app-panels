# Photography Portfolio & CMS Template

A modern, full-featured photography portfolio and content management system built with **Next.js 16**, **MongoDB**, and **Cloudinary**. Designed for professional photographers and studios who need a stunning portfolio website with a powerful admin dashboard to manage all content.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Requirements](#requirements)
4. [Quick Start](#quick-start)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Project Structure](#project-structure)
8. [Tech Stack](#tech-stack)
9. [Public Pages & Routes](#public-pages--routes)
10. [Admin Dashboard](#admin-dashboard)
11. [API Reference](#api-reference)
12. [Database Models](#database-models)
13. [Configuration](#configuration)
14. [Authentication](#authentication)
15. [Image Management](#image-management)
16. [Deployment](#deployment)
17. [Changelog](#changelog)

---

## Overview

This template provides a complete solution for photography professionals — a polished public-facing portfolio site paired with a full-featured CMS admin dashboard. It is built on the latest Next.js App Router architecture with server components, server actions, and API route handlers. All content is dynamically managed through MongoDB, and all images are stored and served via Cloudinary CDN.

**Live documentation:** Start the dev server and visit [http://localhost:3000/documentation](http://localhost:3000/documentation)

---

## Key Features

### Frontend
- **Home Page** — Hero banner, featured gallery, services, and testimonials
- **Photography Gallery** — Full gallery with real-time category filtering
- **Stories / Blog** — Photography stories with rich metadata (camera, lens, shutter speed)
- **About Page** — Team section, why-choose-us, and mission statement
- **Contact Page** — Client inquiry form with category selection

### Admin Dashboard
- **Dashboard Statistics** — Overview of gallery, stories, contacts, and activity
- **Gallery Management** — Upload, sort (drag & drop), filter, and delete photos
- **Category Management** — Hierarchical categories with slug generation
- **Stories Management** — Rich text editor with multi-photo support and SEO fields
- **Team Management** — Add, edit, reorder team members
- **Testimonials** — Manage and sort client testimonials
- **Banner Management** — Page banners with ordering and status control
- **Service Gallery** — Services display with image and description
- **Contact Submissions** — View and manage all contact form submissions
- **Site Settings** — General info, Cloudinary config, SEO metadata, terms & policy
- **Profile Management** — Update admin profile and change password

### Technical
- Server-side rendering (SSR) and static generation (SSG) for SEO
- Tag-based cache invalidation
- JWT authentication with NextAuth v5
- Zod schema validation on all API routes and forms
- Drag-and-drop reordering with @dnd-kit
- Responsive admin dashboard with TanStack Table
- Rich text editing with SunEditor

---

## Requirements

| Requirement | Version |
|---|---|
| Node.js | 18.17+ |
| MongoDB | 6.0+ (Atlas recommended) |
| Cloudinary Account | Free tier or higher |
| npm | 9.x+ |

---

## Quick Start

```bash
# 1. Clone / extract the template
cd template-photography

# 2. Install dependencies
npm install

# 3. Copy the environment file
cp .env.example .env

# 4. Fill in your environment variables (see below)

# 5. Seed the database with initial admin user
# Run the seed script (see Installation section)

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

---

## Installation

### Step 1 — Install Dependencies

```bash
npm install
```

### Step 2 — Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in all required values (see [Environment Variables](#environment-variables)).

### Step 3 — Set Up MongoDB

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP address (or `0.0.0.0/0` for all IPs)
4. Copy the connection string to `MONGODB_URI` in your `.env`

### Step 4 — Set Up Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Navigate to your Dashboard → Settings
3. Copy Cloud Name, API Key, and API Secret to your `.env`
4. Configure Cloudinary credentials in Admin → Settings → Cloudinary after first login

### Step 5 — Create Admin User

Connect to your MongoDB database and insert an initial admin user manually, or use the seed command:

```bash
# Using MongoDB shell / Compass — insert into the `users` collection:
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "<bcrypt-hashed-password>",
  "role": "admin"
}
```

> **Note:** Use a bcrypt hash for the password (cost factor 10). You can generate one using online tools or a short Node.js script.

### Step 6 — Start Development Server

```bash
npm run dev
```

The app uses **Turbopack** for fast HMR in development.

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file at the root of the project with the following variables:

```env
# ─── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# ─── Authentication ────────────────────────────────────────────────────────────
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-very-strong-secret-key-min-32-chars"

# ─── Database ──────────────────────────────────────────────────────────────────
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Yes | Public base URL of your site |
| `AUTH_TRUST_HOST` | Yes | Set `true` for NextAuth behind proxies |
| `NEXTAUTH_URL` | Yes | Full URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | Yes | Random secret string (min 32 chars) |
| `MONGODB_URI` | Yes | MongoDB connection string |

> **Important:** Cloudinary credentials are managed through the admin dashboard at `Settings → Cloudinary`, not in `.env`.

---

## Project Structure

```
template-photography/
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout (fonts, providers)
│   ├── globals.css                 # Global styles
│   ├── documentation/              # Documentation viewer route
│   │   └── page.tsx
│   │
│   ├── (public)/                   # Public-facing pages (with header & footer)
│   │   ├── layout.tsx              # Public layout (Header + Footer)
│   │   ├── page.tsx                # Home page  "/"
│   │   ├── gallery/
│   │   │   └── page.tsx            # Gallery page  "/gallery"
│   │   ├── about/
│   │   │   └── page.tsx            # About page  "/about"
│   │   ├── stories/
│   │   │   ├── page.tsx            # Stories listing  "/stories"
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Story detail  "/stories/:slug"
│   │   └── lets-connect/
│   │       └── page.tsx            # Contact page  "/lets-connect"
│   │
│   ├── (admin)/admin/              # Admin authentication pages
│   │   └── login/
│   │       └── page.tsx            # Login page  "/admin/login"
│   │
│   └── (private)/admin/dashboard/  # Protected admin dashboard (95+ pages)
│       ├── page.tsx                # Dashboard home
│       ├── gallery/
│       ├── stories/
│       ├── banner/
│       ├── categories/
│       ├── teams/
│       ├── testimonial/
│       ├── contact-us/
│       ├── service-gallery/
│       ├── about-us/
│       ├── about-showcase/
│       ├── why-choose/
│       └── settings/
│
├── api/                            # API route handlers
│   ├── public/                     # Unauthenticated public APIs
│   │   ├── gallery/route.ts
│   │   ├── banner/route.ts
│   │   ├── story/route.ts
│   │   ├── story/[slug]/route.ts
│   │   ├── story/more/[slug]/route.ts
│   │   ├── category/route.ts
│   │   ├── team/route.ts
│   │   ├── testimonial/route.ts
│   │   ├── contact-us/route.ts
│   │   ├── service-gallery/route.ts
│   │   ├── home-section/name/[slug]/route.ts
│   │   └── settings/route.ts
│   └── admin/                      # JWT-protected admin APIs
│       ├── auth/login/route.ts
│       ├── auth/me/route.ts
│       ├── auth/password/route.ts
│       ├── gallery/route.ts
│       ├── gallery/[id]/route.ts
│       ├── gallery/sort/route.ts
│       ├── gallery/status/[id]/route.ts
│       ├── banner/...
│       ├── category/...
│       ├── story/...
│       ├── team/...
│       ├── testimonial/...
│       ├── contact-us/...
│       ├── service-gallery/...
│       ├── home-section/...
│       ├── file/route.ts
│       ├── settings/...
│       └── dashboard/stats/route.ts
│
├── components/
│   ├── ui/                         # shadcn/ui base components
│   ├── features/                   # Feature-specific components
│   │   ├── landing/                # Home page sections
│   │   ├── about-us/               # About page sections
│   │   ├── our-works/              # Gallery display
│   │   ├── image-gallery/          # Full gallery with filter
│   │   ├── story/                  # Story detail sections
│   │   ├── contact-us-section/     # Contact form & info
│   │   ├── offer-section/          # Services section
│   │   ├── frame-felt/             # Testimonials carousel
│   │   └── story-feature/         # Featured story card
│   └── form/                       # Reusable form components
│
├── actions/                        # Next.js server actions
│   ├── landing/                    # Public data fetching
│   ├── adminLogin/
│   ├── adminProfile/
│   ├── gallery/
│   ├── banner/
│   ├── stories/
│   ├── teams/
│   ├── categories/
│   ├── testimonial/
│   ├── contact/
│   ├── settings/
│   ├── home-section/
│   ├── dashboard/
│   └── file/
│
├── model/                          # Mongoose database models
│   ├── Gallery.ts
│   ├── Category.ts
│   ├── Stories.ts
│   ├── Banner.ts
│   ├── Team.ts
│   ├── User.ts
│   ├── Settings.ts
│   ├── Testimonial.ts
│   ├── ContactUs.ts
│   ├── ServiceGallery.ts
│   └── HomeSection.ts
│
├── store/                          # Zustand client stores
│   ├── useAdminProfile.ts
│   ├── useBannerStore.ts
│   ├── useCategoryFilterStore.ts
│   └── useTableStore.ts
│
├── lib/                            # Utilities & helpers
│   ├── api-client.ts               # Fetch wrapper with JWT injection
│   ├── authenticate.ts             # Auth utility functions
│   ├── validation-schema.ts        # All Zod validation schemas
│   ├── helper.ts                   # Cloudinary cleanup helpers
│   ├── fileUpload.ts               # File upload logic
│   ├── metadata.ts                 # SEO metadata helpers
│   ├── server.utils.ts             # Server-side utilities
│   └── mongo-adapter.ts            # MongoDB aggregation helpers
│
├── config/
│   ├── database.ts                 # MongoDB connection pool
│   ├── cloudinary.ts               # Cloudinary config & operations
│   ├── routes.ts                   # Centralized route definitions
│   ├── constant.ts                 # App-wide constants
│   └── cache.ts                    # Cache tag definitions
│
├── hooks/
│   └── use-mobile.ts               # Responsive breakpoint hook
│
├── providers/
│   ├── AuthSessionProvider.tsx     # NextAuth session provider
│   └── DashboardProvider.tsx       # Admin dashboard context
│
├── types/
│   └── next.d.ts                   # TypeScript augmentations
│
├── proxy.ts                        # NextAuth middleware (route protection)
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── components.json                 # shadcn/ui configuration
└── package.json
```

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | Next.js | 16.1.6 |
| **Language** | TypeScript | 5.x |
| **UI Library** | React | 19.1.0 |
| **Styling** | Tailwind CSS | 4.x |
| **Component Library** | shadcn/ui + Radix UI | Latest |
| **Icons** | Lucide React + React Icons | Latest |
| **Database** | MongoDB + Mongoose | 9.1.0 |
| **Authentication** | NextAuth.js | 5.0.0-beta.30 |
| **Image Storage** | Cloudinary | 2.8.0 |
| **State Management** | Zustand | 5.0.9 |
| **Forms** | React Hook Form | 7.62.0 |
| **Validation** | Zod | 4.1.5 |
| **Rich Text Editor** | SunEditor | 2.47.8 |
| **Table** | TanStack React Table | 8.21.3 |
| **Drag & Drop** | @dnd-kit | 6.3.1 |
| **Carousel** | Embla Carousel | 8.6.0 |
| **Photo Gallery** | React Photo Album | 3.1.0 |
| **Date Picker** | Flatpickr | 4.6.13 |
| **Notifications** | React Hot Toast | 2.6.0 |
| **Phone Input** | React Phone Input 2 | 2.15.1 |
| **Dates** | Moment Timezone | 0.6.0 |

---

## Public Pages & Routes

| Route | Description |
|---|---|
| `/` | **Home** — Hero banner, featured gallery, services, testimonials |
| `/gallery` | **Gallery** — Full photo gallery with category filter |
| `/about` | **About** — Studio info, team members, why choose us |
| `/stories` | **Stories** — Photography stories listing |
| `/stories/:slug` | **Story Detail** — Full story with photos and technical metadata |
| `/lets-connect` | **Contact** — Client inquiry form |
| `/documentation` | **Documentation** — Template documentation viewer |

---

## Admin Dashboard

Access the admin panel at `/admin/login` with your credentials.

### Admin Routes

| Route | Description |
|---|---|
| `/admin/login` | Authentication page |
| `/admin/dashboard` | Overview with stats and quick links |
| `/admin/dashboard/gallery` | Photo gallery management |
| `/admin/dashboard/categories` | Category management |
| `/admin/dashboard/stories` | Stories management |
| `/admin/dashboard/stories/create` | Create new story |
| `/admin/dashboard/stories/create/:id` | Edit existing story |
| `/admin/dashboard/banner` | Page banner management |
| `/admin/dashboard/teams` | Team member management |
| `/admin/dashboard/testimonial` | Testimonial management |
| `/admin/dashboard/contact-us` | Contact form submissions |
| `/admin/dashboard/service-gallery` | Services display management |
| `/admin/dashboard/about-us` | About page content |
| `/admin/dashboard/about-showcase` | About showcase section |
| `/admin/dashboard/why-choose` | Why choose us section |
| `/admin/dashboard/settings` | Site settings (general, SEO, Cloudinary) |

---

## API Reference

All API routes are under `/api/`. Public endpoints require no authentication. Admin endpoints require a valid JWT Bearer token obtained from `/api/admin/auth/login`.

### Authentication Header

```
Authorization: Bearer <jwt_token>
```

---

### Authentication API

#### Login

```
POST /api/admin/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Get Current User

```
GET /api/admin/auth/me
```

#### Change Password

```
POST /api/admin/auth/password
```

**Request Body:**
```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password"
}
```

---

### Gallery API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/gallery` | Fetch gallery (public) |
| `GET` | `/api/admin/gallery` | Fetch gallery (admin) |
| `POST` | `/api/admin/gallery` | Create gallery item |
| `PUT` | `/api/admin/gallery/:id` | Update gallery item |
| `DELETE` | `/api/admin/gallery/:id` | Delete gallery item |
| `POST` | `/api/admin/gallery/sort` | Reorder gallery items |
| `PATCH` | `/api/admin/gallery/status/:id` | Toggle status / featured |

**Query Parameters (GET /api/public/gallery):**

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Filter by category slug |
| `featured` | boolean | Filter featured only |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

**Create / Update Body:**
```json
{
  "image": "https://res.cloudinary.com/...",
  "title": "Golden Hour Portrait",
  "author": "John Doe",
  "category": "portrait",
  "status": true,
  "isFeatured": false
}
```

---

### Categories API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/category` | Fetch all active categories |
| `GET` | `/api/admin/category` | Fetch all categories (admin) |
| `POST` | `/api/admin/category` | Create category |
| `PUT` | `/api/admin/category/:id` | Update category |
| `DELETE` | `/api/admin/category/:id` | Delete category |
| `POST` | `/api/admin/category/sort` | Reorder categories |
| `PATCH` | `/api/admin/category/status/:id` | Toggle status |

**Create Body:**
```json
{
  "name": "Portrait",
  "slug": "portrait",
  "status": true,
  "featured": false,
  "parent": null
}
```

---

### Stories API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/story` | Fetch featured stories (public) |
| `GET` | `/api/public/story/:slug` | Fetch story by slug |
| `GET` | `/api/public/story/more/:slug` | Fetch related stories |
| `GET` | `/api/admin/story` | Fetch all stories (admin) |
| `POST` | `/api/admin/story` | Create story |
| `PUT` | `/api/admin/story/:id` | Update story |
| `DELETE` | `/api/admin/story/:id` | Delete story |
| `PATCH` | `/api/admin/story/status/:id` | Toggle status / featured |

**Create Body:**
```json
{
  "title": "Golden Sunset Wedding",
  "slug": "golden-sunset-wedding",
  "description": "<p>Story content...</p>",
  "image": "https://res.cloudinary.com/...",
  "photos": ["url1", "url2"],
  "client": "Sarah & James",
  "photographer": "Jane Smith",
  "mood": "Romantic",
  "category": ["categoryId1"],
  "camera": "Sony A7R IV",
  "shutterSpeed": "1/500s",
  "lensUsed": "85mm f/1.4",
  "focus": ["Natural light", "Bokeh"],
  "approach": ["Candid moments", "Golden hour"],
  "eventDate": "2024-06-15",
  "isFeatured": true,
  "status": true
}
```

---

### Banner API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/banner` | Fetch active banners (public) |
| `GET` | `/api/admin/banner` | Fetch all banners (admin) |
| `POST` | `/api/admin/banner` | Create banner |
| `PUT` | `/api/admin/banner/:id` | Update banner |
| `DELETE` | `/api/admin/banner/:id` | Delete banner |
| `POST` | `/api/admin/banner/sort` | Reorder banners |
| `PATCH` | `/api/admin/banner/status/:id` | Toggle status |

---

### Team API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/team` | Fetch active team members |
| `GET` | `/api/admin/team` | Fetch all team members (admin) |
| `POST` | `/api/admin/team` | Create team member |
| `PUT` | `/api/admin/team/:id` | Update team member |
| `DELETE` | `/api/admin/team/:id` | Delete team member |
| `POST` | `/api/admin/team/sort` | Reorder team |
| `PATCH` | `/api/admin/team/status/:id` | Toggle status |

---

### Testimonial API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/testimonial` | Fetch active testimonials |
| `GET` | `/api/admin/testimonial` | Fetch all testimonials (admin) |
| `POST` | `/api/admin/testimonial` | Create testimonial |
| `PUT` | `/api/admin/testimonial/:id` | Update testimonial |
| `DELETE` | `/api/admin/testimonial/:id` | Delete testimonial |
| `POST` | `/api/admin/testimonial/sort` | Reorder testimonials |
| `PATCH` | `/api/admin/testimonial/status/:id` | Toggle status |

---

### Contact API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/public/contact-us` | Submit contact form (public) |
| `GET` | `/api/admin/contact-us` | View all submissions (admin) |
| `DELETE` | `/api/admin/contact-us` | Delete submission(s) |

**Public Submit Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "message": "I am interested in wedding photography.",
  "category": "Wedding"
}
```

---

### Service Gallery API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/service-gallery` | Fetch active services |
| `GET` | `/api/admin/service-gallery` | Fetch all services (admin) |
| `POST` | `/api/admin/service-gallery` | Create service |
| `PUT` | `/api/admin/service-gallery/:id` | Update service |
| `DELETE` | `/api/admin/service-gallery/:id` | Delete service |
| `POST` | `/api/admin/service-gallery/sort` | Reorder services |
| `PATCH` | `/api/admin/service-gallery/status/:id` | Toggle status |

---

### Home Sections API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/home-section/name/:slug` | Fetch section by key (public) |
| `GET` | `/api/admin/home-section` | Fetch all sections (admin) |
| `POST` | `/api/admin/home-section` | Create section |
| `GET` | `/api/admin/home-section/name/:slug` | Fetch section by key (admin) |

**Section Keys:**

| Key | Description |
|---|---|
| `hero` | Homepage hero banner |
| `about` | Homepage about preview |
| `services` | Services section intro |
| `gallery` | Gallery section intro |
| `testimonials` | Testimonials section intro |
| `cta` | Call-to-action section |

---

### File Upload API

```
POST /api/admin/file
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Type | Description |
|---|---|---|
| `file` | File | Image file to upload |
| `folder` | string | Cloudinary folder name (optional) |

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/...",
  "publicId": "folder/filename"
}
```

---

### Settings API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/settings` | Fetch public settings |
| `GET` | `/api/admin/settings` | Fetch all settings |
| `POST` | `/api/admin/settings/general` | Update general settings |
| `POST` | `/api/admin/settings/metadata` | Update SEO metadata |
| `POST` | `/api/admin/settings/cloudinary` | Update Cloudinary config |
| `POST` | `/api/admin/settings/page-banner` | Update page banner settings |
| `POST` | `/api/admin/settings/terms` | Update terms & policy |

---

### Dashboard Stats API

```
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gallery": 124,
    "stories": 18,
    "contacts": 45,
    "teams": 6,
    "testimonials": 12
  }
}
```

---

## Database Models

### User

```typescript
{
  name:     string   // Required
  email:    string   // Required, unique
  password: string   // Required, bcrypt hashed
  role:     string   // "admin" | "user"
}
```

### Gallery

```typescript
{
  image:      string   // Cloudinary URL
  title:      string
  author:     string
  category:   string   // Category slug
  status:     boolean  // Default: true
  isFeatured: boolean  // Default: false
  orderBy:    number   // Sort position
}
```

### Category

```typescript
{
  name:     string     // Required
  slug:     string     // Required, unique, lowercase
  status:   boolean    // Default: true
  featured: boolean    // Default: false
  position: number     // Sort order
  parent:   ObjectId   // Nullable — parent category reference
}
```

### Stories

```typescript
{
  title:        string
  slug:         string     // Unique
  description:  string     // HTML content from rich text editor
  image:        string     // Cover image URL
  photos:       string[]   // Additional gallery photos
  client:       string
  photographer: string
  mood:         string
  category:     ObjectId[] // References to Category
  camera:       string
  shutterSpeed: string
  lensUsed:     string
  focus:        string[]
  approach:     string[]
  eventDate:    Date
  isFeatured:   boolean
  status:       boolean
}
```

### Banner

```typescript
{
  sectionName: string    // Internal identifier
  heading:     string
  shortDesc:   string
  categories:  string
  position:    number
  status:      boolean
}
```

### Team

```typescript
{
  name:        string
  designation: string
  image:       string   // Cloudinary URL
  status:      boolean
}
```

### Testimonial

```typescript
{
  quote:      string
  authorName: string
  authorRole: string
  order:      number
  status:     boolean
}
```

### ContactUs

```typescript
{
  name:     string
  email:    string
  phone:    string
  message:  string
  category: string
  status:   boolean
}
```

### ServiceGallery

```typescript
{
  heading:   string
  shortDesc: string
  image:     string
  position:  number
  status:    boolean
}
```

### Settings (single document)

```typescript
{
  general: {
    companyName:    string
    companyPhone:   string
    companyAddress: string
    supportEmail:   string
    ownerName:      string
    ownerEmail:     string
    logo:           string   // Cloudinary URL
    favicon:        string   // Cloudinary URL
    facebook:       string
    instagram:      string
    twitter:        string
    youtube:        string
    homeView:       string
  },
  pageBanner: {
    menu:    object
    outlets: object
    blogs:   object
  },
  cloudinary: {
    cloudName:      string
    apiKey:         string
    apiSecret:      string
    folder:         string
    secureUrlBase:  string
  },
  metadata: {
    title:           string
    applicationName: string
    description:     string
    keywords:        string[]
    openGraphImage:  string
  },
  termsPolicy: {
    terms:  string   // HTML content
    policy: string   // HTML content
  },
  businessHours: [
    {
      dayOfWeek: number   // 0 = Sunday, 6 = Saturday
      openTime:  number   // Minutes from midnight
      closeTime: number   // Minutes from midnight
      isClosed:  boolean
    }
  ]
}
```

### HomeSection

```typescript
{
  sectionKey:  string
  title:       string
  subTitle:    string
  sectionImage: string
  orderBy:     number
  status:      boolean
  images:      string[]
  videos:      string[]
  features:    [{ title: string, description: string }]
  stats:       [{ value: string, suffix: string, label: string }]
  serviceIds:  ObjectId[]
  content:     Record<string, any>
  parentId:    ObjectId
  sectionType: "content" | "mixed" | "gallery" | "story"
}
```

---

## Configuration

### MongoDB (`config/database.ts`)

The database module uses a cached connection pattern optimized for serverless environments:

```typescript
// Connection settings
{
  maxPoolSize: 10,
  minPoolSize: 2,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  bufferCommands: false
}
```

### Cloudinary (`config/cloudinary.ts`)

Cloudinary is configured **dynamically** from database settings, not from `.env`. This allows live configuration updates through the admin dashboard.

Key operations:
- **Upload** — Streams files directly to Cloudinary with optional transformation
- **Delete** — Removes files by `publicId`, supports batch operations
- **Folder organization** — Images organized in configurable folders

To configure Cloudinary after first login:
1. Go to **Admin → Settings → Cloudinary**
2. Enter your Cloud Name, API Key, API Secret, and folder name
3. Save — all subsequent uploads will use these credentials

### NextAuth (`proxy.ts`)

Route protection via NextAuth middleware:

- **Protected paths:** `/admin/*`, `/api/admin/*`
- **Unauthenticated** requests redirect to `/admin/login`
- **Authenticated** users visiting `/admin/login` redirect to `/admin/dashboard`

### Caching Strategy

The app uses Next.js tag-based cache invalidation:

| Data Type | Cache Strategy | Invalidation |
|---|---|---|
| Public gallery | `force-cache` with tag | On admin update |
| Settings | `force-cache` with tag | On settings save |
| Banners | `force-cache` with tag | On admin update |
| Stories | `force-cache` with tag | On admin update |
| Admin data | `no-store` | Always fresh |

---

## Authentication

### Flow

1. Admin submits credentials at `/admin/login`
2. Server validates email/password against the `User` collection (bcrypt compare)
3. On success, a JWT token is returned
4. NextAuth stores the token in the session
5. `lib/api-client.ts` automatically injects the token as a Bearer header
6. All `/api/admin/*` routes verify the token before processing

### Password Security

- Passwords are hashed using **bcrypt** with cost factor 10
- The raw password is never stored
- Password changes require verification of the current password

### Session

NextAuth manages the session using JWT strategy. The session includes the user's ID, name, email, role, and access token.

---

## Image Management

### Upload Flow

1. Admin selects a file in the dashboard
2. Frontend sends the file to `POST /api/admin/file`
3. Server streams the file to Cloudinary using `upload_stream`
4. Cloudinary returns a secure URL
5. The URL is saved in the database field

### Cloudinary Configuration

All credentials are stored in the `Settings` collection under the `cloudinary` key. This allows hot-swapping Cloudinary accounts without redeploying.

### Supported Formats

- **Images:** JPEG, PNG, WebP, AVIF, GIF
- **Max size:** 20 MB (configured in `next.config.ts`)

### Image Domains

The Next.js image optimization is configured to allow Cloudinary domains:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" }
  ]
}
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-Hosted (Node.js)

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The server starts on port 3000 by default. Use a reverse proxy (Nginx/Caddy) to expose it on port 80/443.

### Environment Variables for Production

```env
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<strong-random-secret>"
MONGODB_URI="mongodb+srv://..."
```

### Nginx Configuration (Example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Start dev server with Turbopack |
| Build | `npm run build` | Build for production |
| Start | `npm start` | Run production server |
| Lint | `npm run lint` | Check code with ESLint |
| Lint Fix | `npm run lint:fix` | Auto-fix lint issues |
| Format | `npm run format` | Format code with Prettier |
| Type Check | `npm run type-check` | TypeScript type checking |

---

## Changelog

### v1.0.0

- Initial release
- Full photography portfolio with admin CMS
- MongoDB + Cloudinary integration
- NextAuth v5 authentication
- Gallery with category filtering
- Stories / blog module
- Team, testimonial, banner management
- Site settings with SEO metadata
- Contact form management
- Documentation page at `/documentation`
