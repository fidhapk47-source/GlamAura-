from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Product
# Create your views here.
class AdminProductView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        data = []

        for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "subtitle": p.subtitle,
                "category": p.category,
                "image": request.build_absolute_uri(p.image.url), 
                "new_price": float(p.new_price),
                "old_price": float(p.old_price),
            })

        return Response(data)

    def post(self, request):
        Product.objects.create(
            name=request.data.get("name"),
            subtitle=request.data.get("subtitle"),
            category=request.data.get("category"),
            image=request.FILES.get("image"), 
            new_price=request.data.get("new_price"),
            old_price=request.data.get("old_price"),
        )
        return Response({"message": "Product added"})
    
class AdminProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        p = Product.objects.get(id=id)

        p.name = request.data.get("name")
        p.subtitle = request.data.get("subtitle")
        p.category = request.data.get("category")
        p.new_price = request.data.get("new_price")
        p.old_price = request.data.get("old_price")

        if request.FILES.get("image"):
            p.image = request.FILES.get("image")

        p.save()

        return Response({"message": "Updated"})

    def delete(self, request, id):
        Product.objects.get(id=id).delete()
        return Response({"message": "Deleted"})