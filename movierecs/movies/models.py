from django.db import models
from django.conf import settings

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    movie_id = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    overview = models.TextField()
    poster = models.CharField(max_length=255)
    language = models.CharField(max_length=10)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie_id')

    def __str__(self):
        return f"{self.user.email} - {self.title}"

