# 🖥️ Online Compiler

An online code compiler inspired by **OnlineGDB / Programiz**, built as a full-stack mini-project.  
It supports **multiple programming languages**, user authentication, and code storage.

---

## 📌 Features

- 🔹 **User Authentication**
  - Register & login with secure password hashing (bcrypt)
  - JWT-based authentication & authorization
- 🔹 **Code Compilation**
  - Supports Python, Java, JavaScript, and C/C++
  - Executes code securely (via Docker or external APIs)
  - Input/output support
- 🔹 **User Code Management**
  - Save, fetch, and manage code snippets by user
- 🔹 **Frontend**
  - Clean UI with **TailwindCSS**
  - Code editor powered by **CodeMirror** (VS Code–like experience)
  - Input/output panes for interaction
- 🔹 **Backend**
  - REST APIs built with **Express.js**
  - **MySQL** for database management
- 🔹 **Dev Tools**
  - dotenv for config
  - nodemon for hot reload during development

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, TailwindCSS, CodeMirror
- **Backend:** Node.js, Express.js
- **Database:** MySQL (mysql2 / promise pool)
- **Authentication:** JWT, bcryptjs
- **Code Execution:** Docker containers / external APIs
- **Other:** Axios, CORS, dotenv, nodemon

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/online-compiler.git
cd online-compiler
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup MySQL

```sql
CREATE DATABASE online_compiler;

USE online_compiler;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  language VARCHAR(50),
  code TEXT,
  input TEXT,
  output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. Add `.env` file

```
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=online_compiler
PORT=5000
JWT_SECRET=secret
```

### 5. Run the server

```bash
npm run dev
```

Server runs at:
👉 `http://localhost:5000`

---

## 🔑 API Endpoints

### Auth

- `POST /api/auth/register` → Create new user
- `POST /api/auth/login` → Login and get JWT

### Compiler

- `POST /api/compiler/run`

  ```json
  {
    "language": "python",
    "code": "print('Hello, world!')",
    "input": ""
  }
  ```

  Response:

  ```json
  {
    "output": "Hello, world!"
  }
  ```

### User Code

- `POST /api/code/save` → Save user code
- `GET /api/code/list` → Get saved codes for logged-in user

_(Protected with JWT)_

---

## 🚀 Usage

- Visit the frontend UI served from `/frontend`
- Register/login to save code
- Run programs directly in the browser

---

## 📜 License

This project is licensed under the MIT License.
