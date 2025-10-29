# Personal Expense Tracker

A full-stack web application for tracking personal expenses with a modern React frontend and Node.js backend. This application helps users manage their expenses by providing features like expense tracking, categorization, and visualization.

## 🚀 Features

- **Expense Management**: Add, edit, and delete expenses
- **Category-based Organization**: Categorize expenses into predefined categories
- **Dashboard View**: Visual representation of expense data
- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Updates**: Immediate reflection of changes in the UI
- **Data Persistence**: MongoDB backend for reliable data storage

## 🛠️ Technology Stack

### Frontend

- **React 19**: Modern UI library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible components
- **Recharts**: Composable charting library

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

## 📦 Project Structure

```
├── Backend/                          # Backend server code
│   ├── config/                        # Configuration files
│   │   └── db.js                      # Database connection setup
│   ├── controller/                    # Request handlers
│   │   └── expenseController.js
│   ├── routes/                        # API routes
│   │   └── routes.js
│   ├── .env                           # Environment variables
│   ├── package.json                   # Backend dependencies
│   ├── package-lock.json              # Backend lockfile
│   └── server.js                      # Express server setup
│
├── PersonelExpense/                   # Frontend React (Vite) application
│   ├── node_modules/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/                # React components
│   │   │   ├── ui/                    # Reusable UI components
│   │   │   ├── add-expense-form.tsx
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── expense-dashboard.tsx
│   │   │   └── expense-list.tsx
│   │   ├── lib/                       # Utility functions
│   │   ├── main.tsx                   # Application entry point
│   │   └── page.tsx                   # Main page component
│   ├── index.html
│   ├── components.json
│   ├── package.json                   # Frontend dependencies
│   └── package-lock.json              # Frontend lockfile
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas account)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/TR-HarshVVVV/Personal-Expense-Tracker.git
cd Personal-Expense-Tracker
```

2. **Set up the Backend**

```bash
cd Backend
npm install

# Create a .env file with the following content:
# MongoDB_URI=your_mongodb_connection_string
# PORT=3000
```

3. **Set up the Frontend**

```bash
cd ../PersonelExpense
npm install
```

4. **Start the Applications**

Backend:

```bash
cd Backend
npm start
# Server will start on http://localhost:3000
```

Frontend:

```bash
cd PersonelExpense
npm run dev
# Development server will start on http://localhost:5173
```

## 💾 Database Schema

### Expense Model

```javascript
{
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Travel',
      'Education',
      'Personal Care',
      'Other'
    ]
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## 🔌 API Endpoints

### Expenses API

- **GET /api/expenses**: Fetch all expenses
- **POST /api/expenses**: Create a new expense
- **PUT /api/expenses/:id**: Update an existing expense
- **DELETE /api/expenses/:id**: Delete an expense

## 🖥️ Frontend Components

### Key Components

1. **ExpenseDashboard**: Main dashboard showing expense statistics and charts
2. **AddExpenseForm**: Form component for adding/editing expenses
3. **ExpenseList**: Displays list of expenses with filtering options
4. **DashboardLayout**: Main layout component with navigation

### State Management

- React's built-in useState and useEffect hooks for local state management
- API integration for data persistence

## 🔧 Configuration

### Backend Configuration (.env)

```env
MongoDB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/db_name
PORT=3000
```

### Frontend Configuration

- API endpoint configuration in frontend code
- Vite configuration for development server

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the contents of the `dist` directory

## 🔍 Troubleshooting

Common issues and solutions:

1. **MongoDB Connection Issues**

   - Check MongoDB URI format
   - Ensure network connectivity
   - Verify database user permissions

2. **Frontend API Errors**

   - Confirm backend server is running
   - Check CORS configuration
   - Verify API endpoint URLs

3. **Build Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall
   - Check for compatible dependency versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React and Node.js communities
- MongoDB Atlas for database hosting
- All contributors and users of this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ by TR-HarshVVVV
