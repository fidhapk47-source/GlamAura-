from rest_framework import serializers
from payment.models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")
    product_image = serializers.ImageField(source="product.image")

    class Meta:
        model = OrderItem
        fields = ["id", "product_name", "product_image", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "username",
            "total_amount",
            "payment_method",
            "status",
            "created_at",
            "items",
        ]