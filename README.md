# Doctor Appointment Booking App

A full-stack web application that allows users to book appointments with doctors. The application enables users to view doctor profiles, select an appointment slot, and book appointments. Doctors can then meet patients physically for consultations.

## 🚀 Live Demo

👉 [Click here to try the app](https://healthscheduler.onrender.com/)

## Features

- **User Authentication**: Email/password login and Google OAuth.
- **Appointment Booking**: Schedule and manage doctor appointments.
- **Doctor Profiles**: View doctor details and specialties.
- **Real-time Updates**: Live status for bookings and cancellations using Socket.IO.
- **Admin Controls**: Manage doctors, users, and appointments.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)
- Google OAuth (login)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/doctor-appointment-app.git
cd doctor-appointment-app
```

### 2. Install Dependencies

**Frontend**:

```bash
cd frontend
npm install
```

**Backend**:

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in each of the `frontend` and `backend` directories.

**Frontend** (`frontend/.env`):

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Backend** (`backend/.env`):

```env
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-jwt-secret
MONGO_URI=your-mongodb-uri
PORT=5000

## Usage

- **Register/Login**: With email or Google account
- **Book Appointments**: Choose a doctor and available time
- **Real-time Updates**: Booking status updates instantly
- **Admin Features**: Add/edit doctors, view bookings

## Deployment

To build the app for production:

```bash
npm run build --prefix frontend
```

Then host the `frontend/dist` on a static server (like Render, Netlify, Vercel) and the backend on a platform like Render or Railway.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request
