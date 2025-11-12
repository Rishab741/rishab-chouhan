# 1. Start with a lean official Python image
FROM python:3.11-slim

# 2. Set a working directory inside the container
WORKDIR /app

# 3. Copy only the requirements file first for layer caching
COPY requirements.txt .

# 4. Install all your Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy your application's source code into the container
# This copies your 'src' folder into the container's 'app' directory
COPY ./src ./src

# 6. Expose the port your FastAPI app runs on
EXPOSE 8000

# 7. Define the command to run your application
# This is the same command we used to fix your server, now containerized!
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]