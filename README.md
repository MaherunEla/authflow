# AuthFlow 🔐

A modern authentication system built with **Next.js 14 App Router**, **Prisma**, **PostgreSQL**, and custom **JWT-based authentication**. It features:

- Email/password login
- Google OAuth login via NextAuth
- Server-side 2FA (Two-Factor Authentication)
- Session tracking (IP, device, location)
- Admin dashboard for user management and security logs

## 🚀 Features

- ✅ Secure email/password login with encrypted JWT cookies
- 🔐 2FA setup using TOTP (Google Authenticator)
- 🧠 OAuth login with Google via NextAuth
- 🧭 Session history and device tracking (IP, time, location)
- 👮 Admin panel with user table, login logs, and security settings
- 💅 Built with Shadcn/UI and TailwindCSS for UI

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js (Google login)
- JWT (custom auth)
- FingerprintJS (device fingerprinting)
- Resend (email provider)
- Shadcn/UI + TanStack Table

## 📦 Installation

```bash
git clone
cd authflow
npm install
```

🧪 Environment Variables
Create a .env.local file and add:
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

DATABASE_URL=postgresql://user:pass@localhost:5432/authflow
DIRECT_URL=
JWT_SECRET=your_custom_jwt_secret
TEMP_SECRET=your_temp_secret
RESEND_API_KEY=your_resend_api_key

🧱 Prisma Setup

npx prisma db push
npx prisma generate

▶️ Running Locally
npm run dev

🔐 2FA Guide
Visit /twofa to enable 2FA.

Scan the QR code using Google Authenticator.

Enter the generated 6-digit code to verify.

🧪 Testing
You can test APIs using tools like:

Postman

Thunder Client

fetch/axios in your browser dev tools or internal routes

🌍 Deployment
✅ Vercel
This project is ready for Vercel.

Push to GitHub

Go to vercel.com

Import your repo → Set environment variables

Click Deploy

📷 Screenshots

🙋‍♂️ Author

📄 License
