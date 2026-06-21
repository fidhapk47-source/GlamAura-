from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
# from .serializer import ProductSerializer
from .models import Product, CartItem, WishlistItem

from .serializer import ProductSerializer
# class ProductView(APIView):

#     def get(self, request):
#         products = Product.objects.all()
#         data = []

#         for p in products:
#             data.append({
#                 "id": p.id,
#                 "name": p.name,
#                 "category": p.category,
#                 "image": p.image.url if p.image else "",
#                 "old_price": str(p.old_price),
#                 "new_price": str(p.new_price),
#             })
#         return Response(data)
    
#     def post(self, request):
#         serializer = ProductSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)

#     # ✅ UPDATE
#     def put(self, request, id):
#         try:
#             product = Product.objects.get(id=id)
#         except Product.DoesNotExist:
#             return Response({"error": "Not found"}, status=404)

#         serializer = ProductSerializer(product, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)

#     # ✅ DELETE
#     def delete(self, request, id):
#         try:
#             product = Product.objects.get(id=id)
#         except Product.DoesNotExist:
#             return Response({"error": "Not found"}, status=404)

#         product.delete()
#         return Response({"message": "Deleted"}, status=204)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  

        cart_items = CartItem.objects.filter(user=user)
        data = []

        for item in cart_items:
            data.append({
                "id": item.id,
                "product_id": item.product.id,
                "name": item.product.name,
                "image": item.product.image.url if item.product.image else "",
                "price": str(item.product.new_price),
                "quantity": item.qty,
            })

        return Response(data)


class IncreaseCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        item = CartItem.objects.get(id=id, user=request.user)
        item.qty += 1
        item.save()
        return Response({"message": "increased"})



class DecreaseCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        item = CartItem.objects.get(id=id, user=request.user)

        if item.qty > 1:
            item.qty -= 1
            item.save()
        else:
            item.delete()

        return Response({"message": "decreased"})


class RemoveCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        item = CartItem.objects.get(id=id, user=request.user)
        item.delete()
        return Response({"message": "removed"})

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")

        if not product_id:
            return Response({"error": "product_id required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product=product,
            defaults={"qty": 1}
        )

        if not created:
            cart_item.qty += 1
            cart_item.save()

        return Response({"message": "Added to cart"}, status=201)



class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist_items = WishlistItem.objects.filter(user=request.user)

        data = []
        for item in wishlist_items:
            data.append({
                "id": item.id,
                "product_id": item.product.id,
                "name": item.product.name,
                "image": item.product.image.url if item.product.image else "",
                "price": str(item.product.new_price),
            })

        return Response(data)



class AddToWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        WishlistItem.objects.get_or_create(
            user=request.user,
            product=product
        )
# duplicatine avoid chyaan ee
        return Response({"message": "Added to wishlist"}, status=201)



class RemoveWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        item = WishlistItem.objects.get(id=id, user=request.user)
        item.delete()
        return Response({"message": "removed"})
    


class ProductDetailView(APIView):
    def get(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        data = {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "image": product.image.url if product.image else "",
            "old_price": str(product.old_price),
            "new_price": str(product.new_price),
            "description": getattr(product, "description", ""),
        }
        return Response(data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # ✅ UPDATE
    def put(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # ✅ DELETE
    def delete(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        product.delete()
        return Response({"message": "Deleted"}, status=204)

    
class ProductView(APIView):
    def get(self, request):
        products = Product.objects.all()

        data = []
        for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "image": p.image.url if p.image else "",
                "old_price": str(p.old_price),
                "new_price": str(p.new_price),
            })

        return Response(data)
    
    def post(self, request):
        serializer = ProductSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    

    
class NewArrivalView(APIView):
    def get(self, request):
        products = Product.objects.filter(category__iexact="new-arrivals")

        data = []
        for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "image": p.image.url if p.image else "",
                "new_price": str(p.new_price),
            })

        return Response(data)
    
class CategoryListView(APIView):
    def get(self, request):
        categories = Product.objects.values_list("category", flat=True).distinct()
        return Response(list(categories))
    

