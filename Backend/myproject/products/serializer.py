from rest_framework import serializers
from .models import Product, CartItem, WishlistItem
# from rest_framework import serializers
# from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get("request")

        # ✅ FIX: handle None request
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url  # fallback

        return ""


class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'qty']


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = WishlistItem
        fields = '__all__'