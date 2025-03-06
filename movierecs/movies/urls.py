from django.urls import path
from .views import TrendingMoviesView, MovieRecommendationsView

urlpatterns = [
    path('trending/', TrendingMoviesView.as_view(), name='trending-movies'),
    path('recommendations/<str:movie_id>/', MovieRecommendationsView.as_view(), name='movie-recommendations'),
]

