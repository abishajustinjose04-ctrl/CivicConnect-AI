import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="civicconnect_db",
    user="postgres",
    password="hack@123",
    port="5432"
)

cursor = conn.cursor()

print("✅ Database Connected Successfully!")