import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

// Enhanced mock data with more realistic patterns
const MOCK_ADMIN_DATA = {
  departmentBorrowing: [
    { department: "Computer Science", borrowings: 3733, activeStudents: 245, growth: "+12%" },
    { department: "Literature", borrowings: 3021, activeStudents: 198, growth: "+8%" },
    { department: "Business", borrowings: 3000, activeStudents: 201, growth: "+15%" },
    { department: "Science", borrowings: 2168, activeStudents: 156, growth: "+5%" },
    { department: "History", borrowings: 1856, activeStudents: 128, growth: "+3%" },
    { department: "Arts", borrowings: 1222, activeStudents: 89, growth: "-2%" }
  ],
  monthlyUsage: [
    { month: "Jan", total: 1245, trend: "↗️" },
    { month: "Feb", total: 1368, trend: "↗️" },
    { month: "Mar", total: 1421, trend: "↗️" },
    { month: "Apr", total: 1556, trend: "↗️" },
    { month: "May", total: 1634, trend: "↗️" },
    { month: "Jun", total: 1489, trend: "↘️" },
    { month: "Jul", total: 1387, trend: "↘️" },
    { month: "Aug", total: 1298, trend: "↘️" },
    { month: "Sep", total: 1567, trend: "↗️" },
    { month: "Oct", total: 1734, trend: "↗️" }
  ],
  topStudents: [
    { id: "P0001", name: "Sarah Chen", checkouts: 47, ageRange: "20 to 24 years", library: "Main", department: "Computer Science" },
    { id: "P0002", name: "Marcus Johnson", checkouts: 43, ageRange: "25 to 34 years", library: "Richmond", department: "Business" },
    { id: "P0003", name: "Emily Rodriguez", checkouts: 41, ageRange: "35 to 44 years", library: "Sunset", department: "Literature" },
    { id: "P0004", name: "David Kim", checkouts: 38, ageRange: "20 to 24 years", library: "Main", department: "Science" },
    { id: "P0005", name: "Jennifer Walsh", checkouts: 36, ageRange: "25 to 34 years", library: "Western Addition", department: "History" }
  ]
}

export function DepartmentBorrowingChart() {
  const data = {
    labels: MOCK_ADMIN_DATA.departmentBorrowing.map(dept => dept.department),
    datasets: [{
      label: 'Total Borrowings',
      data: MOCK_ADMIN_DATA.departmentBorrowing.map(dept => dept.borrowings),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(6, 182, 212, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const dept = MOCK_ADMIN_DATA.departmentBorrowing[context.dataIndex]
            return [
              `Borrowings: ${dept.borrowings.toLocaleString()}`,
              `Active Students: ${dept.activeStudents}`,
              `Growth: ${dept.growth}`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: '#6b7280', 
          font: { size: 12 },
          callback: function(value: any, index: any): string {
            const labels = MOCK_ADMIN_DATA.departmentBorrowing.map(dept => dept.department);
            const label = labels[index] || '';
            return label.length > 10 ? label.substring(0, 10) + '...' : label;
          }
        }
      },
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
        ticks: { 
          color: '#6b7280', 
          font: { size: 12 },
          callback: function(value: any) {
            return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
          }
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  )
}

export function PeakUsageChart() {
  const data = {
    labels: MOCK_ADMIN_DATA.monthlyUsage.map(item => item.month),
    datasets: [{
      label: 'Monthly Checkouts',
      data: MOCK_ADMIN_DATA.monthlyUsage.map(item => item.total),
      borderColor: 'rgba(99, 102, 241, 1)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const usage = MOCK_ADMIN_DATA.monthlyUsage[context.dataIndex]
            return [
              `Checkouts: ${usage.total.toLocaleString()}`,
              `Trend: ${usage.trend}`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } }
      },
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
        ticks: { 
          color: '#6b7280', 
          font: { size: 12 },
          callback: function(value: any) {
            return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    }
  }

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  )
}

export function PopularCategoriesChart() {
  const data = {
    labels: MOCK_ADMIN_DATA.departmentBorrowing.map(dept => dept.department),
    datasets: [{
      data: MOCK_ADMIN_DATA.departmentBorrowing.map(dept => dept.borrowings),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(6, 182, 212, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const dept = MOCK_ADMIN_DATA.departmentBorrowing[context.dataIndex]
            const total = MOCK_ADMIN_DATA.departmentBorrowing.reduce((sum, d) => sum + d.borrowings, 0)
            const percentage = ((dept.borrowings / total) * 100).toFixed(1)
            return [
              `${dept.department}`,
              `${dept.borrowings.toLocaleString()} borrowings (${percentage}%)`,
              `${dept.activeStudents} active students`
            ]
          }
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Doughnut data={data} options={options} />
    </div>
  )
}

export function TopStudentsTable() {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Checkouts</th>
            <th>Department</th>
            <th>Age Range</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ADMIN_DATA.topStudents.map((student, idx) => (
            <tr key={student.id}>
              <td>
                <span style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '12px' }}>
                  {student.id}
                </span>
              </td>
              <td>
                <div>
                  <strong>{student.name}</strong>
                </div>
              </td>
              <td>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: 'var(--primary)',
                  fontSize: '16px'
                }}>
                  {student.checkouts}
                </span>
              </td>
              <td>
                <span className="status-badge status-available" style={{ fontSize: '11px' }}>
                  {student.department}
                </span>
              </td>
              <td style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                {student.ageRange}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn btn-outline btn-sm">👁️ View</button>
                  <button className="btn btn-primary btn-sm">✉️ Contact</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function OverviewStats() {
  const totalBorrowings = MOCK_ADMIN_DATA.departmentBorrowing.reduce((sum, dept) => sum + dept.borrowings, 0)
  const totalStudents = MOCK_ADMIN_DATA.departmentBorrowing.reduce((sum, dept) => sum + dept.activeStudents, 0)
  const avgBorrowingsPerStudent = Math.round(totalBorrowings / totalStudents)
  const currentMonthUsage = MOCK_ADMIN_DATA.monthlyUsage[MOCK_ADMIN_DATA.monthlyUsage.length - 1].total

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-number">{totalBorrowings.toLocaleString()}</div>
        <div className="stat-label">Total Checkouts</div>
        <div className="stat-change positive">+8.5% vs last month</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{totalStudents.toLocaleString()}</div>
        <div className="stat-label">Active Students</div>
        <div className="stat-change positive">+15 new this week</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{avgBorrowingsPerStudent}</div>
        <div className="stat-label">Avg. per Student</div>
        <div className="stat-change positive">+0.8 improvement</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{currentMonthUsage.toLocaleString()}</div>
        <div className="stat-label">This Month</div>
        <div className="stat-change positive">+11% vs last month</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">12,850</div>
        <div className="stat-label">Total Books</div>
        <div className="stat-change neutral">69% available</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">94.2%</div>
        <div className="stat-label">Return Rate</div>
        <div className="stat-change positive">+2.1% improvement</div>
      </div>
    </div>
  )
}