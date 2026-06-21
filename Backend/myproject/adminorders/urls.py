from django.urls import path
from .views import AdminOrderListView, UpdateOrderStatusView, DeleteOrderView

urlpatterns = [
    path("orders/", AdminOrderListView.as_view()),              # GET
    path("orders/<int:pk>/", UpdateOrderStatusView.as_view()),  # PATCH
    path("orders/delete/<int:pk>/", DeleteOrderView.as_view()), # DELETE
]