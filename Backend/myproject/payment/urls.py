from django.urls import path
from .views import CreateOrderView, VerifyPaymentView

urlpatterns = [
    path("order/place-order/", CreateOrderView.as_view(), name="place-order"),
    path("razorpay/verify-payment/", VerifyPaymentView.as_view(), name="verify-payment"),
    
]