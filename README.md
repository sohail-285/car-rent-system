# 🚗 Go Rent Ride - Car Rent System

A full-stack Car Rental Management System built with **React, Node.js, Express, and MongoDB** that allows customers to register, browse vehicles, track GPS locations, submit reviews, and manage car bookings online.

---

## ✨ Key Features
* **Customer Authentication:** Secure user registration, login, and profile management.
* **Vehicle Catalog:** Browse available vehicles with detailed pricing and images.
* **Booking System:** Seamless reservation workflow connected to a MongoDB database.
* **Live GPS Tracking:** Interactive GPS tracking and simulator module for rental vehicles.
* **Customer Feedback & Reviews:** Built-in review and feedback forms for completed rides.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

---

## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com
cd car-rent-system
```

### 2. Configure Environment Variables
Create a `.env` file in the root/backend directory and add your MongoDB connection string and server port:
```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

### 3. Start the Backend Server
Open a terminal and run:
```bash
cd backend
npm install
npm start
```
*(The server will run on `http://localhost:8000`)*

### 4. Start the Frontend Application
Open a **second terminal** and run:
```bash
cd frontend
npm install
npm start
```
*(The application will open automatically in your browser at `http://localhost:3000`)*

---

## 📁 Project Structure
```text
car-rent-system/
├── backend/        # Express server & API setup
├── frontend/       # React UI components & pages
├── models/         # MongoDB Mongoose schemas (Booking, User, etc.)
└── routes/         # Backend API routes
```
