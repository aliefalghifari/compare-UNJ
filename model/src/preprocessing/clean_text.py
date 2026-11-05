import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]/("datasets", "chat_customer_dummy_husin.csv")
DIRE_PATH = BASE_DIR/"chat_customer_dummy_husin.csv"
df = pd.read_csv(DIRE_PATH)

print(df.head(5))