# Use Python image
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose Flask port
EXPOSE 5050

# Run the app
CMD ["python", "model.py"]
