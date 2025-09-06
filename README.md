# SplitEase - Expense Sharing Application

A full-stack web application for managing shared expenses and splitting bills among friends, family, or roommates. Built with modern web technologies, this application provides an intuitive interface for tracking who owes what to whom.

## 🚀 Project Overview

Splitwise Clone is a comprehensive expense management solution that allows users to:

- Add and track shared expenses
- Split bills among multiple people
- View detailed balance summaries
- Chat with other users
- Manage user profiles and groups
- Track transaction history

## 🛠️ Tech Stack

### Frontend

- **Angular 17** - Modern frontend framework
- **TypeScript** - Type-safe JavaScript
- **PrimeNG** - UI component library
- **Chart.js** - Data visualization
- **Angular Material** - Material Design components
- **SCSS** - Advanced CSS preprocessing

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cookie Parser** - Session management

### Development Tools

- **Angular CLI** - Angular development tools
- **Nodemon** - Server auto-restart
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

## ✨ Features

### 🔐 Authentication & User Management

- User registration and login
- Password reset functionality
- Secure session management
- User profile management

### 💰 Expense Management

- Add new expenses with descriptions
- Split expenses among multiple users
- Track who paid for what
- Calculate individual balances
- View total amounts owed/owed to you

### 👥 User Interactions

- Search and find other users
- View user profiles
- Send private messages
- View transaction history with specific users

### 💬 Real-time Chat

- Private messaging between users
- Chat history persistence
- Real-time message updates
- User-friendly chat interface

### 📊 Dashboard & Analytics

- Visual balance overview
- Chart.js integration for expense trends
- Recent transaction history
- Balance tracking over time

### 🎨 Modern UI/UX

- Responsive design
- Dark theme with consistent styling
- Smooth hover animations
- Professional Material Design components

## 📁 Project Structure

```
Splitwise/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Angular components
│   │   │   ├── services/   # Business logic services
│   │   │   └── models/     # Data models
│   │   ├── assets/         # Static assets
│   │   └── styles/         # Global styles
│   ├── package.json        # Frontend dependencies
│   └── angular.json        # Angular configuration
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middlewares/       # Custom middleware
│   ├── database/          # Database connection
│   └── package.json       # Backend dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/sarojabamra/SplitEase
   cd Splitwise
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**

   Create a `.env` file in the `server` directory:

   ```env
   PORT=8000
   DB_USERNAME=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Database Setup**

   Ensure MongoDB is running locally or update the connection string in `server/index.js` for MongoDB Atlas.

### Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

   The server will run on `http://localhost:8000`

2. **Start the frontend application**

   ```bash
   cd client
   ng serve
   ```

   The application will run on `http://localhost:4200`

3. **Open your browser**
   Navigate to `http://localhost:4200` to use the application

## 🔧 Development

### Available Scripts

**Backend (server/)**

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon

**Frontend (client/)**

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng e2e` - Run end-to-end tests

### API Endpoints

The backend provides RESTful APIs for:

- **Authentication**: `/auth/*`
- **Users**: `/getAllUsers`, `/getUserById`
- **Chats**: `/chat/*`
- **Messages**: `/message/*`
- **Expenses**: `/expense/*`
- **Transactions**: `/transaction/*`

## 🌟 Key Features in Detail

### Expense Tracking

- Create expenses with descriptions and amounts
- Split expenses equally or custom amounts
- Track who paid and who owes
- Real-time balance calculations

### User Management

- User registration and authentication
- Profile management with avatars
- Search and discover other users
- Privacy controls

### Communication

- Real-time chat system
- Message history
- User-to-user conversations
- Notification system

### Analytics

- Balance overview charts
- Expense history tracking
- Individual user balances
- Transaction summaries


## 🙏 Acknowledgments

- Inspired by the original Splitwise application


