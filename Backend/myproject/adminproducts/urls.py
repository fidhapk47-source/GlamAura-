from django.urls import path
from . import views

urlpatterns = [
        path("admin/products/", views.AdminProductView.as_view())
]
