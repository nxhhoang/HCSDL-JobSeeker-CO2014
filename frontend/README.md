# 🚀 JobSeekers Frontend

> A modern job seeking platform built with React, TypeScript, and Vite

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8.svg)](https://tailwindcss.com/)

## 📋 Table of Contents

- [🚀 JobSeekers Frontend](#-jobseekers-frontend)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
    - [For Candidates](#for-candidates)
    - [For Employers](#for-employers)
    - [For Admins](#for-admins)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Production Build](#production-build)
  - [🐳 Docker Setup](#-docker-setup)
    - [Option 1: Development with Hot Reload](#option-1-development-with-hot-reload)
    - [Option 2: Production Build](#option-2-production-build)
    - [Option 3: Manual Docker Build](#option-3-manual-docker-build)
  - [📁 Project Structure](#-project-structure)
  - [📜 Available Scripts](#-available-scripts)
  - [🔧 Environment Variables](#-environment-variables)
  - [👤 Demo Accounts](#-demo-accounts)
  - [🎨 Styling Guide](#-styling-guide)
  - [🧪 Testing](#-testing)
  - [🔒 Security Features](#-security-features)
  - [🚢 Deployment](#-deployment)
    - [Using Docker (Recommended)](#using-docker-recommended)
    - [Manual Deployment](#manual-deployment)
  - [📝 Code Quality](#-code-quality)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [👥 Team](#-team)
  - [📞 Support](#-support)

## ✨ Features

### For Candidates
- 🔍 **Job Search & Filter** - Advanced search with filters by category, location, salary
- 💼 **Job Applications** - Apply for jobs and track application status
- 📄 **Resume Management** - Create and manage professional resumes
- ⭐ **Save Jobs** - Bookmark favorite job postings
- 👤 **Profile Management** - Update skills, experience, and personal information
- 🔔 **Notifications** - Get updates on application status

### For Employers
- 📝 **Post Jobs** - Create and manage job postings
- 👥 **Review Applications** - View and filter candidate applications
- 🏢 **Company Profile** - Showcase company information
- 📊 **Dashboard** - Analytics and insights
- 🔍 **Search Candidates** - Find potential candidates

### For Admins
- 👨‍💼 **User Management** - Manage candidates and employers
- 📊 **Analytics Dashboard** - Platform statistics and insights
- ⚙️ **System Configuration** - Manage categories, skills, and metadata

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS 3
- **State Management:** React Query (TanStack Query)
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **UI Components:** Headless UI, Floating UI
- **Animations:** Framer Motion
- **Icons:** Heroicons, Lucide React
- **Date Handling:** date-fns
- **Testing:** Vitest, MSW (Mock Service Worker)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Docker & Docker Compose (optional, for containerization)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` file with your backend API URL:
```env
VITE_API_URL=http://localhost:4000
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## 🐳 Docker Setup

### Option 1: Development with Hot Reload

```bash
# Build and start development container
docker-compose -f docker-compose.dev.yml up --build

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

Access at: `http://localhost:3000`

### Option 2: Production Build

```bash
# Build and start production container
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose down
```

Access at: `http://localhost:3000`

### Option 3: Manual Docker Build

```bash
# Build image
docker build -t jobseeker-frontend .

# Run container
docker run -p 3000:80 jobseeker-frontend
```

## 📁 Project Structure

```
JobSeekerApp/
├── public/
├── src/
│   ├── @types/                    # Type definitions
│   │   ├── i18next.d.ts
│   │   └── ...
│   │
│   ├── apis/
│       ├── auth.api.ts          # Authentication
│   │   ├── user.api.ts           # User profile
│   │   ├── candidate.api.ts      # Candidate operations
│   │   ├── employer.api.ts       # Employer & Company
│   │   ├── job.api.ts            # Jobs
│   │   ├── application.api.ts    # Apply jobs
│   │   ├── interaction.api.ts    # Follow, Message, Notification
│   │   └── metadata.api.ts       # Skills, Categories
│   │
│   ├── assets/                    # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                # Reusable components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── InputFile/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── NavHeader/
│   │   ├── JobCard/              # Display job listing
│   │   ├── ApplicationCard/      # Display application status
│   │   ├── CompanyCard/          # Display company info
│   │   ├── SkillTag/             # Skill badges
│   │   ├── SearchBar/            # Job search bar
│   │   ├── FilterPanel/          # Job filter sidebar
│   │   ├── Pagination/
│   │   ├── Modal/                # Modal dialog
│   │   ├── Notification/         # Notification dropdown
│   │   └── ErrorBoundary/
│   │
│   ├── constants/                 # Constants
│   │   ├── config.ts
│   │   ├── path.ts
│   │   ├── jobStatus.ts          # Job status enums
│   │   ├── applicationStatus.ts  # Application status enums
│   │   └── userRole.ts           # User roles (candidate/employer)
│   │
│   ├── contexts/                  # React Context
│   │   ├── app.context.tsx
│   │   └── notification.context.tsx
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useQueryConfig.tsx
│   │   ├── useQueryParams.tsx
│   │   ├── useSearchJobs.tsx     # Search jobs
│   │   ├── useAuth.tsx           # Authentication hook
│   │   └── useNotification.tsx   # Notification hook
│   │
│   ├── i18n/                      # Internationalization
│   │   └── i18n.ts
│   │
│   ├── layouts/                   # Layout components
│   │   ├── MainLayout/           # Main layout for all pages
│   │   ├── AuthLayout/           # Layout for login/register
│   │   ├── CandidateLayout/      # Layout for candidate pages
│   │   └── EmployerLayout/       # Layout for employer pages
│   │
│   ├── locales/                   # Translation files
│   │   ├── en/
│   │   └── vi/
│   │
│   ├── pages/                     # Page components
│   │   ├── Login/
│   │   ├── Register/
│   │   │   ├── CandidateRegister/
│   │   │   └── EmployerRegister/
│   │   │
│   │   ├── Home/                 # Landing page
│   │   ├── JobList/              # Browse all jobs
│   │   ├── JobDetail/            # Job detail page
│   │   ├── JobSearch/            # Search results page
│   │   │
│   │   ├── Candidate/            # Candidate pages
│   │   │   ├── Profile/          # Edit profile
│   │   │   ├── Resume/           # Manage resume/CV
│   │   │   ├── Applications/     # Track applications
│   │   │   ├── SavedJobs/        # Saved jobs
│   │   │   └── Settings/         # Account settings
│   │   │
│   │   ├── Employer/             # Employer pages
│   │   │   ├── Dashboard/        # Employer dashboard
│   │   │   ├── CompanyProfile/   # Edit company profile
│   │   │   ├── PostJob/          # Create job posting
│   │   │   ├── ManageJobs/       # Manage all job postings
│   │   │   ├── Applications/     # Review applications
│   │   │   ├── CandidateSearch/  # Search candidates
│   │   │   └── Schedule/         # Interview schedule
│   │   │
│   │   ├── Company/              # Company pages
│   │   │   ├── CompanyList/      # Browse companies
│   │   │   └── CompanyDetail/    # Company detail page
│   │   │
│   │   └── NotFound/
│   │
│   ├── types/                     # TypeScript types
│   │   ├── auth.type.ts
│   │   ├── user.type.ts
│   │   ├── candidate.type.ts
│   │   ├── employer.type.ts
│   │   ├── job.type.ts
│   │   ├── application.type.ts
│   │   ├── interaction.type.ts
│   │   ├── metadata.type.ts
│   │   └── utils.type.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── auth.ts
│   │   ├── http.ts
│   │   ├── rules.ts              # Validation rules
│   │   ├── utils.ts
│   │   └── dateUtils.ts          # Date formatting
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── useRouteElements.tsx
│   └── index.css
│
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── Dockerfile                     # Production Docker build
├── Dockerfile.dev                 # Development Docker build
├── docker-compose.yml             # Production compose
├── docker-compose.dev.yml         # Development compose
├── nginx.conf                     # Nginx configuration
└── .dockerignore

```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:3000` |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run prettier` | Check code formatting |
| `npm run prettier:fix` | Format code with Prettier |
| `npm run test` | Run tests with Vitest |
| `npm run coverage` | Generate test coverage report |
| `npm run storybook` | Start Storybook at `http://localhost:6006` |
| `npm run build-storybook` | Build Storybook for production |

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

## 👤 Demo Accounts

For development and testing purposes:

| Role | Email/Phone | Password | Access |
|------|-------------|----------|---------|
| **Admin** | `sManager` | `password` | Admin Dashboard |
| **Candidate** | `dev2@mail.com` | `123` | Candidate Portal |
| **Employer** | `cf@boss.com` | `123` | Employer Dashboard |
| **Company** | `hr@fpt.com` | `123` | Company Management |

## 🎨 Styling Guide

This project uses **TailwindCSS** with a custom theme:

- **Primary Color:** Blue (`#2563eb`)
- **Custom Orange:** `#ee4d2d` (defined in tailwind.config.cjs)
- **Responsive Breakpoints:** Following Tailwind's default
- **Custom Container:** Max-width 7xl with auto margins

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run coverage
```

## 🔒 Security Features

- ✅ Protected routes for authenticated users
- ✅ Role-based access control (Candidate/Employer/Admin)
- ✅ JWT token management
- ✅ XSS protection with DOMPurify
- ✅ Nginx security headers in production
- ✅ Environment variable validation

## 🚢 Deployment

### Using Docker (Recommended)

```bash
# Build and push to Docker Hub
docker build -t yourusername/jobseeker-frontend .
docker push yourusername/jobseeker-frontend

# Pull and run on server
docker pull yourusername/jobseeker-frontend
docker run -d -p 80:80 yourusername/jobseeker-frontend
```

### Manual Deployment

1. Build the project: `npm run build`
2. Upload `dist/` folder to your web server
3. Configure server for SPA routing (see `nginx.conf`)

## 📝 Code Quality

- **ESLint:** Enforces code quality rules
- **Prettier:** Ensures consistent formatting
- **TypeScript:** Type safety throughout the project
- **Husky:** Pre-commit hooks (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Project:** HCSDL - JobSeeker Platform
- **Course:** CO2014 - Database Systems

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

**Made with ❤️ by the JobSeekers Team**