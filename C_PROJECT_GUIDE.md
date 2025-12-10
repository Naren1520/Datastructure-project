# NexStock - C Project Guide

## 🎯 Project Architecture

This is a **Hybrid C + Node.js + Web Project**:
- **Backend Logic**: Pure C (inventory.c)
- **API Server**: Node.js (server.js)
- **Frontend**: HTML/CSS/JavaScript
- **Data Storage**: JSON (inventory.json)

---

## 📋 How to Use This C Project

### Method 1: Interactive C Program (CLI)
```bash
cd backend
.\inventory.exe
```
This opens an interactive menu where you can:
- Add products
- View products
- Search products
- Sort products (by ID, Name, Price)
- Update products
- Delete products
- Record rentals
- View rentals
- Mark rentals as returned

---

### Method 2: Web Interface (Recommended)
```bash
npm start
```
Then open `http://localhost:8080` in your browser.

**Features available via web:**
- Dashboard with charts
- Product management
- Rental management
- Analytics
- Search functionality
- Real-time sorting

All operations use the **C backend** for data processing!

---

### Method 3: Recompile the C Program
If you modify `inventory.c`:
```bash
cd backend
gcc -o inventory inventory.c
.\inventory.exe
```

---

## 📁 Project Structure

```
DatastructureProject/
├── backend/
│   ├── inventory.c          ← Pure C source code
│   ├── inventory.exe        ← Compiled executable
│   ├── inventory.json       ← Data storage
│   ├── inventory.txt        ← Backup
│   └── c-backend.js         ← Node.js wrapper for C logic
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── products.html
│   ├── add-product.html
│   ├── search.html
│   ├── analytics.html
│   ├── rentals.html
│   ├── style.css
│   └── script.js
├── server.js                ← Node.js server (C backend only)
├── package.json
└── C_PROJECT_GUIDE.md       ← This file
```

---

## 🔗 API Endpoints (C Backend)

All endpoints use the C backend logic:

```
GET    /api/c/products              - Get all products
POST   /api/c/product/add           - Add new product
DELETE /api/c/product/delete        - Delete product
PUT    /api/c/product/update        - Update product
POST   /api/c/product/sell          - Sell product
GET    /api/c/product/search/:id    - Search product
GET    /api/c/product/sort/id       - Sort by ID
GET    /api/c/product/sort/name     - Sort by name
GET    /api/c/product/sort/price    - Sort by price
POST   /api/c/rental/record         - Record rental
GET    /api/c/rentals               - Get all rentals
PUT    /api/c/rental/return         - Mark rental as returned
```

---

## 💾 Data Management

- **Data Storage**: `backend/inventory.json`
- **Format**: JSON with products and rentals arrays
- **C Program**: Reads/writes directly to inventory.json
- **Web Interface**: Uses c-backend.js which uses C logic

---

## 🚀 Quick Start

### For C Development:
```bash
cd backend
gcc -Wall -o inventory inventory.c
.\inventory.exe
```

### For Web Interface:
```bash
npm install
npm start
# Open http://localhost:8080
```

---

## 📊 C Program Features

The C program (`inventory.c`) includes:
- ✅ Product Management (CRUD operations)
- ✅ Sorting Algorithms (Bubble sort by ID, Name, Price)
- ✅ Search Functionality
- ✅ Rental Management
- ✅ File I/O (reads/writes to JSON)
- ✅ Data Validation

---

## 🔧 Customization

### Modify Product Limit:
Edit `inventory.c` line 5:
```c
#define MAX 100  // Change this value
```

### Modify Data Fields:
Edit the `struct Product` and `struct Rental` in `inventory.c`

---

## ✅ Current Status

✅ **C backend fully integrated**
✅ **Web interface working with C backend**
✅ **Data persistence via inventory.json**
✅ **All CRUD operations functional**

---

## 📝 Notes

- The C program is **optional** - you can use the web interface exclusively
- The web interface provides a **GUI** to the C backend
- All data is **shared** between C program and web interface
- Changes made in C program appear in web interface and vice versa

---

**Developed by**: Naren S J
**Project**: NexStock (Inventory Management System)
**Date**: December 2025
