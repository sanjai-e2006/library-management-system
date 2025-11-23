"""
Small data ingest and cleaning script for SF library usage dataset.
Usage:
  - Place `sf-library-usage-data.csv` next to this script.
  - Create a virtualenv and install requirements from requirements.txt
  - Run: python ingest_sf_library.py

Outputs cleaned CSVs ready for upload to Supabase.
"""
import pandas as pd
from pathlib import Path

DATA = Path(__file__).parent
INPUT = DATA / 'sf-library-usage-data.csv'
OUT_DIR = DATA / 'out'
OUT_DIR.mkdir(exist_ok=True)

if not INPUT.exists():
    print('Place sf-library-usage-data.csv in the scripts folder and re-run')
    raise SystemExit(1)

print('Loading...')
df = pd.read_csv(INPUT)
print('Initial rows:', len(df))

# normalize
df.columns = [c.strip() for c in df.columns]
cols_needed = [c for c in ['CheckoutType','MaterialType','Title','Subject','CheckoutYear','CheckoutMonth'] if c in df.columns]
df = df[cols_needed]

# drop missing
df = df.dropna(subset=['Title','Subject','CheckoutYear','CheckoutMonth'])

# derive borrow count per title
agg = df.groupby(['Title','Subject']).size().reset_index(name='BorrowCount')
# map months to semester
agg['CheckoutMonth'] = 0

# simple department mapping example
def map_department(subject):
    s = str(subject).lower()
    if 'computer' in s or 'program' in s: return 'Computer Science'
    if 'business' in s or 'econom' in s: return 'Business'
    if 'literature' in s or 'fiction' in s or 'poetry' in s: return 'Literature'
    return 'General'

agg['Department'] = agg['Subject'].apply(map_department)

# save outputs
agg.to_csv(OUT_DIR / 'books_agg.csv', index=False)
print('Wrote', OUT_DIR / 'books_agg.csv')

# monthly timeseries
if 'CheckoutYear' in df.columns and 'CheckoutMonth' in df.columns:
    ts = df.groupby(['CheckoutYear','CheckoutMonth','Subject']).size().reset_index(name='Count')
    ts.to_csv(OUT_DIR / 'borrow_timeseries.csv', index=False)
    print('Wrote', OUT_DIR / 'borrow_timeseries.csv')

print('Done')
