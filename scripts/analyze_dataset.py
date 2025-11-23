"""
SF Library Dataset Downloader and Analyzer
This script downloads the SF Library Usage dataset and analyzes its structure
to help refine our BI project data processing.
"""
import pandas as pd
import requests
from pathlib import Path
import zipfile
import os

# Dataset info from Kaggle
DATASET_URL = "https://data.sfgov.org/api/views/qzz6-2jup/rows.csv?accessType=DOWNLOAD"
DATA_DIR = Path(__file__).parent
RAW_FILE = DATA_DIR / 'sf-library-usage-data.csv'

def download_dataset():
    """Download the SF Library dataset"""
    print("Downloading SF Library Usage dataset...")
    try:
        response = requests.get(DATASET_URL, stream=True)
        response.raise_for_status()
        
        with open(RAW_FILE, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded to {RAW_FILE}")
        return True
    except Exception as e:
        print(f"Download failed: {e}")
        print("Please manually download from:")
        print("https://www.kaggle.com/datasets/datasf/sf-library-usage-data")
        print("and place as 'sf-library-usage-data.csv' in scripts folder")
        return False

def analyze_dataset():
    """Analyze the dataset structure"""
    if not RAW_FILE.exists():
        print(f"Dataset file not found: {RAW_FILE}")
        return None
    
    print(f"Analyzing {RAW_FILE}...")
    
    # Read sample
    df = pd.read_csv(RAW_FILE, nrows=1000)  # Sample first 1000 rows
    
    print("\n=== DATASET ANALYSIS ===")
    print(f"Shape: {df.shape}")
    print(f"\nColumns ({len(df.columns)}):")
    for i, col in enumerate(df.columns):
        print(f"  {i+1:2d}. {col}")
    
    print(f"\nData types:")
    print(df.dtypes)
    
    print(f"\nSample data (first 3 rows):")
    print(df.head(3).to_string())
    
    print(f"\nUnique values in key columns:")
    key_cols = ['CheckoutType', 'MaterialType'] if 'CheckoutType' in df.columns else []
    for col in key_cols:
        if col in df.columns:
            uniques = df[col].unique()[:10]  # First 10 unique values
            print(f"  {col}: {uniques}")
    
    return df

if __name__ == "__main__":
    # Try to download if not exists
    if not RAW_FILE.exists():
        download_dataset()
    
    # Analyze structure
    analyze_dataset()