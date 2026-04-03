# ✦ Taskflow — Firebase ToDo App

A clean, full-stack ToDo application built with **React** and **Firebase**.
Features user authentication, real-time task management, and a calendar interface.

---

## 📁 Project Structure

```
todo-app/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── context/
│   │   └── AuthContext.js      # Global auth state (React Context)
│   ├── components/
│   │   ├── Auth.js             # Login & Signup forms
│   │   ├── Dashboard.js        # Main app layout after login
│   │   ├── CalendarView.js     # Date picker calendar
│   │   ├── TaskInput.js        # Add new task input bar
│   │   ├── TaskList.js         # Fetches & displays tasks (real-time)
│   │   └── TaskItem.js         # Single task row (toggle / delete)
│   ├── App.js                  # Root: routes between Auth and Dashboard
│   ├── App.css                 # All styles
│   ├── firebase.js             # Firebase config & exports
│   └── index.js                # ReactDOM render + AuthProvider
├── package.json
└── README.md
```

---

## 🔥 Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → give it a name → click through and **Create**
3. In the left sidebar, click **Build → Authentication**
   - Click **Get Started**
   - Under **Sign-in method**, enable **Email/Password** → Save
4. In the left sidebar, click **Build → Firestore Database**
   - Click **Create database**
   - Choose **Start in test mode** (allows read/write for 30 days while developing)
   - Select a region → Done

---

## 🔑 Step 2 — Get Your Firebase Config

1. In Firebase Console, click the **gear icon ⚙️** → **Project settings**
2. Scroll to **"Your apps"** section
3. Click **"</> Web"** to register a web app
4. Give it a nickname → click **Register app**
5. You'll see a `firebaseConfig` object — **copy it**

---

## ⚙️ Step 3 — Add Config to the App

Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",               // ← your actual key
  authDomain: "my-app.firebaseapp.com",
  projectId: "my-app",
  storageBucket: "my-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🗃️ Step 4 — Create a Firestore Index

When your app runs for the first time and you add tasks, Firebase may show an
**index error** in the browser console. Just click the link in the error — it
opens Firebase Console and creates the required composite index automatically.

The index needed is on the `tasks` collection:
- `userId` (Ascending)
- `date` (Ascending)
- `createdAt` (Ascending)

---

## 🚀 Step 5 — Install & Run Locally

```bash
# 1. Navigate into the project folder
cd todo-app

# 2. Install all dependencies
npm install

# 3. Start the development server
npm start
```

Your browser will open at **http://localhost:3000** automatically.

---

## ✅ Features Explained

| Feature | How it works |
|---|---|
| **Sign Up / Login** | Firebase Auth with email + password |
| **Stay logged in** | `onAuthStateChanged` in `AuthContext.js` persists session |
| **Add task** | `addDoc` writes to Firestore `tasks` collection |
| **Complete task** | `updateDoc` toggles `completed` field |
| **Delete task** | `deleteDoc` removes the document |
| **Real-time updates** | `onSnapshot` listener refreshes UI instantly |
| **Calendar** | `react-calendar` lets user pick a date |
| **Date filtering** | Tasks are queried by `date` field matching selected date |
| **Multi-user** | Every task stores `userId`; queries filter by current user |
| **Task count** | Derived from the fetched tasks array in state |
| **Calendar dots** | Dates that have tasks get a small dot marker |

---

## 🔒 Firestore Security Rules (for production)

When you're ready to go live, replace the test mode rules in Firebase Console
(**Firestore → Rules**) with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // Only the owner can read, write, update, or delete their tasks
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 🛠 Tech Stack

- **React 18** — UI with functional components & hooks
- **Firebase Auth** — Email/password authentication
- **Cloud Firestore** — Real-time NoSQL database
- **react-calendar** — Calendar date picker
- **CSS Custom Properties** — Theming and consistent design

---

## 💡 Quick Tips

- **Each user only sees their own tasks** — enforced by the `userId` field on every task and the Firestore query filter.
- **Tasks update instantly** — no page refresh needed. Firestore's `onSnapshot` pushes changes to the UI in real time.
- **Dates are stored as strings** (`"YYYY-MM-DD"`) for easy equality querying in Firestore.
