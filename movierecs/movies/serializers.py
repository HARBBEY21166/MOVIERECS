from rest_framework import serializers
from .models import Favorite

class MovieSerializer(serializers.Serializer):
    movie_id = serializers.CharField()
    title = serializers.CharField()
    overview = serializers.CharField()
    poster = serializers.CharField()
    language = serializers.CharField()
    rating = serializers.DecimalField(max_digits=3, decimal_places=1)

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('movie_id', 'title', 'overview', 'poster', 'language', 'rating')
        read_only_fields = ('user',)

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Check if favorite already exists
        try:
            favorite = Favorite.objects.get(user=user, movie_id=validated_data['movie_id'])
            return favorite
        except Favorite.DoesNotExist:
            return super().create(validated_data)

