![CI](https://github.com/Navaneethveer3/coding_retriever/actions/workflows/ci.yml/badge.svg)



# Coding Retriever

A web application built to help faculty track student coding activity across LeetCode and HackerRank — without manually visiting each profile. Instead of chasing down individual pages, everything lands in one dashboard.

---

## The Problem It Solves

At most engineering colleges, tracking whether students are actually practicing competitive programming comes down to either trust or manual effort. Faculty end up visiting dozens of profiles, copying numbers into spreadsheets, and the data is already stale by the time it's compiled. Coding Retriever automates that entire process.

---

## How It Works

An admin uploads an Excel sheet with student names, roll numbers, and their LeetCode/HackerRank profile URLs. The system scrapes live data directly from those platforms using GraphQL queries and REST APIs, then surfaces it in a sortable, searchable dashboard. Reports can be exported back to Excel for placement records or department reviews.

The scraper handles concurrent fetches for large batches of students and respects platform rate limits automatically.

---

## Tech Stack

**Frontend** — React 18 + Vite, React Router 6, Context API for auth and state, custom CSS with glassmorphism styling.

**Backend** — FastAPI (Python 3.13), custom scrapers built with `requests`, `BeautifulSoup4`, and GraphQL. JWT-based authentication with `python-jose` and `bcrypt`. Excel processing via `openpyxl`.

**Infrastructure** — Multi-stage Docker build that compiles the React frontend and packages it with the Python backend into a single production image. Supports SQLite for local development and PostgreSQL for production. Deployed on Render.com.

---

## Features

- Mass fetch for entire batches — updates hundreds of students in one go
- Per-student manual refresh with a single click
- Multi-year support (1st through 4th year as separate environments)
- HackerRank skill badge tracking — Java, Python, C, SQL star ratings
- Exportable Excel reports with performance filters
- Admin panel for user management, account creation, and password resets
- Mobile-responsive UI

---

## Running Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
