# Agro Direct Connect

Connecting farmers directly to consumers.

## Project info

A modern web application for direct agricultural trade.

## How can I edit this code?

### Use your preferred IDE

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Running the Development Environment

The project is split into a **React Frontend** and a **PHP Backend**.

#### Step 1: Install Dependencies
Run this in the root folder to install frontend dependencies:
```sh
npm run frontend:install
```

#### Step 2: Start the Backend (PHP)
From the root folder, run:
```sh
npm run api:serve
```
*Requires PHP installed on your system. This starts the API on http://localhost:3000.*

#### Step 3: Start the Frontend (React)
Open a new terminal and run:
```sh
npm run dev
```
*This starts the Vite dev server. You can now access the app in your browser.*

### Edit a file directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### Use GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Core Features

### 🤖 AI Agricultural Intelligence
- **Deep Market Insights**: Powered by **Groq Llama-3.3-70b**, providing real-time pricing analysis and trend predictions.
- **Dedicated AI Assistant**: Direct access to AgroBot for help with logistics, crop management, and trade negotiation.
- **Smart Onboarding**: Context-aware tips for both farmers and buyers to optimize their experience.

### 💬 Rich Communication Protocol
- **Media Messaging**: Seamlessly share images and videos of produce directly in the chat.
- **Voice Notes**: Integrated audio recording for hands-free communication during field operations.
- **Real-time Sync**: Bi-directional polling for instant message delivery and status updates.

### 💳 Financial Ledger
- **Escrow System**: Funds are held securely until delivery is confirmed by the buyer.
- **Real-time Balance**: Farmers can track available liquidity and pending settlements.
- **Automated Payouts**: Direct settlement to bank accounts via the payout terminal.

## Technical Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Vanilla CSS for premium glassmorphism
- **Icons**: Lucide React
- **State Management**: React Context & Hooks

### Backend
- **Engine**: PHP 8.x
- **Database**: SQLite (Data sovereignty and high portability)
- **AI Core**: Groq Cloud API (Llama-3.3-70b-versatile)
- **File System**: Local storage for media assets with static serving

## How to use the project
... (standard steps below) ...

### Edit a file directly in GitHub
...
