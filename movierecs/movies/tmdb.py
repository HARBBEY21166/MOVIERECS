import requests
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class TMDBClient:
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL

    def _make_request(self, endpoint, params=None):
        if params is None:
            params = {}
        
        params['api_key'] = self.api_key
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"TMDB API request failed: {e}")
            return None

    def _format_movie(self, movie):
        return {
            'movie_id': str(movie.get('id')),
            'title': movie.get('title', ''),
            'overview': movie.get('overview', ''),
            'poster': movie.get('poster_path', ''),
            'language': movie.get('original_language', ''),
            'rating': float(movie.get('vote_average', 0))
        }

    def get_trending_movies(self):
        cache_key = 'trending_movies'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        endpoint = '/trending/movie/week'
        response = self._make_request(endpoint)
        
        if response and 'results' in response:
            movies = [self._format_movie(movie) for movie in response['results']]
            # Cache for 6 hours
            cache.set(cache_key, movies, 60 * 60 * 6)
            return movies
        
        return []

    def get_movie_recommendations(self, movie_id):
        cache_key = f'recommendations_{movie_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        endpoint = f'/movie/{movie_id}/recommendations'
        response = self._make_request(endpoint)
        
        if response and 'results' in response:
            movies = [self._format_movie(movie) for movie in response['results']]
            # Cache for 24 hours
            cache.set(cache_key, movies, 60 * 60 * 24)
            return movies
        
        return []

