FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install pipenv
RUN pip install pipenv

# Copy dependency files
COPY Pipfile Pipfile.lock ./

# Install dependencies
RUN pipenv install --deploy --system

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app

EXPOSE 5000

# Run the application
CMD ["python", "api.py"]