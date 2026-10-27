# ☕ Lumbung Kopi dan Roti — Enterprise Multi-Branch POS & Retail ERP

> **A High-Performance, Multi-Branch Point of Sale (POS) and Operational Management Platform**  
> Tailored for the *Lumbung Kopi dan Roti* artisan bakery & specialty coffee chain across 3 active branches: **Tebet (`TBT`)**, **Bintaro (`BTR`)**, and **Depok (`DPK`)**.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Netlify](https://img.shields.io/badge/Netlify_Deployed-00C7B7?style=flat&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Tests Passing](https://img.shields.io/badge/Test_Plan-16%2F16_PASSED-success?style=flat)](./docs/test-plan.md)

---

## 📌 Executive Summary & Problem Statement

Prior to this centralized system, *Lumbung Kopi dan Roti* operated with disconnected offline cash registers and paper logbooks across branches, causing critical operational vulnerabilities:
1. **Inventory Race Conditions & Negative Stock:** Two cashiers servicing customers simultaneously would sell the last remaining pastry, driving inventory below zero.
2. **Receipt Duplication & Missing Invoices:** Hand-written or unsynchronized counters caused duplicate numbers and audit discrepancies.
3. **Unreconciled Cash Drawers:** End-of-day register discrepancies occurred without audit trails identifying the responsible cashier on duty.
4. **Unauthorized Transaction Voids:** Cashiers performed cancellations independently without supervisory sign-off.
5. **Compromised Financial Confidentiality:** The business owner could not monitor daily branch profit because Cost of Goods Sold (COGS / HPP) had to be shielded from operational store staff.

This platform unifies all store operations under a secure, cloud-native web architecture adhering strictly to **12 core business rules (BR-01 through BR-12)** and modern retail best practices.

---

## 🚀 Core Business Rules Compliance (BR-01 to BR-12)

| Code | Business Rule | Engineering Implementation & Enforcement |
| :--- | :--- | :--- |
| **BR-01** | **Multi-Branch Data Isolation & RBAC** | Row Level Security (RLS) and client routing isolate branch datasets (Tebet, Bintaro, Depok). Deactivated accounts (`aktif: false`) are rejected at the authentication gateway. |
| **BR-02** | **Mandatory Cashier Shift & Starting Cash** | POS checkout is strictly locked unless the cashier has an active shift with starting cash between **Rp 0 and Rp 2,000,000**. Maximum 1 active open shift per cashier. |
| **BR-03** | **Atomic Inventory Protection (Anti-Minus)** | Stock deductions execute as atomic transactions. If a single item in the cart lacks inventory, the entire order is rolled back. Handcrafted beverages are untracked. |
| **BR-04** | **Unbroken Sequential Receipt Numbering** | Database sequence generator produces unique identifiers formatted as `BRANCH-YYYYMMDD-NNNN` (e.g., `TBT-20261025-0001`) with zero gaps or collisions across concurrent registers. |
| **BR-05** | **Price Snapshot Immutability** | Product selling prices are snapshot at the exact checkout timestamp. Future catalog price updates do not alter historical records. |
| **BR-06** | **Cart Discount Capping & Validation** | Maximum discount is capped at **10% of subtotal** and strictly requires a documented justification reason before checkout can proceed. |
| **BR-07** | **Dual Payment Settlement** | **Cash:** Enforces received payment $\ge$ total bill with automatic change calculation. **QRIS:** Locks exact payable amount with real-time barcode generation. |
| **BR-08** | **Strict Supervisory Void Authorization** | Cashiers are prohibited from voiding transactions. Voids require **Store Manager** or **Owner** approval, apply only to today's settled transactions under an open shift, require $\ge 10$ character reasons, and automatically restore inventory. |
| **BR-09** | **Cash Drawer Reconciliation** | System computes `Expected Cash = Starting Cash + Total Settled Cash Sales`. Cashiers submit physical drawer counts. Any variance exceeding **Rp 20,000** mandates an explanatory note. |
| **BR-10** | **Unidirectional Shift Lifecycle** | Shifts transition strictly: `buka (open)` $\rightarrow$ `ditutup (closed)` $\rightarrow$ `diverifikasi (verified)`. Reversals are barred by database constraints. |
| **BR-11** | **Financial & Margin Confidentiality** | COGS / HPP and gross margins are strictly restricted to the **Owner**. Data is filtered at the database level and never transmitted to Cashier or Store Manager browsers. |
| **BR-12** | **Immutable Audit Log** | All security-sensitive actions (*voids, shift verifications, inventory adjustments, price edits, user status changes*) are recorded with actor, timestamp, and before/after payloads. |

---

## 🌟 High-Value Excellence Features (Capstone Scope)

### 1. 🖥️ Real-Time Customer Facing Display ([CustomerDisplayView.tsx](file:///d:/04_POS%20JIHAN%20KUSUMAWARDHANI%20%282026%29/src/components/pos/CustomerDisplayView.tsx))
- **Zero-Latency Dual Monitor Synchronization:** Synchronized in real-time ($< 1\text{ ms}$) via the browser `BroadcastChannel API`.
- **Artisan Cafe Digital Signage:** Warm artisan bakery aesthetic featuring dynamic time-of-day greetings, interactive signature menu board, store schedule, and guest Wi-Fi card.
- **National Standard QRIS Screen:** Large dynamic QR code with merchant tags, automatic payable locking, and animated payment success confirmation screen.
- **CSAT Feedback:** Integrated post-transaction customer satisfaction star rating.

### 2. 🤖 Lumbung AI Consultant (Google Gemini 1.5 Flash Engine)
- Integrated into the executive reporting dashboard for real-time strategic business intelligence.
- Analyzes revenue velocity, diagnoses cashier cash drawer discrepancies, recommends promotional bundling strategies, and forecasts margin optimization opportunities.

### 3. 📈 Smart Stock Forecasting & Depletion Alerting
- Calculates stock runout probability per SKU based on 14-day moving average sales volume.
- Automatically factors in **weekend demand surges (+35%)** to formulate intelligent restocking quantity recommendations.

### 4. 📑 Multi-Sheet Structured Excel Export (`.xlsx`)
- One-click comprehensive financial export via SheetJS, organizing three synchronized worksheets:
  1. *Executive Branch Performance Summary*
  2. *Cashier Shift Reconciliation & Variances*
  3. *Granular Itemized Transaction Journal*

### 5. 💳 Mayar.id Dynamic QRIS Payment Gateway
- Production and sandbox integration generating dynamic Mayar QRIS invoices per transaction with automatic fallback.

---

## 🔐 Verified Demo Credentials

All test accounts share the same system demonstration password:  
👉 **`Latihan#2026`** *(or alternatively `password123`)*

> 💡 **Pro-Tip (1-Click Instant Login):**  
> On the login page, simply click any of the **Quick Persona Cards** (*KASIR TEBET*, *KEPALA TOKO*, or *OWNER PUSAT*) to log in instantly without typing credentials!

| Role | Staff Name | Login Email | Branch & Access Scope |
| :--- | :--- | :--- | :--- |
| **Owner** | Ratna Kusumawardani *(alt: Hendra W.)* | `ratna.owner@lumbung.test` <br>*(alt: `hendra.owner@lumbung.test`)* | **All Branches** — Full access to COGS/HPP, Profit Margins, Staff & Catalog Management, Audit Logs, and AI Consultant. |
| **Store Manager** | Bayu Prasetyo | `bayu.kt.tebet@lumbung.test` | **Tebet (`TBT`)** — Void Approval, Shift Verification, Stock Adjustments, Sales Reports (COGS hidden). |
| **Store Manager** | Sekar Ayuningtyas *(alt: Ratna S.)* | `sekar.kt.bintaro@lumbung.test` <br>*(alt: `ratna.kt.btr@lumbung.test`)* | **Bintaro (`BTR`)** — Store Manager access for Bintaro branch. |
| **Store Manager** | Hendra Saputra *(alt: Agus S.)* | `hendra.kt.depok@lumbung.test` <br>*(alt: `agus.kt.dpk@lumbung.test`)* | **Depok (`DPK`)** — Store Manager access for Depok branch. |
| **Cashier** | Dimas Arya | `dimas.kasir.tebet@lumbung.test` | **Tebet (`TBT`)** — Open/Close Shift, POS Checkout, Receipt Printing. |
| **Cashier** | Putri Maharani *(alt: Siti Rahma)* | `putri.kasir.tebet@lumbung.test` <br>*(alt: `siti.kasir.tebet@lumbung.test`)* | **Tebet (`TBT`)** — Additional Cashier terminal. |
| **Cashier** | Fajar Nugroho *(alt: Rian Hidayat)* | `fajar.kasir.bintaro@lumbung.test` <br>*(alt: `rian.kasir.btr@lumbung.test`)* | **Bintaro (`BTR`)** — Cashier terminal for Bintaro. |
| **Cashier** | Wulan Sari | `wulan.kasir.depok@lumbung.test` | **Depok (`DPK`)** — Cashier terminal for Depok. |
| **Deactivated Account** | Rizky Ramadhan *(alt: Dina Kasir)* | `rizky.kasir.depok@lumbung.test` <br>*(alt: `dina.kasir.btr@lumbung.test`)* | **Rejected (BR-01 / TC-02):** System displays *"Akun ini berstatus NON-AKTIF"*. |

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core:** React 19, TypeScript, Vite 8 (Client SPA)
- **UI & Design System:** Tailwind CSS, Lucide React, Canvas Confetti
- **Typography:** Outfit (Display & Numbers) & Plus Jakarta Sans (Body & Tables)
- **State & Real-Time Sync:** React Context API, BroadcastChannel API (Dual Screen)
- **Backend & Database:** Supabase (PostgreSQL 15, Row Level Security, Triggers & Sequences)
- **AI Analytics:** Google Gemini 1.5 Flash API
- **Deployment & Hosting:** Netlify (Automated CI/CD with `/supabase/*` Gateway Reverse Proxy & `noindex` headers)
- **Reporting Engine:** SheetJS (`xlsx`) for multi-sheet Excel generation

---

## 💻 Local Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/jihanbuildspace/pos-lumbung-kopi-2026.git
cd pos-lumbung-kopi-2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```
Populate your environment credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key # Optional: in-app fallback included
VITE_MAYAR_API_KEY=your-mayar-api-key   # Optional: sandbox simulator included
```
*(Note: Built-in resilient fallbacks are configured so the application functions out-of-the-box).*

### 4. Database Initialization (Supabase SQL Editor)
Execute the provided database migrations sequentially:
1. `01_schema.sql` — Schema definitions, constraints, sequences, and security policies.
2. `02_seed.sql` — Branches, product catalog, demo staff accounts, shifts, and 62 baseline transactions.

### 5. Launch Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Quality Assurance & Test Verification

All **16 Business Rule Test Cases** have been verified and documented in:  
📄 **[`docs/test-plan.md`](./docs/test-plan.md)** (Status: **100% PASSED**)

Key validation highlights:
- ✅ **Atomic Stock Concurrency:** Verified two cashiers concurrently purchasing the last unit; zero negative stock.
- ✅ **Receipt Number Continuity:** Generated concurrent orders with sequential numbering per branch.
- ✅ **Information Barrier:** Verified that non-owner API calls to product COGS or margins return sanitized null values.
- ✅ **Shift Variance Safeguard:** Forced a Rp 35,000 drawer variance; verified note requirement before closure.

---

## 📁 Repository Deliverables

- `src/` — React 19 + TypeScript production source code
- `01_schema.sql` & `02_seed.sql` — Supabase PostgreSQL migrations
- `docs/test-plan.md` — Formal 16-point QA validation report
- `Template_Slide_Showcase.pptx` — 8-slide Capstone presentation deck
- `dist.zip` — Production build archive ready for Netlify manual drop

---

## 📄 License & Attribution
Developed for the **AI Web Programming Bootcamp Capstone Showcase (October 2026)** by **Jihan Kusumawardhani**.
