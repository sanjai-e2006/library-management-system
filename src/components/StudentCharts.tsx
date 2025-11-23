import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Enhanced mock data with more realistic patterns
const MOCK_DATA = {
  topBooks: [
    { title: "Introduction to Algorithms", author: "Cormen, Thomas H.", borrowCount: 234, trend: "+15%" },
    { title: "Clean Code", author: "Martin, Robert C.", borrowCount: 189, trend: "+8%" },
    { title: "1984", author: "Orwell, George", borrowCount: 167, trend: "+22%" },
    { title: "The Lean Startup", author: "Ries, Eric", borrowCount: 143, trend: "+5%" },
    { title: "Python Programming", author: "Lutz, Mark", borrowCount: 128, trend: "-2%" }
  ],
  topAuthors: [
    { author: "Cormen, Thomas H.", borrowCount: 289, subject: "Computer Science" },
    { author: "Martin, Robert C.", borrowCount: 245, subject: "Computer Science" },
    { author: "Orwell, George", borrowCount: 198, subject: "Literature" },
    { author: "Ries, Eric", borrowCount: 176, subject: "Business" },
    { author: "Harari, Yuval Noah", borrowCount: 154, subject: "History" }
  ],
  monthlyTrends: [
    { month: "Jan 2024", Computer: 145, Literature: 98, Business: 112, Science: 78, History: 62, Arts: 45 },
    { month: "Feb 2024", Computer: 162, Literature: 105, Business: 98, Science: 81, History: 68, Arts: 52 },
    { month: "Mar 2024", Computer: 158, Literature: 118, Business: 124, Science: 89, History: 75, Arts: 58 },
    { month: "Apr 2024", Computer: 178, Literature: 112, Business: 137, Science: 95, History: 82, Arts: 48 },
    { month: "May 2024", Computer: 191, Literature: 128, Business: 145, Science: 103, History: 89, Arts: 67 },
    { month: "Jun 2024", Computer: 185, Literature: 124, Business: 141, Science: 98, History: 86, Arts: 63 }
  ]
}

export function TopBooksChart({ subject }: { subject: string }) {
  const data = {
    labels: MOCK_DATA.topBooks.map(book => {
      const shortTitle = book.title.length > 25 ? book.title.slice(0, 25) + '...' : book.title
      return shortTitle
    }),
    datasets: [{
      label: 'Times Borrowed',
      data: MOCK_DATA.topBooks.map(book => book.borrowCount),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)', 
        'rgba(6, 182, 212, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(6, 182, 212, 1)', 
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)'
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
          title: (context: any) => MOCK_DATA.topBooks[context[0].dataIndex].title,
          label: (context: any) => {
            const book = MOCK_DATA.topBooks[context.dataIndex]
            return [
              `Author: ${book.author}`,
              `Borrowed: ${book.borrowCount} times`,
              `Trend: ${book.trend}`
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
        ticks: { color: '#6b7280', font: { size: 12 } }
      }
    }
  }

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  )
}

export function TopAuthorsChart() {
  const data = {
    labels: MOCK_DATA.topAuthors.map(author => author.author.split(',')[0]),
    datasets: [{
      data: MOCK_DATA.topAuthors.map(author => author.borrowCount),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)', 
        'rgba(6, 182, 212, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)'
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
            const author = MOCK_DATA.topAuthors[context.dataIndex]
            return [
              `${author.author}`,
              `${author.borrowCount} books borrowed`,
              `Subject: ${author.subject}`
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

export function BorrowingTrendChart({ subject }: { subject: string }) {
  const data = {
    labels: MOCK_DATA.monthlyTrends.map(item => item.month),
    datasets: [{
      label: `${subject} Borrowings`,
      data: MOCK_DATA.monthlyTrends.map(item => (item as any)[subject.split(' ')[0]] || 0),
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
        ticks: { color: '#6b7280', font: { size: 12 } }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    }
  }

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  )
}

export function BookAvailabilityGrid({ subject }: { subject: string }) {
  // Enhanced mock data with more realistic book information
  const availableBooks = [
    { 
      title: "Introduction to Algorithms", 
      author: "Cormen, Thomas H.", 
      available: true, 
      copies: 3, 
      totalCopies: 5,
      isbn: "978-0262033848",
      rating: 4.8,
      lastBorrowed: "2 days ago"
    },
    { 
      title: "Clean Code: A Handbook", 
      author: "Martin, Robert C.", 
      available: true, 
      copies: 2, 
      totalCopies: 4,
      isbn: "978-0132350884", 
      rating: 4.7,
      lastBorrowed: "1 week ago"
    },
    { 
      title: "Design Patterns", 
      author: "Gang of Four", 
      available: false, 
      copies: 0, 
      totalCopies: 3,
      isbn: "978-0201633612",
      rating: 4.6,
      lastBorrowed: "3 days ago"
    },
    { 
      title: "Python Programming", 
      author: "Lutz, Mark", 
      available: true, 
      copies: 1, 
      totalCopies: 2,
      isbn: "978-1449355739",
      rating: 4.5,
      lastBorrowed: "5 days ago"
    },
    { 
      title: "JavaScript: The Good Parts", 
      author: "Crockford, Douglas", 
      available: true, 
      copies: 4, 
      totalCopies: 6,
      isbn: "978-0596517748",
      rating: 4.4,
      lastBorrowed: "1 day ago"
    },
    { 
      title: "System Design Interview", 
      author: "Alex Xu", 
      available: false, 
      copies: 0, 
      totalCopies: 2,
      isbn: "978-1734723416",
      rating: 4.9,
      lastBorrowed: "Today"
    }
  ]

  return (
    <div>
      <div className="book-grid">
        {availableBooks.map((book, idx) => (
          <div key={idx} className="book-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <h4 className="book-title">{book.title}</h4>
                <p className="book-author">by {book.author}</p>
                <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>
                  ISBN: {book.isbn}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '4px' }}>
                  ⭐ {book.rating}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--gray-400)' }}>
                  Last: {book.lastBorrowed}
                </div>
              </div>
            </div>

            <div className="book-status">
              <span className={`status-badge ${book.available ? 'status-available' : 'status-unavailable'}`}>
                {book.available ? '✅ Available' : '⏳ All checked out'}
              </span>
              <span className="copies-count">
                {book.copies}/{book.totalCopies} copies
              </span>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {book.available ? (
                  <>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Reserve
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Preview
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                      Join Waitlist
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Notify Me
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}