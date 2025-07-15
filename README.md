# Simple Parking App

Simple Parking App is a lightweight, modern web app designed for properties to manage parking spaces with ease.

Built with:
- Next.js 15 (App Router)
- Supabase (Auth, DB, RLS, Storage)
- Tailwind CSS
- TypeScript
- Deployed on Vercel

---

## Features

- Manage and assign parking stalls
- Track reservation status (arriving, checked in, checked out)
- Real-time updates with Supabase subscriptions
- Responsive UI

---

## Tech Stack

| Tech         | Purpose                          |
|--------------|----------------------------------|
| Next.js 15   | React framework with App Router  |
| Supabase     | Database, Auth, RLS, Realtime    |
| Tailwind CSS | Utility-first styling            |
| TypeScript   | Type safety                      |
| Shadcn/ui    | UI Components                    |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/GurkirtSingh/simple-parking.git
cd ./simple-parking
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```
### 3. Setup environment variables
Create a .env.local file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
### 4. Local Development
```bash
npm run dev
```
Project runs at http://localhost:3000

## Folder Structure (App Router)
```
/auth
/app
  /protected
    /dashboard
      /@reservations <-- reservation slot (intercepting route)
    /properties
      /levels
      /reservations
      /stalls
/components
/lib
  /supabase
    - database.types.ts
```

## Contact / Feedback
Found a bug or have a feature request? Open an issue or email: gurkirtsingh@gmail.com

