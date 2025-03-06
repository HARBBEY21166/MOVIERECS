# Movie Recommendation App Backend

This is the backend API for the Movie Recommendation App, built with Django REST Framework.

## Features

- User authentication with JWT
- Movie recommendations from TMDB API
- Favorite movies management
- API documentation with Swagger

## Setup

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your configuration
6. Run migrations: `python manage.py migrate`
7. Create a superuser: `python manage.py createsuperuser`
8. Run the server: `python manage.py runserver`

## Docker Setup

1. Make sure Docker and Docker Compose are installed
2. Copy `.env.example` to `.env` and fill in your configuration
3. Run `docker-compose up -d`
4. Access the API at http://localhost:8000/api/

## API Documentation

API documentation is available at `/api/docs/` when the server is running.

## API Endpoints

- `POST /api/users/signup/` - Register a new user
- `POST /api/users/login/` - Login and get JWT tokens
- `GET /api/movies/trending/` - Get trending movies
- `GET /api/movies/recommendations/{movie_id}/` - Get movie recommendations
- `GET /api/favorites/` - Get user's favorite movies
- `POST /api/favorites/` - Add a movie to favorites
- `DELETE /api/favorites/{movie_id}/` - Remove a movie from favorites

