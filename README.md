# my-portfolio

> 個人作品集網站，採前後端分離架構 + MVC 設計模式。
> 前端與後端 API 統一部署至 **Vercel**，資料庫使用 **Neon**（PostgreSQL）。

---

## 技術棧

| 層次 | 技術 |
|------|------|
| 前端 | HTML / CSS / Vanilla JS（MVC-like） |
| 後端 | Node.js + Express |
| 資料庫 | PostgreSQL |
| 部署 | 前端 + 後端 → Vercel，資料庫 → Neon (PostgreSQL) |

---

## 專案結構

```
my-portfolio/
│
├── frontend/                        ← 靜態前端（部署至 GitHub Pages）
│   ├── index.html                   ← 引入 api.js → ui.js → main.js
│   ├── blog.html                    ← 引入 api.js → ui.js → blog.js
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js      ← [M] Model      — 所有 fetch 請求集中於此
│       ├── ui.js       ← [V] View       — 所有 DOM 操作集中於此
│       ├── main.js     ← [C] Controller — index.html 頁面邏輯
│       └── blog.js     ← [C] Controller — blog.html 頁面邏輯
│
└── backend/                         ← Node.js API（部署至 Railway）
    ├── server.js                    ← Express 入口，掛載路由
    ├── package.json
    ├── .env                         ← ⚠️ 不可上傳 GitHub
    ├── db/
    │   └── index.js                 ← PostgreSQL 連線池
    ├── models/          ← [M] Model     — 只寫 SQL，不碰 req/res
    │   ├── Project.js
    │   └── Article.js
    ├── controllers/     ← [C] Controller — 只寫業務邏輯，不寫 SQL
    │   ├── projectController.js
    │   └── articleController.js
    └── routes/          ← [R] Router    — 只做路徑對應，不寫任何邏輯
        ├── projects.js
        └── articles.js
```

---

## MVC 各層職責

### 後端

| 層次 | 檔案 | 負責 | 不負責 |
|------|------|------|--------|
| **Model** | `models/*.js` | SQL 查詢、資料庫操作 | req、res、路由 |
| **Controller** | `controllers/*.js` | 接收請求、呼叫 Model、回傳 JSON、錯誤處理 | SQL 語句 |
| **Router** | `routes/*.js` | URL 路徑 → Controller 對應 | 任何邏輯 |

### 前端

| 層次 | 檔案 | 負責 | 不負責 |
|------|------|------|--------|
| **Model** | `api.js` | fetch 請求、API_URL 管理 | DOM、頁面邏輯 |
| **View** | `ui.js` | DOM 操作、renderXxx 函式 | 資料取得 |
| **Controller** | `main.js` / `blog.js` | 協調 api + ui、事件監聽 | SQL、fetch 細節 |

---

## 資料流程

```
瀏覽器載入 index.html
    │
    ▼
main.js: loadProjects()          ← Controller
    │
    ▼
api.js: api.getProjects()        ← Model（fetch GET /api/projects）
    │
    ▼（HTTP Request）
routes/projects.js               ← Router
    │
    ▼
controllers/projectController.js ← Controller（接收 req，呼叫 Model）
    │
    ▼
models/Project.js                ← Model（執行 SQL SELECT）
    │
    ▼
PostgreSQL DB
    │
    ▲（資料返回）
    │
controllers → res.json(projects)
    │
    ▼
api.js 解析 JSON → main.js 拿到資料 → ui.js 渲染 DOM
```

---

## 環境設定

### 1. 安裝 Node.js
前往 https://nodejs.org 下載 LTS 版本安裝，完成後確認：
```bash
node -v
npm -v
```

### 2. 設定 .env
編輯 `backend/.env`：
```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
PORT=3000
```
> ⚠️ 確認 `.gitignore` 包含 `.env`，**不可上傳至 GitHub**

### 3. 安裝依賴並啟動後端
```bash
cd backend
npm install
npm run dev      # 開發模式（自動重啟）
```

成功後開啟 http://localhost:3000/api/projects，應回傳 `[]`。

---

## 資料庫建表 SQL

### 執行位置

| 環境 | 操作方式 |
|------|----------|
| **Railway（推薦）** | Railway → PostgreSQL service → **Query** 分頁 → 貼入 SQL 執行 |
| **本機 PostgreSQL** | pgAdmin 或 SQL Shell，連進 `portfolio` 資料庫後執行 |

### 建立 projects 表

```sql
CREATE TABLE projects (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    image_url   TEXT,
    demo_url    TEXT,
    github_url  TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | SERIAL | 主鍵，自動遞增，**不用填** |
| `title` | TEXT | 作品名稱 |
| `description` | TEXT | 作品簡介 |
| `image_url` | TEXT | 封面圖網址 |
| `demo_url` | TEXT | 線上展示連結 |
| `github_url` | TEXT | GitHub repo 連結 |
| `created_at` | TIMESTAMP | 建立時間，自動填入，**不用填** |

### 建立 articles 表

```sql
CREATE TABLE articles (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT,
    cover_image TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | SERIAL | 主鍵，自動遞增，**不用填** |
| `title` | TEXT | 文章標題 |
| `content` | TEXT | 文章內文（純文字或 Markdown） |
| `cover_image` | TEXT | 封面圖網址 |
| `created_at` | TIMESTAMP | 建立時間，自動填入，**不用填** |

### 新增測試資料

```sql
INSERT INTO projects (title, description, image_url, demo_url, github_url) VALUES
(
    '個人作品集網站',
    '用 HTML / CSS / JS + Node.js 打造的極簡風格作品集，支援後端動態載入。',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?fit=crop&w=800&q=75',
    'https://你的帳號.github.io/my-portfolio/',
    'https://github.com/你的帳號/my-portfolio'
),
(
    'Blog 技術部落格',
    '記錄開發筆記與工具分享，以極簡排版設計呈現文章列表。',
    'https://images.unsplash.com/photo-1677756119517-756a188d2d94?fit=crop&w=800&q=75',
    'https://你的帳號.github.io/my-portfolio/blog.html',
    'https://github.com/你的帳號/my-portfolio'
);

INSERT INTO articles (title, content, cover_image) VALUES
(
    '用 MVC 架構重構個人作品集',
    '這篇文章介紹如何將原本混亂的 routes 重構為清晰的 Model / Controller / Router 分層架構，讓未來擴充更容易維護...',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?fit=crop&w=800&q=75'
),
(
    '為什麼選 fetch 而不是 axios',
    '本文比較 fetch 與 axios 的差異，說明對個人作品集規模的專案來說，搭配自製 apiFetch 包裝函式的原生 fetch 已足夠使用...',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?fit=crop&w=800&q=75'
);
```

確認寫入成功：
```sql
SELECT * FROM projects;
SELECT * FROM articles;
```

---

## API Endpoint 總覽

### Projects

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/projects` | 取得所有作品 |
| GET | `/api/projects/:id` | 取得單一作品 |
| POST | `/api/projects` | 新增作品 |
| PUT | `/api/projects/:id` | 更新作品 |
| DELETE | `/api/projects/:id` | 刪除作品 |

### Articles

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/articles` | 取得所有文章 |
| GET | `/api/articles/:id` | 取得單篇文章 |
| POST | `/api/articles` | 新增文章 |
| PUT | `/api/articles/:id` | 更新文章 |
| DELETE | `/api/articles/:id` | 刪除文章 |

---

## 部署流程

### 1. 設定 Neon 資料庫

1. 前往 [neon.tech](https://neon.tech) 註冊並建立新專案
2. 複製 **Connection string**（格式：`postgresql://user:pass@host/dbname?sslmode=require`）
3. 在 Neon SQL Editor 執行本文件的建表 SQL 與測試資料

### 2. 部署至 Vercel

1. 將程式碼推上 GitHub（確認 `.env` 已忽略）
2. 前往 [vercel.com](https://vercel.com) → New Project → Import GitHub repo
3. **不需要**更改任何 Framework Preset（保持 Other）
4. 展開 **Environment Variables**，新增：
   ```
   DATABASE_URL = postgresql://user:pass@host/dbname?sslmode=require
   ```
5. 點擊 Deploy

### 3. 完成

部署完成後網址為 `https://你的專案名稱.vercel.app`，前後端共用同一網域，無需額外設定 API_URL。

> ⚠️ 本機開發時 `api.js` 會自動偵測 `localhost` 並使用 `http://localhost:3000`，無需手動切換。

---

## 新增頁面 SOP

1. 後端加 `models/新資源.js`（SQL 邏輯）
2. 後端加 `controllers/新資源Controller.js`（req/res 邏輯）
3. 後端加 `routes/新資源.js`（路由對應）
4. `server.js` 掛載：`app.use('/api/新資源', require('./routes/新資源'))`
5. 前端 `api.js` 新增對應的 fetch 方法
6. 前端 `ui.js` 新增對應的 render 函式
7. 新建 `js/新頁面.js` 作為該頁 Controller
8. 新頁面 HTML 引入順序：`api.js` → `ui.js` → `新頁面.js`
