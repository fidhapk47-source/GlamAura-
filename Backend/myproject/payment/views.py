from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from rest_framework import status

from .models import Order, OrderItem
from products.models import Product, CartItem   # ✅ IMPORT ADDED
from payment.utils import client
from .serializers import CreateOrderSerializer


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CreateOrderSerializer(data=request.data)

        # ✅ VALIDATION
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data

        user = request.user
        items = data["items"]
        payment_method = data["payment_method"]

        name = data["name"]
        address = data["address"]
        pincode = data["pincode"]
        phone = data["phone"]

        total = 0

        # ✅ CALCULATE TOTAL
        for item in items:
            try:
                product = Product.objects.get(id=item["product_id"])
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product ID {item['product_id']} not found"},
                    status=400
                )

            total += product.new_price * item["quantity"]

        # ✅ CREATE ORDER
        order = Order.objects.create(
            user=user,
            name=name,
            address=address,
            pincode=pincode,
            phone=phone,
            payment_method=payment_method,
            total_amount=total,
            status="pending"
        )

        # ✅ CREATE ORDER ITEMS + REMOVE FROM CART 🔥
        for item in items:
            product = Product.objects.get(id=item["product_id"])

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price=product.new_price
            )

            # 🔥 REMOVE FROM CART
            CartItem.objects.filter(
                user=user,
                product=product
            ).delete()

        razorpay_order = None

        # ✅ ONLINE PAYMENT
        if payment_method == "onlinepayment":
            razorpay_order = client.order.create({
                "amount": int(total * 100),
                "currency": "INR",
                "payment_capture": 1
            })

            order.razorpay_order_id = razorpay_order["id"]
            order.save()

        return Response({
            "order_id": order.id,
            "razorpay_order": razorpay_order
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        try:
            order = Order.objects.get(
                razorpay_order_id=data["razorpay_order_id"]
            )

            order.razorpay_payment_id = data["razorpay_payment_id"]
            order.status = "paid"
            order.save()

            return Response({"message": "Payment Success"})

        except:
            return Response({"message": "Payment Failed"}, status=400)