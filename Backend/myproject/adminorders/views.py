from rest_framework.generics import ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from payment.models import Order
from .serializers import OrderSerializer
from django.db.models import Q



class AdminOrderListView(ListAPIView):
    serializer_class = OrderSerializer  #o format define chyan
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        
        if not user.is_staff:
            return Order.objects.none()

        
        queryset = Order.objects.all().order_by("-created_at")

       
        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(id__icontains=search) |
                Q(user__username__icontains=search)
            )

        return queryset




class UpdateOrderStatusView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=403)

        order = Order.objects.get(id=pk)
        order.status = request.data.get("status", order.status)
        order.save()

        return Response({"message": "Updated"})



class DeleteOrderView(DestroyAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=403)

        order = Order.objects.get(id=pk)
        order.delete()

        return Response({"message": "Deleted"})