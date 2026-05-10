# 🏥 MediDost Frontend

MediDost is a modern healthcare web application designed to simplify online medical services for patients, doctors, and pharmacies.  
This frontend application provides a responsive and user-friendly interface for booking appointments, managing profiles, ordering medicines, and accessing healthcare services online.

---

# 🚀 Features

## 👤 Patient Module
- Patient Registration & Login
- Secure JWT Authentication
- Book Doctor Appointments
- View Available Doctors
- Medicine Ordering System
- Profile Management
- Appointment History

---

## 🩺 Doctor Module
- Doctor Registration & Login
- Manage Availability
- View Patient Appointments
- Update Doctor Profile

---

## 💊 Pharmacy Module
- Pharmacy Registration & Login
- Manage Medicines
- Receive Orders
- Update Pharmacy Information

---

## 🤖 AI Chatbot
- Smart healthcare chatbot support
- Doctor suggestion based on symptoms
- Interactive healthcare assistance

---

## 🔒 Security Features
- JWT Authentication
- Protected Routes
- Password Validation
- Secure API Communication

---

## 🎨 UI Features
- Fully Responsive Design
- Modern User Interface
- Mobile Friendly Layout
- Smooth Navigation
- Interactive Components

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Socket.IO Client

---

## Backend
- Node.js
- Express.js
- MongoDB

---

# 📂 Project Structure

```bash
MEDIDOST-FRONTED/
│
├── public/
│   └── vite.png
│
├── src/
│   ├── assets/                  # Images, logos, icons
│   ├── Chatbot/                 # AI chatbot components
│   ├── DoctorComponents/        # Doctor related pages/components
│   ├── MainPageComponents/      # Landing/Home page components
│   ├── PatientComponents/       # Patient related components
│   ├── PharmacyComponents/      # Pharmacy related components
│   ├── App.css
│   ├── App.jsx                  # Main application component
│   ├── index.css
│   ├── main.jsx                 # React entry point
│   └── socket.js                # Socket connection setup
│
├── .env                         # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/SmartHealthcareAssistant/mediDost-Fronted.git
```

---

## 2️⃣ Navigate to Project Directory

```bash
cd medidost-frontend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Setup Environment Variables

Create a `.env` file in the root directory.

```env
VITE_API_URL=http://localhost:5000
```

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

---

# 🌐 API Integration

The frontend communicates with the backend using REST APIs.

Example:

```js
axios.get(`${import.meta.env.VITE_API_URL}/api/patient/profile`)
```

---

# 📱 Responsive Design

MediDost frontend is optimized for:

- Desktop
- Tablet
- Mobile Devices

---

# 🔐 Authentication

Authentication is handled using:

- JWT Tokens
- Local Storage
- Protected Routes

---

# 🚀 Deployment

## Frontend Deployment
- Vercel

## Backend Deployment
- Render

---

# 🧪 Future Improvements and add on

- Online Video Consultation
- AI-based Doctor Recommendation
- Razorpay Payment Integration
- Real-time Chat System
- Push Notifications
- Medical Report Upload
- Admin Dashboard

---

# 👨‍💻 Developed By

## Krishna Singh
## Aryan Gupta
## Isha Gupta
## Divyansh Yadav


---

# 📄 License

This project is developed for educational and learning purposes.

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.