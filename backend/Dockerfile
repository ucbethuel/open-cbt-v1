FROM python:3.11.8-slim-bullseye

# Update package lists and upgrade installed packages to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

