from django.urls import path
from .views import (
    ProductView,
    CartView,
    AddToCartView,
    WishlistView,
    AddToWishlistView,
    IncreaseCartView,
    DecreaseCartView,
    RemoveCartView,
    RemoveWishlistView,
    ProductDetailView,
    NewArrivalView,
    CategoryListView
)

urlpatterns = [
    path('products/', ProductView.as_view()),
    # path("<int:id>/", ProductView.as_view()),
    path('cart/', CartView.as_view()),
    path('cart/add/', AddToCartView.as_view()),
    path('cart/increase/<int:id>/', IncreaseCartView.as_view()),
    path('cart/decrease/<int:id>/', DecreaseCartView.as_view()),
    path('cart/remove/<int:id>/', RemoveCartView.as_view()),
     path("wishlist/", WishlistView.as_view()),
    path("wishlist/add/", AddToWishlistView.as_view()),
    path("wishlist/remove/<int:id>/", RemoveWishlistView.as_view()),
    path("products/<int:id>/", ProductDetailView.as_view()),
    #  path("products/best-sellers/", BestSellerView.as_view()),
    path("products/new-arrivals/", NewArrivalView.as_view()),
    path("products/categories/", CategoryListView.as_view()),
    
]