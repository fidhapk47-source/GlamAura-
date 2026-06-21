from rest_framework import serializers
from .models import Order, OrderItem


# ✅ ORDER ITEM INPUT (for creating order)
class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


# ✅ CREATE ORDER SERIALIZER (already correct)
class CreateOrderSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)

    payment_method = serializers.ChoiceField(
        choices=["cod", "onlinepayment", "wallet"]
    )

    name = serializers.CharField(max_length=200)
    address = serializers.CharField()
    pincode = serializers.CharField(max_length=6)
    phone = serializers.CharField(max_length=10)


# =====================================================
# 🔥 NEW: ORDER ITEM OUTPUT (for viewing orders)
# =====================================================

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")
    product_image = serializers.ImageField(source="product.image")

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
        ]


# =====================================================
# 🔥 NEW: ORDER SERIALIZER (for admin & user view)
# =====================================================

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    username = serializers.CharField(source="user.username")

    class Meta:
        model = Order
        fields = [
            "id",
            "username",
            "name",
            "address",
            "pincode",
            "phone",
            "total_amount",
            "payment_method",
            "status",
            "created_at",
            "items",
        ]