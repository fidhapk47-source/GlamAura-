from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from products.models import Product
from payment.models import Order

from .permissions import IsAdminUserCustom

User = get_user_model()


# =======================
# 📊 DASHBOARD STATS
# =======================
class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):

        users_count = User.objects.count()
        products_count = Product.objects.count()
        orders_count = Order.objects.count()

        total_revenue = sum(order.total for order in Order.objects.all())

        recent_orders = Order.objects.order_by('-date')[:5]

        orders_data = []
        for order in recent_orders:
            orders_data.append({
                "id": order.id,
                "userId": order.user.id,
                "items": [item.product.name for item in order.items.all()],
                "total": order.total,
                "status": order.status,
                "date": order.date
            })

        return Response({
            "users": users_count,
            "products": products_count,
            "orders": orders_count,
            "income": total_revenue,
            "recentOrders": orders_data
        })


# =======================
# 👤 USERS MANAGEMENT
# =======================
class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        users = User.objects.all()

        data = []
        for u in users:
            data.append({
                "id": u.id,
                "email": u.email,
                "is_admin": u.is_staff,
                "is_active": u.is_active
            })

        return Response(data)

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()

            return Response({"message": "User status updated"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# =======================
# 📦 PRODUCTS MANAGEMENT
# =======================
class AdminProductsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        products = Product.objects.all()

        data = []
        for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "category": p.category
            })

        return Response(data)

    def post(self, request):
        name = request.data.get("name")
        price = request.data.get("price")
        category = request.data.get("category")

        product = Product.objects.create(
            name=name,
            price=price,
            category=category
        )

        return Response({"message": "Product created", "id": product.id})


class AdminProductDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def delete(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return Response({"message": "Deleted"})
        except Product.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# =======================
# 📦 ORDERS MANAGEMENT
# =======================
class AdminOrdersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        orders = Order.objects.all().order_by('-date')

        data = []
        for o in orders:
            data.append({
                "id": o.id,
                "user": o.user.email,
                "total": o.total,
                "status": o.status,
                "date": o.date,
                "items": [item.product.name for item in o.items.all()]
            })

        return Response(data)


class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def patch(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            order.status = request.data.get("status")
            order.save()

            return Response({"message": "Status updated"})
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)