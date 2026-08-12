# 🏙️ CivicConnect

### Smart Public Complaint Management System

CivicConnect is a web-based public complaint management system designed to provide citizens with a simple way to report civic issues and track their complaints while helping municipal administrators manage and process complaints efficiently.

The platform connects citizens with the appropriate municipality and department through a centralized digital complaint management system.

---

## 🎯 Problem

Citizens often face difficulties when reporting public issues such as:

* 🛣️ Road problems
* 🚰 Water supply issues
* 🗑️ Waste and sanitation problems
* 💡 Electricity issues
* 🌊 Drainage problems
* 🏢 Other municipal service-related complaints

Traditional complaint processes can make it difficult for citizens to submit complaints, track their progress, and know which department is handling their issue.

Municipal administrators also need an organized system to view, process, and update complaints.

---

## 💡 Our Solution

**CivicConnect** provides a centralized platform for citizens and municipal administrators.

Citizens can submit complaints with relevant details and supporting images, while administrators can view complaints assigned to their department, process them, update their status, and provide remarks.

The system also connects complaints with the selected municipality and relevant department to improve complaint routing and management.

---

## ✨ Key Features

### 👤 Citizen Portal

* User registration and login
* Citizen dashboard
* Submit civic complaints
* Select municipality
* Select complaint category and subcategory
* Enter complaint details
* Upload supporting images
* View submitted complaints
* View complaint details
* Track complaint progress
* View complaint history
* View complaint status and remarks

### 🏢 Admin Portal

Municipal administrators can:

* Login securely
* View complaints assigned to their department
* Search complaints
* View complaint details
* Process complaints
* Update complaint status
* Add remarks
* Track complaint processing

### 🏛️ Municipality & Department Management

Complaints are associated with the selected municipality and routed to the appropriate municipal department.

The system supports departments such as:

* Roads Department
* Sanitation Department
* Electricity Department
* Water Supply Department
* Drainage Department
* Other municipal departments

### 📷 Image Upload

Citizens can attach images while submitting complaints to provide visual information about the reported civic issue.

### 📍 Complaint Tracking

Citizens can track the progress of their complaints and view updates provided during the processing of the complaint.

---

## 🔄 System Workflow

```text
Citizen
   │
   ▼
Register / Login
   │
   ▼
Citizen Dashboard
   │
   ▼
Submit Complaint
   │
   ├── Municipality
   ├── Category
   ├── Subcategory
   ├── Complaint Description
   └── Supporting Image
   │
   ▼
Complaint Created
   │
   ▼
Department Assignment
   │
   ▼
Municipal Admin
   │
   ├── View Complaint
   ├── Process Complaint
   ├── Update Status
   └── Add Remarks
   │
   ▼
Citizen
   │
   ▼
Track Complaint
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Python
* Flask
* Flask-CORS
* REST APIs

### Database

* PostgreSQL

### API Testing

* Postman

### Development Tools

* Visual Studio Code
* Git
* GitHub

---

## 🔌 REST API

The frontend communicates with the Flask backend through REST APIs.

The application includes API functionality for:

| Functionality        | Purpose                                    |
| -------------------- | ------------------------------------------ |
| User Registration    | Create citizen accounts                    |
| User Login           | Authenticate citizens                      |
| Admin Login          | Authenticate municipal administrators      |
| User Details         | Retrieve user information                  |
| Municipalities       | Retrieve municipality information          |
| Departments          | Retrieve department information            |
| Complaint Submission | Submit a new complaint                     |
| Complaint Retrieval  | Retrieve complaint information             |
| User Complaints      | Retrieve complaints submitted by a citizen |
| Complaint Tracking   | Track complaint progress                   |
| Image Upload         | Upload complaint images                    |
| Complaint Status     | Update complaint status                    |
| Complaint Remarks    | Add administrative remarks                 |

---

## 🗄️ Database

**PostgreSQL** is used as the database for storing and managing application data.

The system manages information related to:

* Users
* Administrators
* Municipalities
* Departments
* Complaints
* Complaint status
* Complaint history
* Remarks
* Uploaded complaint images

---

## 📂 Project Structure

```text
CivicConnect/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── uploads/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/abishajustinjose04-ctrl/CivicConnect-AI.git
```

```bash
cd CivicConnect-AI
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Configure your PostgreSQL database and update the database connection settings.

Start the Flask server:

```bash
python app.py
```

The backend runs locally on:

```text
http://127.0.0.1:5000
```

---

### 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## 🧪 API Testing with Postman

The backend APIs were tested using **Postman**.

Postman was used to test functionalities such as:

* Registration
* Login
* Complaint submission
* Complaint retrieval
* Complaint tracking
* Image upload
* Status updates
* Other backend endpoints

---

## 🔐 Security

The application includes authentication for citizens and administrators.

Passwords are handled using secure password hashing in the backend.

For production deployment, additional security measures such as HTTPS, environment variables, stronger access control, and production-grade configuration should be implemented.

---

## 🚀 Future Enhancements

Possible future improvements include:

* 🤖 AI-assisted complaint categorization
* 🔔 Real-time notifications
* 🗺️ Interactive complaint maps
* 📊 Advanced administrative analytics
* 📱 Mobile application
* 🌐 Multi-language support
* ☁️ Cloud deployment
* 📷 Advanced image-based complaint analysis

---

## 🌟 Project Highlights

CivicConnect demonstrates the practical use of:

**React + Flask + PostgreSQL + REST APIs**

to build a complete civic complaint management platform connecting citizens and municipal administrators.

The project focuses on improving:

* Complaint submission
* Department routing
* Complaint tracking
* Administrative processing
* Communication between citizens and municipal authorities

---

## 👩‍💻 Project

**CivicConnect**

A Smart Public Complaint Management System developed as a hackathon project.

---

## 📜 License

This project is intended for educational and project demonstration purposes.
