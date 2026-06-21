from django.urls import path
from .views import AdminLoginView,AdminDashboardView,AdminUsersView,BlockUserView,UnblockUserView,AdminUserDeleteView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin-login/", AdminLoginView.as_view()),
    path("admin-dashboard/", AdminDashboardView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("admin/users/", AdminUsersView.as_view()),
    path("admin/users/block/<int:id>/", BlockUserView.as_view()),
    path("admin/users/unblock/<int:id>/", UnblockUserView.as_view()),
    path('admin/users/<int:pk>/',AdminUserDeleteView.as_view())
]