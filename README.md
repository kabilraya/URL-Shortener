# URL Shortener

A complete full‑stack URL Shortener application with Docker support.
This project lets you generate short URLs from long URLs and includes rate‑limiting to prevent abuse.

## Features

- Shorten long URLs into compact links

- Redirect shortened URLs to the original URLs

- IP‑based rate limiting using a sliding window algorithm

- Backend service

- Frontend UI

- PostgreSQL database

- Docker Compose for easy local setup

## Requirements

Make sure you have installed:

- Docker

- Docker Compose

## Running with Docker Compose

- Clone the repo
  `git clone https://github.com/kabilraya/URL-Shortener.git`

  `cd URL-Shortener`

- Start Services or build containers

`docker-compose down -v`

`docker-compose up --build`

- Check if everything is working (DB, backend, frontend)
  Go to your browser and chekc if everthing is working.
- Backend API: http://localhost:8000

- Frontend app: http://localhost:5173

- PostgreSQL: exposed at localhost:5432
