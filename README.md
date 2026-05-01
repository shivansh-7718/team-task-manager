# 🗂️ Team Task Manager

A full-stack collaborative task management web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). It allows teams to manage projects, assign tasks, and track progress with a role-based access system.

> 🔗 **Live Demo:** [https://team-task-manager-swart-nu.vercel.app/]

---


---

## 🚀 Features

- 🔐 **Authentication** — Secure Signup & Login using JWT tokens
- 🔑 **Role-Based Access Control** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create projects, add/remove team members
- ✅ **Task Management** — Create, assign, update, and delete tasks
- 📊 **Live Dashboard** — Real-time task overview with status filters
- ⚠️ **Overdue Detection** — Highlights overdue tasks automatically
- 🔄 **Status Tracking** — Pending → In Progress → Completed

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI Framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Plain CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |

---

## 📁 Project Structure

```
team-task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── projects/
│   │   │       ├── Projects.jsx
│   │   │       └── ProjectDetail.jsx
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   └── projects.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup Guide

Follow these steps to run the project on your local machine.

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) (v18 or above)
- [MongoDB](https://www.mongodb.com) (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Git](https://git-scm.com)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Project Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/projects` | Get all user projects | ✅ |
| POST | `/api/projects` | Create a project | ✅ |
| GET | `/api/projects/:id` | Get project by ID | ✅ |
| PUT | `/api/projects/:id` | Update project | ✅ |
| DELETE | `/api/projects/:id` | Delete project | ✅ |
| POST | `/api/projects/:id/members` | Add member | ✅ Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | ✅ Admin |

### Task Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/tasks/my` | Get my tasks (dashboard) | ✅ |
| GET | `/api/tasks/project/:projectId` | Get project tasks | ✅ |
| POST | `/api/tasks` | Create a task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

---

## 👥 Role Permissions

| Action | Admin | Member |
|---|---|---|
| Create Project | ✅ | ✅ |
| Delete Project | ✅ Own only | ✅ Own only |
| Add Members | ✅ | ❌ |
| Remove Members | ✅ | ❌ |
| Create Tasks | ✅ | ✅ |
| Delete Any Task | ✅ | ❌ |
| Delete Own Task | ✅ | ✅ |
| Update Task Status | ✅ | ✅ |

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://team-task-manager-swart-nu.vercel.app/|
| Backend | Render |  https://team-task-manager-backend-6h83.onrender.com|
| Database | MongoDB Atlas | Cloud hosted |

---

## 👨‍💻 Author

**Shivansh Tiwari**

- GitHub: [@shivansh-7718]

---

## 📄 License

This project is built for educational purposes as part of a full-stack development assignment.
