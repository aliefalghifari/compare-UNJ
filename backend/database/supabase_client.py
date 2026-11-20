
import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"

# print("ENV path:", ENV_PATH)
# print("ENV exists:", ENV_PATH.exists())

load_dotenv(ENV_PATH, override=True)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")

# print("URL ditemukan:", bool(url))
# print("KEY ditemukan:", bool(key))

if not url or not key:
    raise ValueError("Supabase credentials tidak ditemukan")

supabase: Client = create_client(url, key)
