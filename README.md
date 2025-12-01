# **Citizen Grievance Portal**  
*A full-stack civic application built with the help of AI.*

---

## 🌟 **Overview**

The **Citizen Grievance Portal** is a modern platform that allows citizens to submit, track, and manage complaints related to essential public services such as electricity, water, roads, waste management, and more.

This system supports **two user roles**:

- **Citizens** – Submit and track complaints  
- **Government Officers** – View, update, and resolve complaints

The entire project was built with the help of AI — combining solid architecture with clean, scalable code.

---

## 🎯 **Key Features**

### 👤 **Citizen Module**
- Submit complaints with category, description, location, and attachments  
- Track complaint status with human-readable IDs (example: *GRP-2024-001*)  
- View past complaints  
- Multilingual support (English, Kannada, Hindi, Tamil)

### 🏛️ **Officer Module**
- Login with department-based roles  
- View complaints assigned to their department  
- Add notes and update complaint statuses  
- Maintain complaint timeline

### 🌐 **General Features**
- Fully responsive UI (Material Design + Tailwind + Shadcn UI)  
- Accessibility-first design (WCAG 2.1 AA)  
- Multilingual support with custom i18n  
- In-memory dev storage + PostgreSQL production storage

---

## 🧱 **Tech Stack**

### 🎨 **Frontend**
- **React + TypeScript**
- **Vite**
- **Shadcn UI** (New York variant)
- **Radix UI Primitives**
- **Tailwind CSS**
- **Wouter Router**
- **TanStack Query**
- **React Hook Form + Zod**
- Context API for Auth + Language

---

### 🛠️ **Backend**
- **Express.js + TypeScript**
- **Passport.js (session-based)**
- **Scrypt** password hashing
- **express-session**
- RESTful API with clean routes
- Storage abstraction via **IStorage**

---

### 🗄️ **Database (Production)**
- **PostgreSQL (Neon)**
- **Drizzle ORM**
- UUID primary keys  
- Text enums  
- complaint_notes, complaints, users tables  
- Schema migrations via Drizzle Kit  

---

## 📂 **Project Structure**

```
/frontend
  /src
    /components
    /pages
    /context
    /hooks
    /lib
    /api

/backend
  /src
    /routes
    /controllers
    /middleware
    /utils
    /storage
    /auth
    /db

/shared
  schema.ts
  types.ts
```

---

## 🔐 **Authentication Flow**

- Session-based authentication  
- Passport Local Strategy  
- PostgreSQL/MemStore session storage  
- Role-based protected routing  

---

## 📡 **API Endpoints**

### 🔑 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login user |
| POST | `/api/register` | Citizen/Officer registration |
| GET | `/api/user` | Get current session user |

### 📝 Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Create complaint |
| GET | `/api/complaints` | List complaints (role-based) |
| GET | `/api/complaints/:id` | Get complaint details |
| PUT | `/api/complaints/:id` | Update complaint / add notes |
| GET | `/api/complaints/track/:id` | Public complaint tracking |

---

## 🌍 **Internationalization**

Custom-built lightweight i18n using React Context  
✔ English  
✔ Kannada  
✔ Hindi  
✔ Tamil  

---

## 🧪 **Development Setup**

### 1️⃣ Clone the repository
```
git clone <your-repo-link>
cd citizen-grievance-portal
```

### 2️⃣ Install dependencies
```
cd frontend && npm install
cd ../backend && npm install
```

### 3️⃣ Run development servers
Frontend:
```
npm run dev
```

Backend:
```
npm run dev
```

---

## 🚀 **Production Deployment**

- Drizzle migrations  
- Vite build for frontend  
- ESBuild for backend bundling  
- Deploy on Render / Vercel / Railway  

---

## ❤️ **Why I Built This**

I’m not a full-stack developer yet…  
But I *do* know how to use AI effectively.

This project helped me learn:

- Full-stack architecture  
- Server + client communication  
- ORM concepts  
- Session-based authentication  
- Clean code structure guided by AI  

---

## 🔗 **Repository Link**

👉https://github.com/laxmikant-7/Citizen_Grievance_Portal.git

---

## 🏆 **Contributions**
Contributions, issues, and feature requests are welcome.

---

## 📜 **License**
MIT License.

