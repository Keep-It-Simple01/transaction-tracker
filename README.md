# Transaction Tracker

A simple mobile application for tracking transactions. Users can log in, view their transaction history, and add new transactions. The app connects to a backend server that stores transaction data.

## Features
- User login with placeholder credentials
- View a list of transactions
- Add new transactions
- Simple and clean UI

---

## Short Project Description
This project is a **Transaction Tracker** mobile application that enables users to record and monitor their financial transactions. The application consists of a **React Native frontend** and a **Node.js Express backend**, which communicate via RESTful APIs. Users can log in with placeholder credentials, view past transactions, and add new ones.

---

## Challenges Faced & Solutions
### **1. State Management for Transactions**
- **Challenge:** Keeping track of transactions across different screens.
- **Solution:** Used React Context API to manage state globally, ensuring seamless updates.

### **2. Form Validation for User Input**
- **Challenge:** Preventing users from submitting invalid or incomplete transaction details.
- **Solution:** Implemented **Yup + Formik** for validation, ensuring fields are properly filled before submission.

### **3. Backend Deployment Issues**
- **Challenge:** Deploying the backend to a reliable hosting service.
- **Solution:** Used **Render** for hosting the backend, making it easily accessible.

### **4. Mobile App Compatibility**
- **Challenge:** Ensuring the app works on both Android and iOS devices.
- **Solution:** Used **Expo** for streamlined development and testing.

---

## Installation
### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/transaction-tracker.git
cd transaction-tracker
```

### **2. Set Up Backend (Server)**
#### **Prerequisites**
- Node.js installed

#### **Installation Steps**
```sh
cd backend
npm install
```

#### **Run Backend Server**
```sh
node server.js
```
The backend will start on **http://localhost:5000**.

---

### **3. Set Up Frontend (Mobile App)**
#### **Prerequisites**
- Expo CLI installed

#### **Installation Steps**
```sh
cd frontend
npm install
```

#### **Run React Native App**
```sh
npx expo start
```
This will open an Expo development server where you can run the app on an emulator or a real device.

---

## API Endpoints
- **POST /login** → User login (placeholder authentication)
- **GET /transactions** → Fetch transactions
- **POST /transactions** → Add a new transaction

---

## Deployment
### **Backend Deployment**
You can deploy the backend using **Render, Vercel, or Railway**.

Example deployment with Render:
1. Push backend code to GitHub.
2. Create a new **Node.js Web Service** on [Render](https://render.com/).
3. Connect to your GitHub repository and deploy.

### **Frontend Deployment**
- Deploy via Expo (`expo publish`).
- Generate an APK for Android or an IPA for iOS using `eas build`.

---

## Contributing
Feel free to fork this repository and make improvements! Submit a pull request if you have enhancements or bug fixes.

---

## License
This project is open-source under the MIT License.

