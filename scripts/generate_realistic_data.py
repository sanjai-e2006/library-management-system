"""
Enhanced SF Library Data Generator
Since the Kaggle dataset contains patron data rather than book checkout data,
this script will generate realistic book checkout data based on the patron data
and create the tables we need for our BI dashboard.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from pathlib import Path

# Sample book data
BOOKS_DATA = [
    # Computer Science
    ("Introduction to Algorithms", "Cormen, Thomas H.", "Computer Science"),
    ("Clean Code", "Martin, Robert C.", "Computer Science"),
    ("Design Patterns", "Gang of Four", "Computer Science"),
    ("Python Programming", "Lutz, Mark", "Computer Science"),
    ("JavaScript: The Good Parts", "Crockford, Douglas", "Computer Science"),
    ("Machine Learning Yearning", "Ng, Andrew", "Computer Science"),
    
    # Business
    ("The Lean Startup", "Ries, Eric", "Business"),
    ("Good to Great", "Collins, Jim", "Business"),
    ("The Innovator's Dilemma", "Christensen, Clayton", "Business"),
    ("Thinking, Fast and Slow", "Kahneman, Daniel", "Business"),
    ("The Art of War", "Sun Tzu", "Business"),
    
    # Literature
    ("1984", "Orwell, George", "Literature"),
    ("To Kill a Mockingbird", "Lee, Harper", "Literature"),
    ("The Great Gatsby", "Fitzgerald, F. Scott", "Literature"),
    ("Pride and Prejudice", "Austen, Jane", "Literature"),
    ("The Catcher in the Rye", "Salinger, J.D.", "Literature"),
    
    # Science
    ("A Brief History of Time", "Hawking, Stephen", "Science"),
    ("The Origin of Species", "Darwin, Charles", "Science"),
    ("Cosmos", "Sagan, Carl", "Science"),
    ("The Double Helix", "Watson, James", "Science"),
    
    # History
    ("Sapiens", "Harari, Yuval Noah", "History"),
    ("The Guns of August", "Tuchman, Barbara", "History"),
    ("A People's History", "Zinn, Howard", "History"),
    
    # Arts
    ("Ways of Seeing", "Berger, John", "Arts"),
    ("The Story of Art", "Gombrich, E.H.", "Arts"),
]

# Department mapping
SUBJECT_TO_DEPT = {
    "Computer Science": "Computer Science",
    "Business": "Business",
    "Literature": "Literature", 
    "Science": "Science",
    "History": "History",
    "Arts": "Arts"
}

def load_patron_data():
    """Load the actual patron data"""
    patron_file = Path(__file__).parent / 'sf-library-usage-data.csv'
    if not patron_file.exists():
        print(f"Patron data not found: {patron_file}")
        return None
    return pd.read_csv(patron_file)

def generate_book_checkouts(patron_df, num_checkouts=10000):
    """Generate realistic book checkout data based on patron patterns"""
    
    books_df = pd.DataFrame(BOOKS_DATA, columns=['Title', 'Author', 'Subject'])
    
    # Create checkout records
    checkouts = []
    
    # Get unique patrons (simulate patron IDs)
    unique_patrons = patron_df.drop_duplicates(subset=['Patron Type Definition', 'Age Range', 'Home Library Definition'])
    
    print(f"Generating {num_checkouts} checkout records...")
    
    for i in range(num_checkouts):
        # Random patron
        patron = unique_patrons.sample(1).iloc[0]
        
        # Random book (weighted by subject popularity)
        subject_weights = {
            "Computer Science": 0.25,
            "Business": 0.20,
            "Literature": 0.20,
            "Science": 0.15,
            "History": 0.12,
            "Arts": 0.08
        }
        
        subject = np.random.choice(list(subject_weights.keys()), p=list(subject_weights.values()))
        subject_books = books_df[books_df['Subject'] == subject]
        book = subject_books.sample(1).iloc[0]
        
        # Random checkout date (last 2 years)
        start_date = datetime(2022, 1, 1)
        end_date = datetime(2024, 10, 1)
        checkout_date = start_date + timedelta(
            days=random.randint(0, (end_date - start_date).days)
        )
        
        checkout = {
            'patron_id': f"P{i % 1000:04d}",  # Simulate patron IDs
            'patron_type': patron['Patron Type Definition'],
            'age_range': patron['Age Range'],
            'home_library': patron['Home Library Definition'],
            'title': book['Title'],
            'author': book['Author'],
            'subject': book['Subject'],
            'department': SUBJECT_TO_DEPT[book['Subject']],
            'checkout_year': checkout_date.year,
            'checkout_month': checkout_date.month,
            'checkout_date': checkout_date.strftime('%Y-%m-%d'),
            'material_type': 'Book',
            'checkout_type': 'Regular'
        }
        checkouts.append(checkout)
    
    return pd.DataFrame(checkouts)

def create_aggregated_tables(checkouts_df):
    """Create aggregated tables for BI dashboard"""
    
    # 1. Books aggregated (for student dashboard)
    books_agg = checkouts_df.groupby(['title', 'author', 'subject', 'department']).agg({
        'patron_id': 'count',
        'checkout_year': 'first',
        'checkout_month': 'first'
    }).rename(columns={'patron_id': 'borrow_count'}).reset_index()
    
    # 2. Monthly borrowing trends
    monthly_trends = checkouts_df.groupby(['checkout_year', 'checkout_month', 'subject']).agg({
        'patron_id': 'count'
    }).rename(columns={'patron_id': 'checkout_count'}).reset_index()
    
    # 3. Department-wise borrowing
    dept_borrowing = checkouts_df.groupby(['department', 'checkout_year', 'checkout_month']).agg({
        'patron_id': 'count'
    }).rename(columns={'patron_id': 'checkout_count'}).reset_index()
    
    # 4. Top borrowing students (simulated)
    student_borrowing = checkouts_df.groupby(['patron_id', 'patron_type', 'age_range', 'home_library']).agg({
        'title': 'count'
    }).rename(columns={'title': 'total_checkouts'}).reset_index()
    
    # 5. Author popularity
    author_popularity = checkouts_df.groupby(['author', 'subject']).agg({
        'patron_id': 'count'
    }).rename(columns={'patron_id': 'borrow_count'}).reset_index()
    
    return {
        'books_agg': books_agg,
        'monthly_trends': monthly_trends,
        'dept_borrowing': dept_borrowing,
        'student_borrowing': student_borrowing,
        'author_popularity': author_popularity,
        'raw_checkouts': checkouts_df
    }

def main():
    """Main processing function"""
    
    # Load patron data
    patron_df = load_patron_data()
    if patron_df is None:
        print("Cannot proceed without patron data")
        return
    
    print(f"Loaded {len(patron_df)} patron records")
    
    # Generate checkout data
    checkouts_df = generate_book_checkouts(patron_df, num_checkouts=15000)
    
    # Create aggregated tables
    tables = create_aggregated_tables(checkouts_df)
    
    # Save to CSV files
    output_dir = Path(__file__).parent / 'out'
    output_dir.mkdir(exist_ok=True)
    
    for name, df in tables.items():
        output_file = output_dir / f'{name}.csv'
        df.to_csv(output_file, index=False)
        print(f"Saved {len(df)} records to {output_file}")
    
    # Summary statistics
    print("\n=== DATA SUMMARY ===")
    print(f"Total checkouts generated: {len(checkouts_df)}")
    print(f"Unique books: {checkouts_df['title'].nunique()}")
    print(f"Unique authors: {checkouts_df['author'].nunique()}")
    print(f"Subjects: {checkouts_df['subject'].nunique()}")
    print(f"Date range: {checkouts_df['checkout_date'].min()} to {checkouts_df['checkout_date'].max()}")
    
    print(f"\nCheckouts by subject:")
    print(checkouts_df['subject'].value_counts())

if __name__ == "__main__":
    main()