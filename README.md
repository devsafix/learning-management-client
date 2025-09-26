# Online Learning Platform - Frontend

This is the **frontend** of the Online Learning Platform, built with **React, Redux Toolkit (RTK Query), Tailwind CSS, and ShadCN UI**.
It provides a responsive user interface for managing and exploring courses, including authentication, course browsing, and enrollment.

---

## Features

- **Authentication** (Login, Register, JWT-based session handling)
- **Course Management**

  - Browse all courses
  - View course details
  - Enroll into courses

- **Instructor Dashboard**

  - Add, edit, or delete courses
  - View enrolled students

- **Admin Panel**

  - Manage users
  - Manage categories and courses

- **UI/UX**

  - Tailwind CSS styling
  - ShadCN UI components
  - Fully responsive design

- **RTK Query** for API integration

---

## Tech Stack

- React 18
- Redux Toolkit (RTK Query)
- React Router DOM
- Tailwind CSS + ShadCN UI
- Vite (for fast builds)
- TypeScript

---

## Folder Structure

```
frontend/
│── src/
│   ├── components/   # Reusable components (Navbar, Footer, UI components)
│   ├── modules/      # Feature-based modules (auth, course, category, etc.)
│   ├── redux/        # Redux slices & RTK Query API services
│   ├── pages/        # Route pages (Home, Courses, Dashboard, etc.)
│   ├── routes/       # Route configuration
│   ├── ui/           # ShadCN UI-based components
│   ├── lib/          # Utilities, helpers
│   └── main.tsx      # Entry point
│
│── package.json
│── vite.config.ts
│── tailwind.config.js
```

---

## Installation & Setup

1. Clone the repository

   ```bash
   git clone https://github.com/devsafix/learning-management-client
   cd learning-management-client
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Build for production

   ```bash
   npm run build
   ```

---

## API Integration

This project consumes the backend API for:

- Authentication
- Courses
- Categories
- Enrollments
- Payments

Ensure the backend server is running before starting the frontend.

---

## Contribution

1. Fork the repository
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**.

---
