from django.urls import path
from .views import *

urlpatterns = [

    # Dashboard
    path('admin-dashboard/', DashboardView.as_view()),

    # Users
    path('admin-users/', AdminUsersView.as_view()),
    path('admin-users/<int:user_id>/', AdminUsersView.as_view()),

    # Products
    path('admin-products/', AdminProductsView.as_view()),
    path('admin-products/<int:product_id>/', AdminProductDeleteView.as_view()),

    # Orders
    path('admin-orders/', AdminOrdersView.as_view()),
    path('admin-orders/<int:order_id>/', UpdateOrderStatusView.as_view()),
]