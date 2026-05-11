# MediDost Frontend

Frontend application for the MediDost healthcare platform.

MediDost is a healthcare management system built to connect patients, doctors, pharmacies, and administrators through a single digital platform. The frontend provides interfaces for appointment booking, medicine ordering, authentication, profile management, and healthcare assistance services.

The application is built with React and Vite and communicates with the MediDost backend through REST APIs. Real-time features are handled using Socket.IO.

---

## Live Demo

Frontend: https://your-frontend.vercel.app

Backend API: https://your-backend.onrender.com

---

## Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

## Features

### Patient Module

- Patient registration & login
- Doctor search and appointment booking
- Medicine ordering
- Appointment history
- Prescription upload
- Profile management

### Doctor Module

- Doctor authentication
- Appointment management
- Availability scheduling
- Patient information access

### Pharmacy Module

- Pharmacy registration & login
- Inventory management
- Medicine order handling
- Pharmacy profile management

### Platform Features

- JWT authentication
- Protected routes
- AI chatbot integration
- Responsive UI
- Real-time updates using Socket.IO
- Secure API communication

---

## Project Structure

```bash
MEDIDOST-FRONTEND/
│
├── public/
│
├── src/
│   ├── assets/                    # Images, logos, icons
│   ├── Chatbot/                   # AI chatbot components
│   ├── DoctorComponents/          # Doctor related components
│   ├── MainPageComponents/        # Landing page components
│   ├── PatientComponents/         # Patient related components
│   ├── PharmacyComponents/        # Pharmacy related components
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # React entry point
│   └── socket.js                  # Socket.IO configuration
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Architecture Overview

```text
Frontend (React + Vite)
        ↓
REST API Communication
        ↓
Backend Server (Node.js + Express)
        ↓
MongoDB Database
```

---

## Screenshot

### Home Page

![MediDost Home Page](./src/assets/TopHeroSectionImg.png)

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/SmartHealthcareAssistant/mediDost-Frontend.git
```

Navigate to the project directory:

```bash
cd mediDost-Frontend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

Example:

```env
VITE_API_URL=http://localhost:5000
```

Production example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## .env.example

```env
VITE_API_URL=
```

---

## Running the Application

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## API Integration

The frontend communicates with the backend using REST APIs.

Example request:

```js
axios.get(`${import.meta.env.VITE_API_URL}/api/patient/profile`)
```

The API base URL is managed through environment variables for local and production environments.

---

## Authentication

Authentication is implemented using JWT tokens with protected routes and role-based access handling.

---

## Real-Time Features

Socket.IO is used for:

- Instant updates
- Notifications
- Live communication support

---

## Responsive Design

The UI is designed with a mobile-first approach using Tailwind CSS and supports:

- Desktop
- Tablet
- Mobile devices

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## Related Applications

| Application | Description |
|---|---|
| MediDost Backend | Backend REST API service |
| MediDost Admin Portal | Admin dashboard application |

---

## Roadmap

Planned improvements:

- Video consultation support
- Razorpay payment integration
- Push notifications
- Real-time chat system
- Medical report management
- AI-based doctor recommendation
- E-prescription system

---

## Version

v1.0.0

---

## Contributors

- Krishna Singh
- Aryan Gupta
- Isha Gupta
- Divyansh Yadav

---

## License

MIT License