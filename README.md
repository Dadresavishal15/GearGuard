# ⚙️ GearGuard - The Ultimate Maintenance Tracker

A comprehensive web-based maintenance management system for tracking equipment, managing maintenance requests, and organizing maintenance teams.

![GearGuard Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🌟 Features

### Core Functionality
- **📊 Dashboard Analytics** - Real-time KPIs including technician load, open requests, and critical equipment
- **🔧 Equipment Management** - Complete CRUD operations with rich metadata tracking
- **📋 Maintenance Requests** - Kanban-style workflow with drag-and-drop (New → In Progress → Repaired → Scrap)
- **👥 Team Management** - Organize maintenance teams with member tracking
- **📦 Category Management** - Manage equipment categories with responsible person assignment
- **📅 Calendar View** - Visual scheduling for preventive maintenance
- **🔐 Authentication** - Secure login/signup with password complexity validation

### Advanced Features
- **💬 Worksheet & Comments** - Technician work logs with timestamp tracking
- **🗑️ Scrap Automation** - Automatic equipment status updates with confirmation dialogs
- **🔄 Auto-fill Logic** - Smart form population based on equipment selection
- **📈 Analytics Charts** - Requests by team and category visualization
- **🏢 Multi-company Support** - Company field across all entities
- **📝 Rich Metadata** - Description, dates, notes, and instructions tracking

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required - runs entirely in the browser!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/GearGuard.git
   cd GearGuard
   ```

2. **Open the application**
   - Simply open `login.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Login with demo credentials**
   - Email: `admin@gearguard.com`
   - Password: `admin123`

That's it! No installation, no dependencies, no build process needed.

## 📁 Project Structure

```
gearguard/
├── index.html              # Main application
├── login.html              # Authentication page
├── styles.css              # Global styles
├── js/
│   ├── app.js             # Application controller
│   ├── auth.js            # Authentication logic
│   ├── data.js            # Data models & storage
│   ├── utils.js           # Utility functions
│   ├── dashboard.js       # Dashboard view
│   ├── equipment.js       # Equipment management
│   ├── requests.js        # Maintenance requests
│   ├── teams.js           # Team management
│   ├── categories.js      # Category management
│   ├── calendar.js        # Calendar view
│   └── api-client.js      # Backend API client (optional)
└── backend/               # Node.js/MongoDB backend (optional)
    ├── server.js
    ├── routes/
    └── models/
```

## 💾 Data Storage

### Current: LocalStorage (Default)
- All data stored in browser's localStorage
- No server required
- Perfect for demos, prototypes, and small deployments
- Data persists across sessions

### Optional: MongoDB Backend
- Node.js/Express API included in `/backend`
- MongoDB integration ready
- See [Backend README](backend/README.md) for setup instructions

## 🎯 Usage Guide

### Managing Equipment
1. Navigate to **Equipment** tab
2. Click **+ Add New** to create equipment
3. Fill in details: name, serial number, category, location, etc.
4. Assign to team and technician
5. Click **Save Equipment**

### Creating Maintenance Requests
1. Navigate to **Requests** tab
2. Click **+ Add New**
3. Select equipment (auto-fills team/technician)
4. Set type (Corrective/Preventive), priority, and schedule
5. Add notes and instructions
6. Drag cards between columns to update status

### Using Worksheet & Comments
1. Open any existing maintenance request
2. Click **📋 Worksheet & Comments** button
3. Add work notes, observations, or updates
4. View complete comment history with timestamps

### Managing Categories
1. Navigate to **Categories** tab
2. Create categories with responsible person
3. View equipment count per category
4. Edit or delete as needed

## 🔒 Security Features

- **Password Complexity Validation**
  - Minimum 8 characters
  - Requires uppercase, lowercase, and special characters
- **Session Management**
- **Email Uniqueness Validation**

## 📊 Data Models

### Equipment
- Name, Serial Number, Category
- Company, Department, Location
- Employee, Team, Technician
- Purchase Date, Warranty, Assigned Date
- Description, Scrap Status & Date

### Maintenance Request
- Subject, Equipment (linked)
- Type (Corrective/Preventive)
- Stage (New/In Progress/Repaired/Scrap)
- Team, Technician, Priority
- Scheduled Date, Duration
- Company, Notes, Instructions
- Comments/Worksheet

### Team
- Name, Members, Company

### Category
- Name, Responsible Person, Company

## 🎨 Screenshots

### Dashboard
![Dashboard]([screenshots/dashboard.png](https://drive.google.com/open?id=1t0qFjaVOhiHAxaRkyaff_K9hkWV7as1o&usp=drive_copy))

### Equipment Management
![Equipment]([screenshots/equipment.png](https://drive.google.com/open?id=1cEKCXbxyXf1Yf-pGwIZxYLr5dLQ1Xyuv&usp=drive_copy))

### Kanban Board
![Requests]([screenshots/requests.png](https://drive.google.com/open?id=1aNbN-uHPwfzPoPl_TME7s7syh7_FLTP-&usp=drive_copy))

### Category Management
![Categories]([screenshots/categories.png](https://drive.google.com/open?id=1sB8FZLzLmUP1wkaO1OksTpcRoknfhHmJ&usp=drive_copy))

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Storage**: LocalStorage API
- **Backend (Optional)**: Node.js, Express, MongoDB
- **No frameworks**: Pure JavaScript for maximum compatibility

## 📈 Future Enhancements

-  Work Center Management (OEE tracking, cost per hour)
-  Advanced reporting and exports (PDF, Excel)
-  Email notifications for overdue requests
-  Mobile app (React Native)
-  Multi-language support
-  File attachments for requests
-  Barcode/QR code scanning

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [Dadresavishal15](https://github.com/Dadresavishal15/GearGuard.git)
- Email: vishaldadaresa.cse23@adaniuni.ac.in

## 🙏 Acknowledgments

- Inspired by modern maintenance management systems
- Built as part of ML Internship Project
- Special thanks to Adani University

## 📞 Support

For support, abhivirani2556@gmail.com in the GitHub repository.

---

**⭐ If you find this project useful, please consider giving it a star!**

