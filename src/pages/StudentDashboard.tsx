import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBooksChart, TopAuthorsChart, BorrowingTrendChart, BookAvailabilityGrid } from '../components/StudentCharts'

const SUBJECTS = ['All', 'Computer Science', 'Literature', 'Business', 'Science', 'History', 'Arts', 'Mathematics', 'Chemistry', 'Physics', 'Biology', 'Psychology', 'Science Fiction', 'Fantasy', 'Biography', 'Self-Help', 'Economics', 'Sociology', 'Political Science']

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

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  action: () => void;
}

type SidebarSection = 'dashboard' | 'explore' | 'my-books' | 'trending' | 'popular-authors' | 'analytics' | 'recommendations' | 'popular-books' | 'borrowing-trends';
type ViewMode = 'grid' | 'list' | 'compact';

// Library Statistics - Realistic numbers for a university library (matching admin dashboard)
const LIBRARY_STATS = {
  totalBooks: 12850,
  availableBooks: 8956,
  borrowedBooks: 3894,
  totalSubjects: 18,
  totalStudents: 3420,
  dailyBorrows: 245
};

// Real library books data from SF Library dataset (sample of collection for display)
const LIBRARY_BOOKS: Book[] = [
  { id: 1, title: "1984", author: "Orwell, George", subject: "Literature", availability: "Available", isbn: "978-0-452-28423-4", borrowCount: 556, rating: 4.8, description: "A dystopian social science fiction novel and cautionary tale", publishYear: 1949, edition: "3rd Edition", location: "A-12-45" },
  { id: 2, title: "A Brief History of Time", author: "Hawking, Stephen", subject: "Science", availability: "Borrowed", isbn: "978-0-553-38016-3", borrowCount: 524, rating: 4.7, description: "A book on cosmology for the general reader", publishYear: 1988, edition: "1st Edition", location: "S-08-23", dueDate: "2025-10-25" },
  { id: 3, title: "A People's History", author: "Zinn, Howard", subject: "History", availability: "Available", isbn: "978-0-06-083865-2", borrowCount: 620, rating: 4.6, description: "A different perspective on American history", publishYear: 1980, edition: "2nd Edition", location: "H-15-67" },
  { id: 4, title: "Clean Code", author: "Martin, Robert C.", subject: "Computer Science", availability: "Available", isbn: "978-0-13-235088-4", borrowCount: 600, rating: 4.9, description: "A handbook of agile software craftsmanship", publishYear: 2008, edition: "1st Edition", location: "CS-04-12" },
  { id: 5, title: "Cosmos", author: "Sagan, Carl", subject: "Science", availability: "Available", isbn: "978-0-345-33135-9", borrowCount: 521, rating: 4.8, description: "Personal voyage through our universe", publishYear: 1980, edition: "1st Edition", location: "S-12-34" },
  { id: 6, title: "Design Patterns", author: "Gang of Four", subject: "Computer Science", availability: "Borrowed", isbn: "978-0-201-63361-0", borrowCount: 587, rating: 4.7, description: "Elements of reusable object-oriented software", publishYear: 1994, edition: "1st Edition", location: "CS-06-78", dueDate: "2025-11-02" },
  { id: 7, title: "Good to Great", author: "Collins, Jim", subject: "Business", availability: "Available", isbn: "978-0-06-662099-2", borrowCount: 602, rating: 4.5, description: "Why some companies make the leap and others don't", publishYear: 2001, edition: "1st Edition", location: "B-03-21" },
  { id: 8, title: "Introduction to Algorithms", author: "Cormen, Thomas H.", subject: "Computer Science", availability: "Available", isbn: "978-0-262-03384-8", borrowCount: 639, rating: 4.9, description: "Comprehensive introduction to algorithms", publishYear: 2009, edition: "3rd Edition", location: "CS-01-05" },
  { id: 9, title: "JavaScript: The Good Parts", author: "Crockford, Douglas", subject: "Computer Science", availability: "Borrowed", isbn: "978-0-596-51774-8", borrowCount: 612, rating: 4.6, description: "Unearthing the excellence in JavaScript", publishYear: 2008, edition: "1st Edition", location: "CS-07-89", dueDate: "2025-10-28" },
  { id: 10, title: "Machine Learning Yearning", author: "Ng, Andrew", subject: "Computer Science", availability: "Available", isbn: "978-0-999-57920-4", borrowCount: 626, rating: 4.8, description: "Technical strategy for AI engineers", publishYear: 2018, edition: "1st Edition", location: "CS-09-45" },
  { id: 11, title: "Pride and Prejudice", author: "Austen, Jane", subject: "Literature", availability: "Available", isbn: "978-0-14-143951-8", borrowCount: 609, rating: 4.7, description: "A romantic novel of manners", publishYear: 1813, edition: "Annotated Edition", location: "L-08-32" },
  { id: 12, title: "Python Programming", author: "Lutz, Mark", subject: "Computer Science", availability: "Available", isbn: "978-1-449-35573-9", borrowCount: 669, rating: 4.8, description: "An introduction to computer science", publishYear: 2013, edition: "5th Edition", location: "CS-02-67" },
  { id: 13, title: "Sapiens", author: "Harari, Yuval Noah", subject: "History", availability: "Borrowed", isbn: "978-0-06-231609-7", borrowCount: 666, rating: 4.9, description: "A brief history of humankind", publishYear: 2011, edition: "1st Edition", location: "H-04-78", dueDate: "2025-11-05" },
  { id: 14, title: "The Art of War", author: "Sun Tzu", subject: "Business", availability: "Available", isbn: "978-1-599-86974-1", borrowCount: 575, rating: 4.5, description: "Ancient Chinese military treatise", publishYear: 2009, edition: "Modern Translation", location: "B-08-45" },
  { id: 15, title: "The Catcher in the Rye", author: "Salinger, J.D.", subject: "Literature", availability: "Available", isbn: "978-0-316-76948-0", borrowCount: 554, rating: 4.4, description: "Coming-of-age story in New York", publishYear: 1951, edition: "1st Edition", location: "L-12-89" },
  { id: 16, title: "The Double Helix", author: "Watson, James", subject: "Science", availability: "Borrowed", isbn: "978-0-743-21630-8", borrowCount: 548, rating: 4.6, description: "Personal account of DNA discovery", publishYear: 1968, edition: "Annotated Edition", location: "S-15-23", dueDate: "2025-10-30" },
  { id: 17, title: "The Great Gatsby", author: "Fitzgerald, F. Scott", subject: "Literature", availability: "Available", isbn: "978-0-7432-7356-5", borrowCount: 660, rating: 4.8, description: "The Jazz Age masterpiece", publishYear: 1925, edition: "Centennial Edition", location: "L-05-67" },
  { id: 18, title: "The Guns of August", author: "Tuchman, Barbara", subject: "History", availability: "Available", isbn: "978-0-345-47609-8", borrowCount: 570, rating: 4.7, description: "The outbreak of World War I", publishYear: 1962, edition: "50th Anniversary", location: "H-09-34" },
  { id: 19, title: "The Innovator's Dilemma", author: "Christensen, Clayton", subject: "Business", availability: "Available", isbn: "978-0-87584-585-2", borrowCount: 608, rating: 4.6, description: "When new technologies cause great firms to fail", publishYear: 1997, edition: "2nd Edition", location: "B-06-78" },
  { id: 20, title: "The Lean Startup", author: "Ries, Eric", subject: "Business", availability: "Borrowed", isbn: "978-0-307-88789-4", borrowCount: 606, rating: 4.7, description: "How today's entrepreneurs use continuous innovation", publishYear: 2011, edition: "1st Edition", location: "B-04-56", dueDate: "2025-11-08" },
  // Adding more books for a richer dataset
  { id: 21, title: "The Origin of Species", author: "Darwin, Charles", subject: "Science", availability: "Available", isbn: "978-0-14-043205-1", borrowCount: 575, rating: 4.8, description: "On the origin of species by means of natural selection", publishYear: 1859, edition: "Annotated Edition", location: "S-03-89" },
  { id: 22, title: "The Story of Art", author: "Gombrich, E.H.", subject: "Arts", availability: "Available", isbn: "978-0-7148-3355-2", borrowCount: 630, rating: 4.9, description: "The world's most popular art book", publishYear: 1950, edition: "16th Edition", location: "A-07-45" },
  { id: 23, title: "Thinking, Fast and Slow", author: "Kahneman, Daniel", subject: "Psychology", availability: "Available", isbn: "978-0-374-53355-7", borrowCount: 609, rating: 4.7, description: "The two systems that drive the way we think", publishYear: 2011, edition: "1st Edition", location: "P-05-23" },
  { id: 24, title: "To Kill a Mockingbird", author: "Lee, Harper", subject: "Literature", availability: "Available", isbn: "978-0-06-112008-4", borrowCount: 642, rating: 4.9, description: "A gripping tale of racial injustice and childhood", publishYear: 1960, edition: "50th Anniversary", location: "L-11-67" },
  { id: 25, title: "Ways of Seeing", author: "Berger, John", subject: "Arts", availability: "Borrowed", isbn: "978-0-14-013515-1", borrowCount: 592, rating: 4.6, description: "About looking and seeing and the way we see", publishYear: 1972, edition: "1st Edition", location: "A-09-78", dueDate: "2025-11-12" },
];

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState('All')
    const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'borrowCount'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'borrowed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications] = useState([
    { id: 1, type: 'due', message: 'JavaScript: The Good Parts due in 3 days', priority: 'high' },
    { id: 2, type: 'available', message: 'Clean Architecture is now available', priority: 'medium' },
    { id: 3, type: 'recommendation', message: '5 new books recommended for you', priority: 'low' },
  ]);
  const navigate = useNavigate()

  // Load books data on component mount with loading simulation
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setBooks(LIBRARY_BOOKS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : 'ST'
  const userName = user.email ? user.email.split('@')[0] : 'Student'

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.includes(searchTerm);
      return matchesSubject && matchesSearch;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title) * multiplier;
        case 'author': return a.author.localeCompare(b.author) * multiplier;
        case 'rating': return (a.rating - b.rating) * multiplier;
        case 'borrowCount': return (a.borrowCount - b.borrowCount) * multiplier;
        default: return 0;
      }
    });

  const quickActions: QuickAction[] = [
    { id: 'search', label: 'Quick Search', icon: '🔍', description: 'Find books instantly', action: () => setActiveSection('explore') },
    { id: 'renew', label: 'Renew Books', icon: '🔄', description: 'Extend due dates', action: () => setActiveSection('my-books') },
    { id: 'reserve', label: 'Reserve Book', icon: '📖', description: 'Hold a book for pickup', action: () => setActiveSection('explore') },
    { id: 'history', label: 'Reading History', icon: '📚', description: 'View your borrowing history', action: () => setActiveSection('my-books') },
  ];

  const sidebarItems = [
    { 
      id: 'dashboard', 
      icon: '🏠', 
      label: 'Dashboard', 
      description: 'Overview & quick actions',
      badge: notifications.length
    },
    { 
      id: 'explore', 
      icon: '🔍', 
      label: 'Explore Collection', 
      description: 'Browse & search books' 
    },
    { 
      id: 'my-books', 
      icon: '📚', 
      label: 'My Books', 
      description: 'Current & past borrowings',
      badge: 3
    },
    { 
      id: 'popular-books', 
      icon: '🔥', 
      label: 'Trending Books', 
      description: 'Most popular titles' 
    },
    { 
      id: 'popular-authors', 
      icon: '✍️', 
      label: 'Popular Authors', 
      description: 'Top authors & their works' 
    },
    { 
      id: 'borrowing-trends', 
      icon: '📈', 
      label: 'Analytics', 
      description: 'Usage insights & trends' 
    },
    { 
      id: 'recommendations', 
      icon: '💡', 
      label: 'Recommendations', 
      description: 'Personalized suggestions',
      badge: 5
    }
  ];

  const renderLoadingState = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-content">
        <h3>Loading your library dashboard...</h3>
        <p>Fetching the latest book information</p>
      </div>
    </div>
  );

  const renderDashboardOverview = () => (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Ready to dive into your next great read? Here's what's happening in your library world.</p>
        </div>
        <div className="current-time">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="notifications-panel">
        <h3>📢 Your Notifications</h3>
        <div className="notification-list">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification-item ${notification.priority}`}>
              <div className="notification-icon">
                {notification.type === 'due' && '⏰'}
                {notification.type === 'available' && '✅'}
                {notification.type === 'recommendation' && '💡'}
              </div>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">2 hours ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>⚡ Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className="quick-action-card"
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.label}</h4>
                <p>{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{LIBRARY_STATS.totalBooks.toLocaleString()}</h3>
            <p>Total Books Available</p>
            <span className="stat-trend">+12 new this week</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{LIBRARY_STATS.availableBooks.toLocaleString()}</h3>
            <p>Currently Available</p>
            <span className="stat-trend">Ready to borrow</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Your Current Books</p>
            <span className="stat-trend">2 due soon</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>4.7</h3>
            <p>Avg. Book Rating</p>
            <span className="stat-trend">High quality collection</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>📖 Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon borrowed">📚</div>
            <div className="activity-content">
              <p><strong>Borrowed:</strong> JavaScript: The Good Parts</p>
              <span className="activity-time">3 days ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon returned">✅</div>
            <div className="activity-content">
              <p><strong>Returned:</strong> Clean Code</p>
              <span className="activity-time">1 week ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon reviewed">⭐</div>
            <div className="activity-content">
              <p><strong>Reviewed:</strong> Introduction to Algorithms (5 stars)</p>
              <span className="activity-time">2 weeks ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="content-section">
            {/* Welcome Hero Section */}
            <div className="hero-section">
              <div className="hero-content">
                <div className="hero-text">
                  <h1>Welcome to Library BI, Student!</h1>
                  <p>📚 Manage your library resources with confidence</p>
                  <div className="hero-stats">
                    <span className="hero-stat">📊 System Status: <strong>Active</strong></span>
                    <span className="hero-stat">🔒 Records: <strong>Secure</strong></span>
                  </div>
                </div>
                <div className="hero-icon">
                  <div className="user-avatar-large">{userInitials}</div>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="stats-cards-grid">
              <div className="stat-card green">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3>Available Books</h3>
                  <div className="stat-number">{LIBRARY_STATS.availableBooks.toLocaleString()}</div>
                  <div className="stat-label">📈 Ready to borrow</div>
                </div>
              </div>
              
              <div className="stat-card blue">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h3>Borrowed Books</h3>
                  <div className="stat-number">{LIBRARY_STATS.borrowedBooks.toLocaleString()}</div>
                  <div className="stat-label">📊 Currently out</div>
                </div>
              </div>
              
              <div className="stat-card purple">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Total Collection</h3>
                  <div className="stat-number">{LIBRARY_STATS.totalBooks.toLocaleString()}</div>
                  <div className="stat-label">⭐ Books in library</div>
                </div>
              </div>
              
              <div className="stat-card orange">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>Daily Borrows</h3>
                  <div className="stat-number">{LIBRARY_STATS.dailyBorrows}</div>
                  <div className="stat-label">⭐ Books per day</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions-grid">
                <button 
                  className="quick-action-card green"
                  onClick={() => setActiveSection('explore')}
                >
                  <div className="action-icon">📚</div>
                  <span>Browse Books</span>
                </button>
                
                <button 
                  className="quick-action-card purple"
                  onClick={() => setActiveSection('my-books')}
                >
                  <div className="action-icon">📖</div>
                  <span>My Library</span>
                </button>
                
                <button 
                  className="quick-action-card orange"
                  onClick={() => setActiveSection('trending')}
                >
                  <div className="action-icon">🔥</div>
                  <span>Trending</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
              <h3>📈 Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon green">📚</div>
                  <div className="activity-content">
                    <h4>New books added to Computer Science</h4>
                    <p>5 new titles available in your favorite subject</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon blue">📊</div>
                  <div className="activity-content">
                    <h4>Your reading statistics updated</h4>
                    <p>Check out your progress and achievements</p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon purple">🏆</div>
                  <div className="activity-content">
                    <h4>Achievement unlocked!</h4>
                    <p>You've become a top reader this month</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'explore':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>🔍 Explore Library Collection</h2>
              <p>Discover and search through our extensive collection of {LIBRARY_STATS.totalBooks.toLocaleString()} books across {LIBRARY_STATS.totalSubjects} subjects</p>
            </div>

            {/* Enhanced Stats Overview */}
            <div className="collection-stats-enhanced">
              <div className="stat-item-modern available">
                <div className="stat-icon-modern">📚</div>
                <div className="stat-details">
                  <span className="stat-number-modern">{LIBRARY_STATS.availableBooks.toLocaleString()}</span>
                  <span className="stat-label-modern">Available Books</span>
                  <span className="stat-trend-modern">Ready to borrow</span>
                </div>
              </div>
              <div className="stat-item-modern borrowed">
                <div className="stat-icon-modern">📖</div>
                <div className="stat-details">
                  <span className="stat-number-modern">{LIBRARY_STATS.borrowedBooks.toLocaleString()}</span>
                  <span className="stat-label-modern">Currently Borrowed</span>
                  <span className="stat-trend-modern">In circulation</span>
                </div>
              </div>
              <div className="stat-item-modern subjects">
                <div className="stat-icon-modern">📂</div>
                <div className="stat-details">
                  <span className="stat-number-modern">{LIBRARY_STATS.totalSubjects}</span>
                  <span className="stat-label-modern">Subject Areas</span>
                  <span className="stat-trend-modern">Diverse collection</span>
                </div>
              </div>
              <div className="stat-item-modern filtered">
                <div className="stat-icon-modern">🔍</div>
                <div className="stat-details">
                  <span className="stat-number-modern">{filteredAndSortedBooks.length}</span>
                  <span className="stat-label-modern">Search Results</span>
                  <span className="stat-trend-modern">Current view</span>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="filters-section-enhanced">
              <div className="filters-header">
                <h3>🎯 Filter & Search</h3>
                <p>Find exactly what you're looking for</p>
              </div>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="subject-select">📚 Subject Category</label>
                  <select 
                    id="subject-select"
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="filter-select-modern"
                  >
                    {SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="search-input">🔍 Search Books</label>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search by title, author, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-modern"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="sort-select">📊 Sort By</label>
                  <select 
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'rating' | 'borrowCount')}
                    className="filter-select-modern"
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="author">Author (A-Z)</option>
                    <option value="rating">Rating (High-Low)</option>
                    <option value="borrowCount">Popularity (Most Borrowed)</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="availability-filter">✅ Availability</label>
                  <select 
                    id="availability-filter"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'borrowed')}
                    className="filter-select-modern"
                  >
                    <option value="all">All Books</option>
                    <option value="available">Available Only</option>
                    <option value="borrowed">Borrowed Only</option>
                  </select>
                </div>
              </div>

              {/* Quick Subject Buttons */}
              <div className="subject-quick-filters">
                <span className="quick-filter-label">Quick Filters:</span>
                {['All', 'Computer Science', 'Literature', 'Science', 'Business', 'Mathematics'].map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`subject-quick-btn ${selectedSubject === subject ? 'active' : ''}`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Books Grid */}
            <div className="books-section-enhanced">
              <div className="books-header">
                <h3>📖 Book Collection</h3>
                <div className="view-options">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  >
                    ⊞ Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  >
                    ☰ List
                  </button>
                </div>
              </div>

              <div className={`books-display ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                {filteredAndSortedBooks.map(book => (
                  <div key={book.id} className={`book-card-enhanced ${viewMode}`}>
                    <div className="book-cover">
                      <div className="book-cover-placeholder">
                        📚
                      </div>
                      <div className={`availability-indicator ${book.availability.toLowerCase()}`}>
                        {book.availability === 'Available' ? '✅' : '📚'}
                      </div>
                    </div>
                    
                    <div className="book-content">
                      <div className="book-header-enhanced">
                        <h4 className="book-title-enhanced">{book.title}</h4>
                        <div className="book-rating-enhanced">
                          <span className="rating-stars">
                            {'★'.repeat(Math.floor(book.rating))}{'☆'.repeat(5 - Math.floor(book.rating))}
                          </span>
                          <span className="rating-number">{book.rating}</span>
                        </div>
                      </div>
                      
                      <p className="book-author-enhanced">👤 {book.author}</p>
                      <p className="book-subject-enhanced">📂 {book.subject}</p>
                      <p className="book-description-enhanced">{book.description}</p>
                      
                      <div className="book-footer-enhanced">
                        <div className="book-stats-enhanced">
                          <span className="borrow-stat">📊 {book.borrowCount} borrows</span>
                          <span className="isbn-stat">🔖 {book.isbn}</span>
                        </div>
                        
                        <div className="book-actions">
                          {book.availability === 'Available' ? (
                            <button className="action-btn primary">
                              📖 Borrow
                            </button>
                          ) : (
                            <button className="action-btn secondary">
                              ⏰ Reserve
                            </button>
                          )}
                          <button className="action-btn outline">
                            ❤️ Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredAndSortedBooks.length === 0 && (
                <div className="no-results-enhanced">
                  <div className="no-results-icon-enhanced">🔍</div>
                  <h3>No books found</h3>
                  <p>Try adjusting your search criteria or browse different subjects.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSubject('All');
                      setAvailabilityFilter('all');
                    }}
                    className="reset-filters-btn"
                  >
                    🔄 Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'popular-books':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>🔥 Most Popular Books</h2>
              <p>Interactive charts showing the most borrowed books with filtering options</p>
            </div>
            
            <div className="chart-filters">
              <select className="chart-filter-select">
                <option>This Month</option>
                <option>This Semester</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
              <select className="chart-filter-select">
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Literature</option>
                <option>Science</option>
                <option>Business</option>
              </select>
            </div>
            
            <div className="chart-container">
              <TopBooksChart subject={selectedSubject} />
            </div>
          </div>
        );

      case 'popular-authors':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>✍️ Popular Authors</h2>
              <p>Discover which authors are most popular among readers with interactive visualizations</p>
            </div>
            
            <div className="chart-container">
              <TopAuthorsChart />
            </div>
            
            <div className="authors-insight">
              <h3>📊 Author Insights</h3>
              <div className="insight-cards">
                <div className="insight-card">
                  <h4>Most Borrowed Author</h4>
                  <p><strong>Alex Chen</strong> - 52 total borrows</p>
                  <span className="insight-trend">↗️ +15% this month</span>
                </div>
                <div className="insight-card">
                  <h4>Rising Star</h4>
                  <p><strong>Jane Doe</strong> - Mathematics specialist</p>
                  <span className="insight-trend">🚀 +40% growth</span>
                </div>
                <div className="insight-card">
                  <h4>Classic Favorite</h4>
                  <p><strong>Sarah Wilson</strong> - Literature expert</p>
                  <span className="insight-trend">📚 Consistent popularity</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'borrowing-trends':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>📈 Borrowing Trends</h2>
              <p>Analyze borrowing patterns and identify peak usage times throughout the academic year</p>
            </div>
            
            <div className="trends-summary">
              <div className="trend-stat">
                <h3>� Peak Season</h3>
                <p>November - December</p>
                <span className="trend-note">Exam preparation period</span>
              </div>
              <div className="trend-stat">
                <h3>📈 Growth Rate</h3>
                <p>+23% YoY</p>
                <span className="trend-note">Digital adoption</span>
              </div>
              <div className="trend-stat">
                <h3>⏰ Peak Hours</h3>
                <p>2:00 PM - 4:00 PM</p>
                <span className="trend-note">After lunch study time</span>
              </div>
            </div>
            
            <div className="chart-container">
              <BorrowingTrendChart subject={selectedSubject} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container-modern">
      {/* Header */}
      <header className="dashboard-header-modern">
        <div className="header-content">
          <div className="header-left">
            <h1>🏛️ Library BI Portal</h1>
            <p>Welcome back, explore your personalized library dashboard</p>
          </div>
          <div className="header-right">
            <div className="header-search">
              <input
                type="text"
                placeholder="🔍 Search anything..."
                className="global-search"
              />
            </div>
            <div className="header-notifications">
              <button className="notification-btn">
                🔔
                <span className="notification-badge">3</span>
              </button>
            </div>
            <div className="user-menu">
              <div className="user-info">
                <span className="user-greeting">Hello, Student!</span>
                <div className="user-avatar-header">{userInitials}</div>
              </div>
              <button onClick={handleLogout} className="logout-btn-modern">
                <span className="logout-icon">🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-layout-sidebar">
        {/* Sidebar Navigation */}
        <aside className="sidebar-nav">
          <div className="sidebar-header">
            <h2>🧭 Navigation</h2>
            <p>Explore library resources</p>
          </div>
          
          <nav className="sidebar-menu">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SidebarSection)}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-icon">{item.icon}</span>
                  <div className="sidebar-text">
                    <span className="sidebar-label">{item.label}</span>
                    <span className="sidebar-description">{item.description}</span>
                  </div>
                </div>
                {activeSection === item.id && <div className="active-indicator"></div>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content-sidebar">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
