FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set Flask to run on 5050
ENV PORT=5050

# Run on 0.0.0.0:5050, internally
CMD ["gunicorn", "--bind", "0.0.0.0:5050", "app:app"] 