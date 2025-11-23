# Library Management System

A modern, full-featured Library Management System built with React, TypeScript, and Vite. This Business Intelligence dashboard provides comprehensive analytics and management tools for library operations.

## 🌟 Features

### Student Dashboard
- **Explore Collection**: Advanced search and filter capabilities across 12,850+ books
- **Trending Books**: Real-time display of popular titles
- **Personal Analytics**: Track borrowing history and reading patterns
- **Top Books Chart**: Visual representation of most popular books

### Admin Dashboard
- **Overview Statistics**: Real-time KPIs for library operations
- **Department Analytics**: Borrowing patterns by department
- **Peak Usage Analysis**: Temporal usage patterns and trends
- **Popular Categories**: Subject distribution and trends
- **Top Students**: Active user leaderboard
- **Author Popularity**: Most borrowed authors

## 📊 Key Performance Indicators (KPIs)

### Collection Management
- Total Books: 12,850
- Available Books: 8,956
- Borrowed Books: 3,894
- Total Subjects: 18

### User Engagement
- Total Students: 8,420
- Daily Borrows: 245
- Active Users Tracking
- Borrowing Patterns Analysis

### Analytics Features
- Department-wise borrowing statistics
- Temporal usage patterns (hourly, daily, monthly)
- Subject distribution analysis
- Author popularity rankings
- Student engagement metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanjai-e2006/library-management-system.git
cd library-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Charts & Visualization**: Chart.js with react-chartjs-2
- **Styling**: Custom CSS with modern design patterns
- **Backend**: Supabase (Database & Authentication)
- **Icons**: Lucide React

## 📁 Project Structure

```
library-management-system/
├── public/
│   └── images/          # Static images
├── src/
│   ├── components/      # Reusable components
│   │   ├── AdminCharts.tsx
│   │   ├── StudentCharts.tsx
│   │   └── TopBooksChart.tsx
│   ├── pages/          # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── LoginPage.tsx
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   ├── styles.css      # Global styles
│   └── supabaseClient.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional interface with gradient backgrounds
- **Glass Morphism**: Translucent card designs
- **Responsive Layout**: Mobile-friendly design
- **Interactive Charts**: Real-time data visualization
- **Color-Coded Sections**: Easy navigation and visual hierarchy

## 📈 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Dashboard Features

### Student View
- Browse and search extensive book collection
- Filter by subject, author, and availability
- View trending and recommended books
- Personal borrowing statistics
- Reading history and patterns

### Admin View
- Comprehensive library overview
- Department-wise analytics
- Peak usage time analysis
- Popular categories and subjects
- Top active students leaderboard
- Author popularity rankings
- Monthly and daily trend analysis

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Sanjai E**
- GitHub: [@sanjai-e2006](https://github.com/sanjai-e2006)

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- Supabase for backend infrastructure
- React and Vite communities

---

Made with ❤️ for better library management
