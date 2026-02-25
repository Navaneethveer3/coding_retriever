# 🎓 Coding Retriever: Complete Project Deck
> **Real-time Student Performance Monitoring & Analytics System**

---

## 📌 1. Project Overview
**Coding Retriever** is a professional-grade monitoring solution designed to bridge the gap between student coding activity and academic oversight. It automates the tedious process of visiting individual student profiles on LeetCode and HackerRank by providing a centralized, high-performance dashboard.

### 🚩 The Problem
- **Manual Overhead**: Faculty spend hours checking student profiles.
- **Data Inconsistency**: Information is often outdated or manually entered by students (not verified).
- **Fragmentation**: Progress is split across multiple platforms (LeetCode, HackerRank).

### 💡 The Solution
A unified, containerized web application that scrapes live data directly from official platform APIs/GraphQL and presents it in a premium, actionable format.

---

## 🛠️ 2. Comprehensive Tech Stack
### Frontend (The Visual Experience)
- **Framework**: React 18 with Vite for blazing-fast development and optimized builds.
- **Routing**: React Router 6 for seamless Single Page Application (SPA) navigation.
- **Context API**: Centralized state management for Authentication and Global Configuration.
- **Design System**: Atomic CSS principles with glassmorphism effects and custom animations.

### Backend (The Logic Engine)
- **Architecture**: FastAPI (Python 3.13) for high-concurrency scraping and API serving.
- **Scraping Engine**: Custom-built Python scrapers using `requests`, `BeautifulSoup4`, and GraphQL queries.
- **Security**: JWT (JSON Web Tokens) with `python-jose` and `bcrypt` password hashing.
- **File Processing**: `openpyxl` for high-speed Excel ingestion and generation.

### Infrastructure (The Deployment)
- **Containerization**: Multi-stage Docker build for a "zero-dependency" production image.
- **Database**: Dual-support for SQLite (Internal/Testing) and PostgreSQL (Production/Permanent).
- **Cloud Ready**: Pre-configured for Render.com Blueprints.

---

## ✨ 3. Signature Features
1.  **🔍 Smart Scraper**: Handles LeetCode GraphQL and HackerRank REST APIs with automatic rate-limiting compliance.
2.  **📊 Multi-Year Management**: Separate environments for 1st, 2nd, 3rd, and 4th-year students.
3.  **🎯 Skill Badges**: Tracks specific language proficiencies (Java, Python, C, SQL) via HackerRank stars.
4.  **📉 Dynamic Reporting**: Export clean academic reports with customized performance filters.
5.  **👮 Admin Fortress**: Restricted dashboard for user management, account creation, and password resets.
6.  **💎 Premium UI**: Featuring a global watermark, smooth transitions, and responsive mobile-first design.

---

## 🌀 4. Operational Workflow (End-to-End)

### Phase 1: Ingestion
- Administrators upload an Excel sheet containing student names, roll numbers, and profile URLs.
- The system validates formatting and sanitizes URLs automatically.

### Phase 2: Retrieval
- **Automatic Scrape**: The system performs a "Mass Fetch" where it concurrently retrieves data for up to hundreds of students.
- **Targeted Updates**: Individual students can be updated manually with a single click.

### Phase 3: Analytics
- Dashboard provides real-time sorting (e.g., "Show me top 10 Python coders").
- Search logic allows instant lookup by Roll Number or Name.

### Phase 4: Output
- Results are downloaded as formatted Excel files used for official record-keeping or placement preparation.

---

## 🚢 5. Deployment & Scalability Guide
The project is built for **Render.com** but can be deployed to AWS, DigitalOcean, or Heroku.

### The Unified Docker Strategy
We use a **Multi-Stage Dockerfile**:
- **Stage 1 (Build)**: Compiles React frontend into static assets.
- **Stage 2 (Final)**: Sets up the Python environment, copies the frontend build, and serves everything as one single unit.

### Deployment Workflow (No-Error Path)
1.  Connect GitHub repo to Render.
2.  Create Web Service (Environment: Docker).
3.  Set `PORT` to `10000`.
4.  Optional: Connect **Neon PostgreSQL**.

---

## 🔮 6. Future Enhancements
- **AI-Driven Insights**: Predicting placement readiness based on coding consistency.
- **Codeforces/GFG Integration**: Adding more platforms for a 360-degree view.
- **Automated Alerts**: Emailing students who fall below a certain coding threshold.
- **Graph Visualization**: Bar charts and heatmaps for year-over-year performance trends.

---

## 👨‍💻 7. Developer Information
- **Developed by**: Navaneeth veer
- **Build Version**: 1.0.0 (Stable)
- **Design Credits**: Coding Retriever Design System 2024

---
*© 2024 Coding Retriever. All Rights Reserved.*
