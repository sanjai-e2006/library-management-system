import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DepartmentBorrowingChart, PeakUsageChart, PopularCategoriesChart, TopStudentsTable, OverviewStats } from '../components/AdminCharts'

const ADMIN_TABS = [
  { id: 'overview', label: '📊 Overview', icon: '📊' },
  { id: 'departments', label: '🏫 Departments', icon: '🏫' },
  { id: 'students', label: '👨‍🎓 Students', icon: '👨‍🎓' },
  { id: 'books', label: '📚 Books', icon: '📚' },
  { id: 'analytics', label: '📈 Analytics', icon: '📈' }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : 'AD'

  return (
    <div className="app-container">
      {/* Clean Header */}
      <header className="topbar admin-topbar">
        <div className="topbar-left">
          <div className="logo-section">
            <span className="logo-icon">🏛️</span>
            <div className="logo-text">
              <h1>Library Admin Portal</h1>
              <p>Comprehensive library management system</p>
            </div>
          </div>
        </div>
        
        <div className="topbar-center">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search books, students, reports..." 
              className="search-input"
            />
          </div>
        </div>

        <div className="topbar-right">
          <div className="notifications">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">5</span>
          </div>
          <div className="user-info">
            <span className="user-greeting">Hello, Admin!</span>
            <div className="user-avatar">{userInitials}</div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Clean Sidebar */}
        <aside className="sidebar clean-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-icon">🧭</span>
            <div className="sidebar-title">
              <h3>Navigation</h3>
              <p>Manage your library system</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            {ADMIN_TABS.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="sidebar-item-icon">{tab.icon}</span>
                <span className="sidebar-item-label">{tab.label.split(' ').slice(1).join(' ')}</span>
                {activeTab === tab.id && <span className="active-indicator"></span>}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4 className="quick-actions-title">Quick Actions</h4>
            <div className="quick-actions-list">
              <button className="quick-action-item primary">
                <span className="action-icon">📊</span>
                <span className="action-text">Generate Report</span>
              </button>
              <button className="quick-action-item secondary">
                <span className="action-icon">📧</span>
                <span className="action-text">Send Alerts</span>
              </button>
              <button className="quick-action-item outline">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content clean-main">
          {activeTab === 'overview' && (
            <div className="content-section">
              {/* Clean Overview Header */}
              <div className="section-header">
                <div className="section-title-area">
                  <h2 className="section-title">📊 Library Overview</h2>
                  <p className="section-description">Real-time insights and comprehensive analytics for library management</p>
                </div>
                <div className="section-controls">
                  <select className="control-select">
                    <option>📅 Last 30 days</option>
                    <option>📅 Last quarter</option>
                    <option>📅 Last year</option>
                  </select>
                  <button className="btn btn-primary">📊 Export Data</button>
                  <button className="btn btn-outline">🔄 Refresh</button>
                </div>
              </div>

              {/* Clean Overview Stats */}
              <div className="stats-grid-clean">
                <div className="stat-card-clean total-books">
                  <div className="stat-icon-area">
                    <span className="stat-icon">📚</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">12,850</h3>
                    <p className="stat-label">Total Books</p>
                    <div className="stat-change positive">
                      <span className="change-icon">↗️</span>
                      <span className="change-text">+125 this month</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card-clean active-users">
                  <div className="stat-icon-area">
                    <span className="stat-icon">👥</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">3,420</h3>
                    <p className="stat-label">Active Users</p>
                    <div className="stat-change positive">
                      <span className="change-icon">↗️</span>
                      <span className="change-text">+8% vs last month</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card-clean circulation">
                  <div className="stat-icon-area">
                    <span className="stat-icon">🔄</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">8,965</h3>
                    <p className="stat-label">Books in Circulation</p>
                    <div className="stat-change positive">
                      <span className="change-icon">↗️</span>
                      <span className="change-text">78% utilization</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card-clean revenue">
                  <div className="stat-icon-area">
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">$24,680</h3>
                    <p className="stat-label">Monthly Revenue</p>
                    <div className="stat-change positive">
                      <span className="change-icon">↗️</span>
                      <span className="change-text">+15% growth</span>
                    </div>
                  </div>
                </div>
              </div>

              <OverviewStats />

              {/* Clean Charts Grid */}
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title-area">
                      <h3 className="chart-title">🏫 Department Performance</h3>
                      <p className="chart-description">Borrowing activity across academic departments</p>
                    </div>
                    <div className="chart-controls">
                      <button className="chart-btn">📊 View Details</button>
                    </div>
                  </div>
                  <div className="chart-body">
                    <DepartmentBorrowingChart />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title-area">
                      <h3 className="chart-title">📈 Usage Trends</h3>
                      <p className="chart-description">Monthly library activity patterns and peak hours</p>
                    </div>
                    <div className="chart-controls">
                      <button className="chart-btn">📊 Analyze</button>
                    </div>
                  </div>
                  <div className="chart-body">
                    <PeakUsageChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="content-section">
              {/* Enhanced Department Analytics Header */}
              <div className="section-header-enhanced">
                <div className="section-title-group">
                  <h2 className="section-title-modern">🏫 Department Analytics</h2>
                  <p className="section-subtitle-modern">Comprehensive analysis of borrowing patterns across all academic departments</p>
                </div>
                <div className="section-actions-modern">
                  <select className="filter-select-modern">
                    <option>All Departments</option>
                    <option>Computer Science</option>
                    <option>Literature</option>
                    <option>Business</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Arts</option>
                  </select>
                  <button className="action-btn-modern primary">📊 Compare Departments</button>
                  <button className="action-btn-modern outline">📊 Generate Report</button>
                </div>
              </div>

              {/* Enhanced Department Stats */}
              <div className="department-stats-enhanced">
                <div className="dept-stat-card active">
                  <div className="dept-stat-icon">🏫</div>
                  <div className="dept-stat-content">
                    <h3 className="dept-stat-number">6</h3>
                    <p className="dept-stat-label">Active Departments</p>
                    <span className="dept-stat-trend positive">All departments active</span>
                  </div>
                </div>
                
                <div className="dept-stat-card top-performer">
                  <div className="dept-stat-icon">🏆</div>
                  <div className="dept-stat-content">
                    <h3 className="dept-stat-number">3,733</h3>
                    <p className="dept-stat-label">Top Department (CS)</p>
                    <span className="dept-stat-trend positive">+12% vs average</span>
                  </div>
                </div>
                
                <div className="dept-stat-card average">
                  <div className="dept-stat-icon">📊</div>
                  <div className="dept-stat-content">
                    <h3 className="dept-stat-number">2,145</h3>
                    <p className="dept-stat-label">Avg per Department</p>
                    <span className="dept-stat-trend neutral">Balanced distribution</span>
                  </div>
                </div>
                
                <div className="dept-stat-card utilization">
                  <div className="dept-stat-icon">📈</div>
                  <div className="dept-stat-content">
                    <h3 className="dept-stat-number">89%</h3>
                    <p className="dept-stat-label">Utilization Rate</p>
                    <span className="dept-stat-trend positive">+5% this month</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Charts Grid */}
              <div className="charts-grid-enhanced">
                <div className="chart-card-modern">
                  <div className="chart-header-modern">
                    <div className="chart-title-group">
                      <h3 className="chart-title">📊 Department Borrowings</h3>
                      <p className="chart-subtitle">Comparative borrowing statistics by department</p>
                    </div>
                    <div className="chart-actions">
                      <button className="chart-action-btn">🔍 Drill Down</button>
                    </div>
                  </div>
                  <div className="chart-content">
                    <DepartmentBorrowingChart />
                  </div>
                </div>
                
                <div className="chart-card-modern">
                  <div className="chart-header-modern">
                    <div className="chart-title-group">
                      <h3 className="chart-title">📚 Subject Distribution</h3>
                      <p className="chart-subtitle">Popular subjects across departments</p>
                    </div>
                    <div className="chart-actions">
                      <button className="chart-action-btn">📊 Export</button>
                    </div>
                  </div>
                  <div className="chart-content">
                    <PopularCategoriesChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="content-section">
              {/* Enhanced Student Analytics Header */}
              <div className="section-header-enhanced">
                <div className="section-title-group">
                  <h2 className="section-title-modern">👨‍🎓 Student Analytics</h2>
                  <p className="section-subtitle-modern">Monitor student engagement, borrowing patterns, and academic performance indicators</p>
                </div>
                <div className="section-actions-modern">
                  <div className="search-group-modern">
                    <input 
                      type="text" 
                      className="search-input-modern" 
                      placeholder="🔍 Search students by name or ID..." 
                    />
                    <button className="search-btn-modern">Search</button>
                  </div>
                  <button className="action-btn-modern primary">� Export Student List</button>
                  <button className="action-btn-modern outline">� Send Notifications</button>
                </div>
              </div>

              {/* Enhanced Student Stats */}
              <div className="student-stats-enhanced">
                <div className="student-stat-card total">
                  <div className="student-stat-icon">👥</div>
                  <div className="student-stat-content">
                    <h3 className="student-stat-number">1,247</h3>
                    <p className="student-stat-label">Active Students</p>
                    <span className="student-stat-trend positive">+15 this week</span>
                  </div>
                  <div className="student-stat-chart">
                    <span className="mini-chart">📈</span>
                  </div>
                </div>
                
                <div className="student-stat-card average">
                  <div className="student-stat-icon">📚</div>
                  <div className="student-stat-content">
                    <h3 className="student-stat-number">12.4</h3>
                    <p className="student-stat-label">Avg Books/Student</p>
                    <span className="student-stat-trend positive">+0.8 vs last month</span>
                  </div>
                  <div className="student-stat-chart">
                    <span className="mini-chart">📊</span>
                  </div>
                </div>
                
                <div className="student-stat-card top-reader">
                  <div className="student-stat-icon">🏆</div>
                  <div className="student-stat-content">
                    <h3 className="student-stat-number">47</h3>
                    <p className="student-stat-label">Most Active Student</p>
                    <span className="student-stat-trend neutral">Student ID: P0001</span>
                  </div>
                  <div className="student-stat-chart">
                    <span className="mini-chart">⭐</span>
                  </div>
                </div>
                
                <div className="student-stat-card return-rate">
                  <div className="student-stat-icon">✅</div>
                  <div className="student-stat-content">
                    <h3 className="student-stat-number">94%</h3>
                    <p className="student-stat-label">Return Rate</p>
                    <span className="student-stat-trend positive">+2% improvement</span>
                  </div>
                  <div className="student-stat-chart">
                    <span className="mini-chart">📈</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Students Table */}
              <div className="table-card-modern">
                <div className="table-header-modern">
                  <div className="table-title-group">
                    <h3 className="table-title">🏆 Top Active Students</h3>
                    <p className="table-subtitle">Students with highest borrowing activity and engagement</p>
                  </div>
                  <div className="table-actions">
                    <button className="table-action-btn primary">📊 View All Students</button>
                    <button className="table-action-btn outline">📋 Export Data</button>
                  </div>
                </div>
                <div className="table-content">
                  <TopStudentsTable />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="content-section">
              {/* Enhanced Book Management Header */}
              <div className="section-header-enhanced">
                <div className="section-title-group">
                  <h2 className="section-title-modern">📚 Book Management</h2>
                  <p className="section-subtitle-modern">Comprehensive library inventory management and book performance analytics</p>
                </div>
                <div className="section-actions-modern">
                  <button className="action-btn-modern primary">➕ Add New Book</button>
                  <button className="action-btn-modern secondary">📊 Inventory Report</button>
                  <button className="action-btn-modern outline">🔄 Sync Catalog</button>
                </div>
              </div>

              {/* Enhanced Book Stats */}
              <div className="book-stats-enhanced">
                <div className="book-stat-card total">
                  <div className="book-stat-icon">📚</div>
                  <div className="book-stat-content">
                    <h3 className="book-stat-number">12,847</h3>
                    <p className="book-stat-label">Total Books</p>
                    <span className="book-stat-trend positive">+12 new this month</span>
                  </div>
                </div>
                
                <div className="book-stat-card available">
                  <div className="book-stat-icon">✅</div>
                  <div className="book-stat-content">
                    <h3 className="book-stat-number">8,956</h3>
                    <p className="book-stat-label">Available</p>
                    <span className="book-stat-trend neutral">69% availability rate</span>
                  </div>
                </div>
                
                <div className="book-stat-card checked-out">
                  <div className="book-stat-icon">📖</div>
                  <div className="book-stat-content">
                    <h3 className="book-stat-number">3,891</h3>
                    <p className="book-stat-label">Checked Out</p>
                    <span className="book-stat-trend warning">31% circulation</span>
                  </div>
                </div>
                
                <div className="book-stat-card overdue">
                  <div className="book-stat-icon">⚠️</div>
                  <div className="book-stat-content">
                    <h3 className="book-stat-number">23</h3>
                    <p className="book-stat-label">Overdue</p>
                    <span className="book-stat-trend negative">Needs attention</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Book Management Interface */}
              <div className="management-interface-modern">
                <div className="interface-header">
                  <h3 className="interface-title">📖 Advanced Book Management</h3>
                  <p className="interface-subtitle">Comprehensive tools for library inventory management</p>
                </div>
                <div className="interface-content">
                  <div className="feature-preview">
                    <div className="preview-icon">🚧</div>
                    <h4>Enhanced Features Coming Soon</h4>
                    <p>Advanced book management, automated inventory tracking, and intelligent ordering system are currently in development.</p>
                    <div className="preview-actions">
                      <button className="preview-btn primary">📧 Request Early Access</button>
                      <button className="preview-btn outline">📋 View Roadmap</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="content-section">
              {/* Enhanced Analytics Header */}
              <div className="section-header-enhanced">
                <div className="section-title-group">
                  <h2 className="section-title-modern">📈 Advanced Analytics</h2>
                  <p className="section-subtitle-modern">Deep insights, predictive analytics, and comprehensive reporting for data-driven decisions</p>
                </div>
                <div className="section-actions-modern">
                  <select className="filter-select-modern">
                    <option>📅 Last 30 days</option>
                    <option>📅 Last quarter</option>
                    <option>📅 Last year</option>
                    <option>📅 All time</option>
                  </select>
                  <button className="action-btn-modern primary">🔄 Refresh Data</button>
                  <button className="action-btn-modern outline">📊 Custom Report</button>
                </div>
              </div>

              {/* Enhanced Analytics Grid */}
              <div className="analytics-grid-enhanced">
                <div className="analytics-card-modern">
                  <div className="analytics-header">
                    <div className="analytics-title-group">
                      <h3 className="analytics-title">📊 Usage Patterns</h3>
                      <p className="analytics-subtitle">Seasonal trends and time-based analysis</p>
                    </div>
                    <div className="analytics-actions">
                      <button className="analytics-action-btn">🔍 Deep Dive</button>
                    </div>
                  </div>
                  <div className="analytics-content">
                    <PeakUsageChart />
                  </div>
                </div>
                
                <div className="analytics-card-modern">
                  <div className="analytics-header">
                    <div className="analytics-title-group">
                      <h3 className="analytics-title">🎯 Subject Popularity</h3>
                      <p className="analytics-subtitle">Comprehensive borrowing distribution by subject</p>
                    </div>
                    <div className="analytics-actions">
                      <button className="analytics-action-btn">📈 Trends</button>
                    </div>
                  </div>
                  <div className="analytics-content">
                    <PopularCategoriesChart />
                  </div>
                </div>
              </div>

              
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
