from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .tmdb import TMDBClient
from .models import Favorite
from .serializers import FavoriteSerializer

class TrendingMoviesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tmdb_client = TMDBClient()
        movies = tmdb_client.get_trending_movies()
        return Response({"results": movies})

class MovieRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, movie_id):
        tmdb_client = TMDBClient()
        movies = tmdb_client.get_movie_recommendations(movie_id)
        return Response({"results": movies})

class FavoriteListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Movie saved as favorite"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavoriteDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_id):
        try:
            favorite = Favorite.objects.get(user=request.user, movie_id=movie_id)
            favorite.delete()
            return Response({"message": "Movie removed from favorites"}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({"error": "Movie not found in favorites"}, status=status.HTTP_404_NOT_FOUND)

