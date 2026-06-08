# Smart Expense Tracker

A comprehensive financial management application built with React, Vite, and Capacitor. This app helps users track expenses with advanced features like SMS detection and Firebase synchronization.

## 🚀 Features

- **PWA Support:** Installable on mobile and desktop for a native-like experience.
- **SMS Detection:** Automatically detect expense messages to streamline tracking.
- **Multi-Currency:** Support for various currencies with real-time conversion.
- **Firebase Sync:** Securely sync your data across multiple devices.
- **Offline First:** Built with Dexie.js for robust offline capabilities.
- **Cross-Platform:** Deployable to Android and iOS via Capacitor.
- **Data Visualization:** Insightful charts and reports using Recharts.
- **Export Options:** Generate PDF reports of your expenses.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Lucide React
- **Database:** Dexie (IndexedDB), Firebase
- **Mobile:** Capacitor (Android/iOS)
- **Charts:** Recharts
- **PDF Generation:** jsPDF

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dharshang11/-Smart-Expense-Tracker.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

## 📱 Mobile Setup

To run on Android or iOS:
```bash
npx cap sync
npx cap open android # or ios
```
