# Simple Parking App

Simple Parking App is a lightweight, modern web app designed for properties to manage parking spaces with ease.

## Screenshots

### Landing Page

<img width="1800" height="976" alt="landingpage" src="https://github.com/user-attachments/assets/e5ba0f5e-8030-4662-9c7e-a0a30dbe2c0d" />

### Dashboard

<img width="1800" height="976" alt="dashboard" src="https://github.com/user-attachments/assets/831c40d2-f5c7-4089-a235-12cddd4f30be" />

### Small Screens

<img width="311" height="886" alt="dashboard_mobile" src="https://github.com/user-attachments/assets/840316f4-cb76-4093-8e8d-f787edf23c90" />

<img width="311" height="886" alt="properties_mobile_dark" src="https://github.com/user-attachments/assets/62b04508-6aa4-4ec3-9269-68813ac7e688" />

<img width="311" height="886" alt="newRes+mobile_dark" src="https://github.com/user-attachments/assets/49f7a9a1-6b28-4342-90e8-8546a0476f35" />

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

