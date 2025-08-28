# AllReds Training Management System

A comprehensive training management system with user authentication, role-based access control, and CSV-based data persistence. Built with React.js (frontend) and Node.js/Express (backend).

## 🚀 Quick Start (For Fresh PC Setup)

This guide assumes you're starting with a completely fresh PC without Node.js, npm, React, or any development tools installed.

### Prerequisites

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Internet Connection**: Required for downloading dependencies
- **Minimum RAM**: 4GB (8GB recommended)
- **Free Disk Space**: At least 2GB

### Step 1: Install Node.js and npm

1. **Visit the official Node.js website**: https://nodejs.org/
2. **Download the LTS version** (Long Term Support) - currently v18.x or v20.x
3. **Install Node.js**:
   - **Windows**: Run the downloaded `.msi` file and follow the installer
   - **macOS**: Run the downloaded `.pkg` file and follow the installer
   - **Linux**: Use package manager or download from website
4. **Verify installation** by opening terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers for both commands.

### Step 2: Download the Project

1. **Extract the project files** to a folder on your computer (e.g., `C:\AllReds` or `~/AllReds`)
2. **Open terminal/command prompt** and navigate to the project folder:
   ```bash
   cd path/to/allreds
   ```

### Step 3: Install Dependencies

The project has two parts that need dependencies installed:

#### Install Backend Dependencies
```bash
cd backend
npm install
```

#### Install Frontend Dependencies
```bash
cd ../react-app
npm install
```

> ⏱️ **Note**: The installation process may take 5-10 minutes depending on your internet connection.

### Step 4: Run the Application

#### Option A: Automated Start (Recommended)
```bash
cd react-app/scripts
./start-app.sh    # Linux/macOS
# or
bash start-app.sh # Windows Git Bash
```

#### Option B: Manual Start
Open two terminal windows/tabs:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend Server:**
```bash
cd react-app
npm start
```

### Step 5: Access the Application

1. **Open your web browser**
2. **Navigate to**: http://localhost:3000
3. **Login with demo credentials**:
   - **Trainer Users**:
     - `mario@rossi.com / mariorossi` (Mario Rossi)
   - **Player Users**:
     - `player@one.com / playerone` (Player One)
     - `player@two.com / playertwo` (Player Two)

## 🛠️ Development Commands

### Frontend (React App)
```bash
cd react-app

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Backend (Node.js Server)
```bash
cd backend

# Start server
npm start

# Start with auto-reload (development)
npm run dev
```

## 📁 Project Structure

```
allreds/
├── react-app/                 # React frontend application
│   ├── public/
│   │   └── data/
│   │       ├── users.csv      # User data storage
│   │       └── trainings.csv  # Training sessions data
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   ├── hooks/            # React custom hooks
│   │   ├── services/         # API and data services
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── scripts/
│   │   ├── start-app.sh      # Automated startup script
│   │   └── kill-app.sh       # Application shutdown script
│   └── package.json          # Frontend dependencies
├── backend/                   # Node.js/Express backend
│   ├── server.js             # Main server file
│   └── package.json          # Backend dependencies
└── README.md                 # This file
```

## ✨ Features

### 🔐 Authentication System
- **CSV-based user storage** with encrypted passwords
- **Role-based access control** (Trainer vs Player)
- **Session management** with auto-logout on browser close

### 👥 User Management (Trainer Only)
- **View all users** in organized table format
- **Add new users** with form validation
- **Role assignment** and user categorization
- **Email validation** and duplicate prevention

### 📅 Training Management
- **Schedule training sessions** with date/time picker
- **Player assignment** from existing user database
- **Grouped display** showing all sessions per player
- **CSV persistence** for data consistency
- **Role-based views**: Trainers see all sessions, Players see only their own

### 🧭 Navigation System
- **Breadcrumb navigation** for trainer pages
- **Intuitive page routing** between Homepage, User Management, and Training
- **Clean Material-UI interface** with professional styling

## 🗄️ Data Storage

The application uses CSV files for data persistence:

### Users Data (`users.csv`)
```csv
id,name,password,surname,email,category,role,isTrainer
1,Mario,mariorossi,Rossi,mario@rossi.com,Management,Trainer,true
2,Player,playerone,One,player@one.com,Seniores maschile,Player,false
```

### Training Data (`trainings.csv`)
```csv
id,playerId,playerName,trainingDay,createdBy,createdAt
1,2,Player - One,2025-08-27T18:00:00.000Z,1,2025-08-27T18:00:35.365Z
```

## 🚨 Troubleshooting

### Port Already in Use
If you get port errors, kill existing processes:
```bash
# Kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill processes on port 3001 (backend)  
lsof -ti:3001 | xargs kill -9

# Or use the kill script
cd react-app/scripts
./kill-app.sh
```

### Dependencies Installation Issues
1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```
2. **Delete node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Node.js Version Issues
- **Ensure you're using Node.js v16 or higher**
- **Use Node Version Manager (nvm)** if you need multiple Node.js versions

## 🔧 System Requirements

### Minimum Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **RAM**: 4GB
- **Storage**: 2GB free space

### Recommended Requirements
- **Node.js**: v18.0.0 or higher (LTS)
- **npm**: v9.0.0 or higher
- **RAM**: 8GB or more
- **Storage**: 5GB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🆘 Support

### Common URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### Log Files
- **Backend logs**: `backend/server.log`
- **Browser console**: F12 Developer Tools → Console tab

For technical issues, check the browser console (F12) and backend terminal output for error messages.

## 📋 First-Time Setup Checklist

- [ ] Node.js and npm installed and verified
- [ ] Project files extracted to desired location
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd react-app && npm install`)
- [ ] Both servers started successfully
- [ ] Application accessible at http://localhost:3000
- [ ] Login tested with demo credentials
- [ ] All features working (user management, training scheduling)

---

**🎉 Congratulations!** Your AllReds Training Management System is now ready to use.
