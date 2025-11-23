import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

interface Book {
  id: number;
  title: string;
  author: string;
  subject: string;
  availability: 'Available' | 'Borrowed';
  isbn: string;
  borrowCount: number;
  rating: number;
  description: string;
  publishYear?: number;
  edition?: string;
  location?: string;
  dueDate?: string;
}

interface TopBooksChartProps {
  books: Book[];
  selectedSubject: string;
}

export default function TopBooksChart({ books, selectedSubject }: TopBooksChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Filter books by subject (if not "All")
    const filteredBooks = selectedSubject === 'All' 
      ? books 
      : books.filter(book => book.subject === selectedSubject);

    // Get top 5 books by borrow count
    const topBooks = filteredBooks
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Color palette for bars
    const colors = [
      'rgba(139, 69, 219, 0.8)',  // Purple
      'rgba(168, 85, 247, 0.8)',  // Light Purple  
      'rgba(14, 165, 233, 0.8)',  // Blue
      'rgba(34, 197, 94, 0.8)',   // Green
      'rgba(249, 115, 22, 0.8)'   // Orange
    ];

    const borderColors = [
      'rgba(139, 69, 219, 1)',
      'rgba(168, 85, 247, 1)', 
      'rgba(14, 165, 233, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(249, 115, 22, 1)'
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topBooks.map(book => {
          // Truncate long titles
          return book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title;
        }),
        datasets: [{
          label: 'Times Borrowed',
          data: topBooks.map(book => book.borrowCount),
          backgroundColor: colors.slice(0, topBooks.length),
          borderColor: borderColors.slice(0, topBooks.length),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                const bookIndex = context[0].dataIndex;
                return topBooks[bookIndex].title;
              },
              label: function(context) {
                const bookIndex = context.dataIndex;
                const book = topBooks[bookIndex];
                return [
                  `👤 ${book.author}`,
                  `📊 ${book.borrowCount} times borrowed`,
                  `⭐ ${book.rating}/5.0 rating`,
                  `📚 ${book.availability}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11
              },
              maxRotation: 45
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [books, selectedSubject]);

  const filteredBooks = selectedSubject === 'All' 
    ? books 
    : books.filter(book => book.subject === selectedSubject);

  const topBooks = filteredBooks
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  return (
    <div className={`top-books-chart-container ${isVisible ? 'visible' : ''}`}>
      <div className="chart-header">
        <h3>🔥 Top 5 Most Popular Books</h3>
        <p className="chart-subtitle">
          {selectedSubject === 'All' 
            ? 'Most borrowed books across all subjects' 
            : `Most borrowed books in ${selectedSubject}`}
        </p>
      </div>
      
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>

      {/* Book Details Cards */}
      <div className="top-books-details">
        {topBooks.map((book, index) => (
          <div key={book.id} className={`top-book-card rank-${index + 1}`}>
            <div className="rank-badge">#{index + 1}</div>
            <div className="book-info">
              <h4 className="book-title-short">{book.title}</h4>
              <p className="book-author-short">👤 {book.author}</p>
              <div className="book-metrics">
                <span className="metric">📊 {book.borrowCount}</span>
                <span className="metric">
                  ⭐ {book.rating}
                  <span className="rating-stars-mini">
                    {'★'.repeat(Math.floor(book.rating))}{'☆'.repeat(5 - Math.floor(book.rating))}
                  </span>
                </span>
                <span className={`availability-mini ${book.availability.toLowerCase()}`}>
                  {book.availability === 'Available' ? '✅' : '📚'} {book.availability}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topBooks.length === 0 && (
        <div className="no-books-message">
          <div className="no-books-icon">📭</div>
          <h4>No books found</h4>
          <p>No books available for the selected subject. Try browsing other subjects.</p>
        </div>
      )}
    </div>
  );
}