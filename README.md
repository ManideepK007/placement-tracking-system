---

# Placement Tracking System

A centralized platform to manage student records, job postings, and recruitment workflows. This system automates the tracking of student eligibility, application statuses, and interview schedules.

## 1. System Architecture
The application follows a classic client-server architecture:
* **Frontend:** A responsive user interface built with **React** and **TypeScript**, leveraging **Next.js** for optimized routing.
* **Backend:** A robust API layer powered by **FastAPI/Flask**, handling business logic and secure authentication.
* **Database:** A relational schema in **PostgreSQL** to ensure data integrity for student and job records.


## 2. Key Features
* **Student Dashboard:** Allows students to update profiles, upload resumes, and view eligible job listings.
* **Admin Panel:** Enables administrators to manage student data, verify documents, and track overall placement statistics.
* **Job Management:** CRUD operations for job postings, including eligibility criteria (CGPA, backlogs, etc.).
* **Authentication:** Secure login using **JWT (JSON Web Tokens)** with role-based access control (Admin vs. Student).
* **Real-time Tracking:** Status updates for each application stage (Applied, Shortlisted, Interviewed, Placed).

## 3. Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend** | Python (FastAPI/Flask), SQLAlchemy |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Render/Vercel |

## 4. Database Schema
The system relies on a relational model to link students to their respective applications and companies.


**Core Entities:**
* **Users:** Stores credentials and roles.
* **Students:** Detailed academic profiles.
* **Jobs:** Details about company requirements and roles.
* **Applications:** The junction table linking students to jobs with specific statuses.

## 5. Getting Started

### Prerequisites
* Node.js (v18+)
* Python 3.10+
* PostgreSQL

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ManideepK007/placement-tracking-system.git
    cd placement-tracking-system
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    node init-db.js
    npx nodemon server.js
    ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 6. API Endpoints (Sample)
* `POST /auth/login` - User authentication.
* `GET /students/me` - Retrieve current student profile.
* `POST /jobs/create` - (Admin) Post a new job opening.
* `GET /applications/status` - Track application progress.

---
