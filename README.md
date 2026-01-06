# AuthFlow 🔐

[Live Project](https://authflow-one.vercel.app/)

A modern authentication system built with **Next.js 15 App Router**, **Prisma**, **PostgreSQL**, and custom **JWT-based authentication**. It features:

- Email/password login
- Google OAuth login via NextAuth
- Server-side 2FA (Two-Factor Authentication)
- Session tracking (IP, device, location)
- Admin dashboard for user management and security logs

## 💡 Why AuthFlow?

AuthFlow was built to demonstrate how modern authentication systems
are designed in real-world production apps, including:

- Secure JWT handling
- Server-side 2FA flows
- Session & device-level security
- Admin-level audit and monitoring

> This project was built with a test-driven and security-first mindset.

## 🚀 Features

- ✅ Secure email/password login with encrypted JWT cookies
- 🔐 2FA setup using TOTP (Google Authenticator)
- 🧠 OAuth login with Google via NextAuth
- 🧭 Session history and device tracking (IP, time, location)
- 👮 Admin panel with user table, login logs, and security settings
- 💅 Built with Shadcn/UI and TailwindCSS for UI

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js (Google login)
- JWT (custom auth)
- Jest (unit & integration testing)
- FingerprintJS (device fingerprinting)
- Resend (email provider)
- Shadcn/UI + TanStack Table

## 📦 Installation

```bash
git clone https://github.com/MaherunEla/authflow.git
cd authflow
npm install

```

### 🧪 Environment Variables

Create a .env.local file and add:

```env
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

```

### 🧱 Prisma Setup

```bash
npx prisma db push
npx prisma generate

```

### ▶️ Running Locally

```bash
npm run dev

```

### 🔐 2FA Guide

- Visit /twofa to enable 2FA.

- Scan the QR code using Google Authenticator.

- Enter the generated 6-digit code to verify.

### 🧪 Testing

You can manually test APIs using tools like:

- Postman

- Thunder Client

- fetch/axios in your browser dev tools or internal routes

### 🌍 Deployment (Vercel)

✅ This project is ready for Vercel.

1.Push to GitHub

2.Go to vercel.com

3.Import your repo → Set environment variables

4.Click Deploy

## 🧪 Testing & Quality Assurance

This project includes automated tests for critical authentication flows
to ensure security and reliability.

### Covered Test Suites

- ✅ Signup API (validation, duplicates, error handling)
- ✅ Login API (credentials, user status, JWT issuance)
- ✅ Two-Factor Authentication (2FA) Login Flow

### Testing Stack

- Jest (unit & integration testing)
- Prisma mocking
- JWT & bcrypt mocking

### Sample Test Run

Below is a real terminal output showing passing test suites:

![Auth Tests Passing](public/project/authtest.jpg)
![Login Tests Passing](public/project/logintest.jpg)
![2FA Tests Passing](public/project/login2fa.jpg)

> Advanced device & session security tests are under active development,
> following a test-driven approach.

### 🧪 Run Tests

```bash
npm run test

```

## 📷 Screenshots

![Admin Dashboard](public/project/DashboardAdmin.png)
![User Management Table](public/project/usertableaction.png)
![User Management Table send email with suspend reason](public/project/suspenduser.png)
![User Management Table suspend email](public/project/sentsuspendreason.jpg)
![Session & logs user active table](public/project/useractivetable.png)
![Session & logs failed login attempt table](public/project/failedloginattempt.png)
![Session & logs Suspicioustable](public/project/suspicioustable.png)
![Session & logs Audit table](public/project/audittable.png)
![Authentication 2fa status table](public/project/2fastatustable.png)
![Analytic](public/project/analytic.png)
![Analytic new user table](public/project/newuser.png)
![Navbar](public/project/navbar.png)
![Mobile navbar](public/project/navbarmobile.png)
![Signup page](public/project/signuppage.jpg)
![Login page](public/project/login.jpg)
![Login with 2fa](public/project/loginwith2fa.jpg)
![Home page](public/project/homepage.jpg)
![Profile page](public/project/profilesetting.png)
![Security setting ](public/project/secuitysetting.png)
![Two fa qr scan page](public/project/twofaverified.png)

## 🙋‍♂️ Author

**Maherun Nessa Ela**
📧 meherunela2002@gmail.com
🌍[LinkedIn](https://www.linkedin.com/in/maherun-nessa-ela/)

---
