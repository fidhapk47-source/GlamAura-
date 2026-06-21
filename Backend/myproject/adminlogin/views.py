from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Product
from app.models import CustomUser
from adminorders.models import Order
from rest_framework.generics import DestroyAPIView

User = get_user_model()

class AdminLoginView(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"detail": "User not found"}, status=401)

        if not user.check_password(password):
            return Response({"detail": "Wrong password"}, status=401)

        if not user.is_superuser:
            return Response({"detail": "Not admin"}, status=401)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "is_superuser": user.is_superuser
            }
        })
    
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        
        if not user.is_superuser:
            return Response({"detail": "Not authorized"}, status=403)

        
        data = {
            "users": User.objects.count(),
            "products": Product.objects.count(),
            "orders": Order.objects.count(),
            "income": 500000
        #     "recentOrders": [
        #         {
        #             "id": 1,
        #             "userId": 2,
        #             "items": ["Lipstick", "Cream"],
        #             "total": 1200,
        #             "status": "Delivered",
        #             "date": "2026-04-27"
        #         },
        #         {
        #             "id": 2,
        #             "userId": 3,
        #             "items": ["Facewash"],
        #             "total": 500,
        #             "status": "Pending",
        #             "date": "2026-04-26"
        #         }
        #     ]
        }

        return Response(data)
    
class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        users = User.objects.all()

        data = []
        for u in users:
            data.append({
                "id": u.id,
                "name": u.username,
                "email": u.email,
                "status": u.status,
                "role": u.role,
            })
        
        

        return Response(data)


class BlockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        user = User.objects.get(id=id)
        user.status = "blocked"
        user.save()

        return Response({"message": "User blocked"})


class UnblockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        user = User.objects.get(id=id)
        user.status = "active"
        user.save()

        return Response({"message": "User unblocked"})

class AdminUserDeleteView(DestroyAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        return super().destroy(request, *args, **kwargs)