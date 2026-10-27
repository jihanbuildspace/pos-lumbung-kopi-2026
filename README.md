<div align="center">

# ☕ Lumbung Kopi dan Roti
### Enterprise Multi-Branch Point of Sale (POS) & Operational ERP Platform

> Designed specifically for the **Lumbung Kopi dan Roti** specialty bakery & artisan coffee chain across 3 active branches: **Tebet (`TBT`)**, **Bintaro (`BTR`)**, and **Depok (`DPK`)**.

<br />

[![Live Netlify Demo](https://img.shields.io/badge/Live_Demo-pos--lumbung--kopi.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://pos-lumbung-kopi.netlify.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jihanbuildspace/pos-lumbung-kopi-2026)
[![Test Plan Status](https://img.shields.io/badge/Test_Plan-16%2F16_PASSED-2ea44f?style=for-the-badge&logo=checkmarx&logoColor=white)](./docs/test-plan.md)

<br />

<!-- Dynamic Tech Stack Icon Ribbon -->
<p align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,supabase,postgres,netlify,postman" alt="Tech Stack Icons" />
</p>

<!-- Technology Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL_15-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75C2?style=flat-square&logo=google-gemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Netlify_Edge-00C7B7?style=flat-square&logo=netlify&logoColor=white" alt="Netlify" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License MIT" />
</p>

</div>

---

## 📌 Executive Summary & Problem Statement

Prior to this centralized system, *Lumbung Kopi dan Roti* operated with disconnected offline cash registers and physical ledger books across branches, causing critical operational vulnerabilities:
1. **Inventory Race Conditions & Negative Stock:** Two cashiers servicing customers simultaneously would sell the last remaining pastry, driving inventory below zero.
2. **Receipt Duplication & Missing Invoices:** Hand-written or unsynchronized counters caused duplicate numbers and audit discrepancies.
3. **Unreconciled Cash Drawers:** End-of-day register discrepancies occurred without audit trails identifying the responsible cashier on duty.
4. **Unauthorized Transaction Voids:** Cashiers performed cancellations independently without supervisory sign-off.
5. **Compromised Financial Confidentiality:** The business owner could not monitor daily branch profit because Cost of Goods Sold (COGS / HPP) had to be shielded from operational store staff.

This platform unifies all store operations under a secure, cloud-native web architecture adhering strictly to **12 core business rules (BR-01 through BR-12)** and modern retail best practices.

---

## 🚀 Core Business Rules Compliance (BR-01 to BR-12)

| Code | Business Rule | Status | Engineering Implementation & Security Enforcement |
| :---: | :--- | :---: | :--- |
| **BR-01** | **Multi-Branch Isolation & RBAC** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Row Level Security (RLS) and client routing isolate branch datasets (Tebet, Bintaro, Depok). Deactivated accounts (`aktif: false`) are rejected at the authentication gateway. |
| **BR-02** | **Mandatory Cashier Shift & Starting Cash** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | POS checkout is strictly locked unless the cashier has an active shift with starting cash between **Rp 0 and Rp 2,000,000**. Maximum 1 active open shift per cashier. |
| **BR-03** | **Atomic Inventory Protection (Anti-Minus)** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Stock deductions execute as atomic transactions. If a single item in the cart lacks inventory, the entire order is rolled back. Handcrafted beverages are untracked. |
| **BR-04** | **Unbroken Sequential Receipt Numbering** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Database sequence generator produces unique identifiers formatted as `BRANCH-YYYYMMDD-NNNN` (e.g., `TBT-20261025-0001`) with zero gaps or collisions across concurrent registers. |
| **BR-05** | **Price Snapshot Immutability** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Product selling prices are snapshot at the exact checkout timestamp. Future catalog price updates do not alter historical records. |
| **BR-06** | **Cart Discount Capping & Validation** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Maximum discount is capped at **10% of subtotal** and strictly requires a documented justification reason before checkout can proceed. |
| **BR-07** | **Dual Payment Settlement** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | **Cash:** Enforces received payment $\ge$ total bill with automatic change calculation. **QRIS:** Locks exact payable amount with real-time barcode generation. |
| **BR-08** | **Strict Supervisory Void Authorization** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Cashiers are prohibited from voiding transactions. Voids require **Store Manager** or **Owner** approval, apply only to today's settled transactions under an open shift, require $\ge 10$ character reasons, and automatically restore inventory. |
| **BR-09** | **Cash Drawer Reconciliation** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | System computes `Expected Cash = Starting Cash + Total Settled Cash Sales`. Cashiers submit physical drawer counts. Any variance exceeding **Rp 20,000** mandates an explanatory note. |
| **BR-10** | **Unidirectional Shift Lifecycle** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | Shifts transition strictly: `buka (open)` $\rightarrow$ `ditutup (closed)` $\rightarrow$ `diverifikasi (verified)`. Reversals are barred by database constraints. |
| **BR-11** | **Financial & Margin Confidentiality** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | COGS / HPP and gross margins are strictly restricted to the **Owner**. Data is filtered at the database level and never transmitted to Cashier or Store Manager browsers. |
| **BR-12** | **Immutable Audit Log** | ![Passed](https://img.shields.io/badge/Passed-2ea44f?style=flat-square) | All security-sensitive actions (*voids, shift verifications, inventory adjustments, price edits, user status changes*) are recorded with actor, timestamp, and before/after payloads. |

---

## 🌟 High-Value Excellence Features (Capstone Scope)

### 1. 🖥️ Real-Time Customer Facing Display ([CustomerDisplayView.tsx](file:///d:/04_POS%20JIHAN%20KUSUMAWARDHANI%20%282026%29/src/components/pos/CustomerDisplayView.tsx))
![BroadcastChannel API](https://img.shields.io/badge/Protocol-BroadcastChannel_API_(0ms_Latency)-orange?style=flat-square&logo=googlechrome&logoColor=white)
![UI Theme](https://img.shields.io/badge/Aesthetic-Warm_Artisan_Cafe-amber?style=flat-square)
- **Zero-Latency Dual Monitor Synchronization:** Synchronized in real-time ($< 1\text{ ms}$) via browser `BroadcastChannel API`.
- **Artisan Cafe Digital Signage:** Warm artisan bakery aesthetic featuring dynamic time-of-day greetings, interactive signature menu board, store schedule, and guest Wi-Fi card.
- **National Standard QRIS Screen:** Large dynamic QR code with merchant tags, automatic payable locking, and animated payment success confirmation screen.
- **CSAT Feedback:** Integrated post-transaction customer satisfaction star rating.

### 2. 🤖 Lumbung AI Consultant (Google Gemini 1.5 Flash Engine)
![Google Gemini](https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash-8E75C2?style=flat-square&logo=google-gemini&logoColor=white)
![Analytics](https://img.shields.io/badge/Scope-Executive_BI-blue?style=flat-square)
- Integrated into the executive reporting dashboard for real-time strategic business intelligence.
- Analyzes revenue velocity, diagnoses cashier cash drawer discrepancies, recommends promotional bundling strategies, and forecasts margin optimization opportunities.

### 3. 📈 Smart Stock Forecasting & Depletion Alerting
![Forecasting](https://img.shields.io/badge/Predictive_Model-Moving_Avg_+_Weekend_Surge-38B2AC?style=flat-square&logo=chartdotjs&logoColor=white)
- Calculates stock runout probability per SKU based on 14-day moving average sales volume.
- Automatically factors in **weekend demand surges (+35%)** to formulate intelligent restocking quantity recommendations.

### 4. 📑 Multi-Sheet Structured Excel Export (`.xlsx`)
![SheetJS](https://img.shields.io/badge/Export-Multi--Sheet_Excel_(.xlsx)-217346?style=flat-square&logo=microsoftexcel&logoColor=white)
- One-click comprehensive financial export via SheetJS, organizing three synchronized worksheets:
  1. *Executive Branch Performance Summary*
  2. *Cashier Shift Reconciliation & Variances*
  3. *Granular Itemized Transaction Journal*

### 5. 💳 Mayar.id Dynamic QRIS Payment Gateway
![Payment Gateway](https://img.shields.io/badge/Payment_Gateway-Mayar.id_QRIS_V2-6366F1?style=flat-square&logo=contactlesspayment&logoColor=white)
- Production and sandbox integration generating dynamic Mayar QRIS invoices per transaction with automatic sandbox fallback.

---

## 🔐 Verified Demo Credentials

All test accounts share the same system demonstration password:  
👉 **`Latihan#2026`** *(or alternatively `password123`)*

> 💡 **Pro-Tip (1-Click Instant Login):**  
> On the login page, simply click any of the **Quick Persona Cards** (*KASIR TEBET*, *KEPALA TOKO*, or *OWNER PUSAT*) to log in instantly without typing credentials!

| Role Badge | Staff Name | Login Email | Branch & Access Scope |
| :---: | :--- | :--- | :--- |
| ![Owner](https://img.shields.io/badge/Role-Owner-b45309?style=flat-square) | Ratna Kusumawardani <br>*(alt: Hendra Wijaya)* | `ratna.owner@lumbung.test` <br>*(alt: `hendra.owner@lumbung.test`)* | **All Branches** — Full access to COGS/HPP, Profit Margins, Staff & Catalog Management, Audit Logs, and AI Consultant. |
| ![Store Manager](https://img.shields.io/badge/Role-Store_Manager-4338ca?style=flat-square) | Bayu Prasetyo | `bayu.kt.tebet@lumbung.test` | **Tebet (`TBT`)** — Void Approval, Shift Verification, Stock Adjustments, Sales Reports (COGS hidden). |
| ![Store Manager](https://img.shields.io/badge/Role-Store_Manager-4338ca?style=flat-square) | Sekar Ayuningtyas <br>*(alt: Ratna Sari)* | `sekar.kt.bintaro@lumbung.test` <br>*(alt: `ratna.kt.btr@lumbung.test`)* | **Bintaro (`BTR`)** — Store Manager access for Bintaro branch. |
| ![Store Manager](https://img.shields.io/badge/Role-Store_Manager-4338ca?style=flat-square) | Hendra Saputra <br>*(alt: Agus Setiawan)* | `hendra.kt.depok@lumbung.test` <br>*(alt: `agus.kt.dpk@lumbung.test`)* | **Depok (`DPK`)** — Store Manager access for Depok branch. |
| ![Cashier](https://img.shields.io/badge/Role-Cashier-15803d?style=flat-square) | Dimas Arya | `dimas.kasir.tebet@lumbung.test` | **Tebet (`TBT`)** — Open/Close Shift, POS Checkout, Receipt Printing. |
| ![Cashier](https://img.shields.io/badge/Role-Cashier-15803d?style=flat-square) | Putri Maharani <br>*(alt: Siti Rahma)* | `putri.kasir.tebet@lumbung.test` <br>*(alt: `siti.kasir.tebet@lumbung.test`)* | **Tebet (`TBT`)** — Additional Cashier terminal. |
| ![Cashier](https://img.shields.io/badge/Role-Cashier-15803d?style=flat-square) | Fajar Nugroho <br>*(alt: Rian Hidayat)* | `fajar.kasir.bintaro@lumbung.test` <br>*(alt: `rian.kasir.btr@lumbung.test`)* | **Bintaro (`BTR`)** — Cashier terminal for Bintaro. |
| ![Cashier](https://img.shields.io/badge/Role-Cashier-15803d?style=flat-square) | Wulan Sari | `wulan.kasir.depok@lumbung.test` | **Depok (`DPK`)** — Cashier terminal for Depok. |
| ![Deactivated](https://img.shields.io/badge/Role-Deactivated-991b1b?style=flat-square) | Rizky Ramadhan <br>*(alt: Dina Kasir)* | `rizky.kasir.depok@lumbung.test` <br>*(alt: `dina.kasir.btr@lumbung.test`)* | **Rejected (BR-01 / TC-02):** System displays *"Akun ini berstatus NON-AKTIF"*. |

---

## 🛠️ Technology Stack & Architecture

| Category | Technology | Official Badge | Role in System Architecture |
| :--- | :--- | :---: | :--- |
| **Frontend Core** | React 19 | ![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Concurrent UI rendering, optimized state trees, and responsive views |
| **Language** | TypeScript | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | Strict end-to-end typing, database schemas, and API contracts |
| **Build Tool** | Vite 8 | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Sub-second HMR bundler and tree-shaken production output |
| **Styling** | Tailwind CSS | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Custom artisan warm cafe color palette, glassmorphism, and responsive layouts |
| **Database & Auth** | Supabase | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | Cloud PostgreSQL, Row Level Security (RLS) per branch, and session engine |
| **Relational DB** | PostgreSQL 15 | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) | Atomic inventory locks, daily branch receipt sequences, and immutable audit logs |
| **Artificial Intelligence** | Google Gemini | ![Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white) | 1.5 Flash AI consultant for real-time sales insights and anomaly diagnostics |
| **Hosting & CI/CD** | Netlify | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white) | Continuous Git deployment with `/supabase/*` gateway proxy & `noindex` headers |
| **Data Export** | SheetJS (xlsx) | ![Excel](https://img.shields.io/badge/SheetJS-217346?style=for-the-badge&logo=microsoftexcel&logoColor=white) | Automated multi-sheet workbook generation for financial accounting |
| **Iconography** | Lucide React | ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=feather&logoColor=white) | Modern vector icons across point-of-sale actions and navigation |

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
