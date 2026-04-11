import sqlite3
import csv
import os

con = sqlite3.connect("library.db")
cur = con.cursor()

csv_folder = "LMSDataset"

column_mapping = {
    "BOOK": {"book_publisher": "publisher_name"}
}

for filename in os.listdir(csv_folder):
    if filename.endswith(".csv"):
        table_name = filename[:-4].upper()
        filepath = os.path.join(csv_folder, filename)

        with open(filepath, newline='', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            columns = reader.fieldnames

            if table_name in column_mapping:
                columns = [column_mapping[table_name].get(col, col) for col in columns]

            placeholders = ", ".join(["?" for _ in columns])
            col_names = ", ".join(columns)
            sql = f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})"

            for row in reader:
                values = [row[col] for col in reader.fieldnames]
                cur.execute(sql, values)

con.commit()
con.close()
