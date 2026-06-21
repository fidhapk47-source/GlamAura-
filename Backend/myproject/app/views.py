# app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer
from .utils import send_register_email
import random
from django.core.mail import send_mail
from django.conf import settings
# ✅ REGISTER

class RegisterView(APIView):
    def post(self, request):

        email = request.data.get("email").strip().lower()
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "All fields required"}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=400)

        import random
        otp = str(random.randint(100000, 999999))

        # ✅ CREATE USER
        user = CustomUser.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # ✅ SAVE OTP PROPERLY
        user.otp = otp
        user.is_verified = False
        user.save()

        print("REGISTER OTP:", otp)   # 🔥 DEBUG

        from django.core.mail import send_mail
        from django.conf import settings

        send_mail(
            "Your OTP Code",
            f"Your OTP is {otp}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent"})



class LoginView(APIView):
    def post(self, request):
        email = request.data.get("username")
        password = request.data.get("password")

        # ✅ CHECK USER EXISTS
        try:
            user_obj = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=400)

        # ✅ AUTHENTICATE
        user = authenticate(
            username=user_obj.username,
            password=password
        )

        if user is None:
            return Response({"detail": "Invalid credentials"}, status=400)

        # 🚫 BLOCKED USER
        if user.status == "blocked":
            return Response({"detail": "User is blocked"}, status=403)

        # 🔐 EMAIL NOT VERIFIED
        if not user.is_verified:

            # 🔁 GENERATE NEW OTP
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.save()

            # 📧 SEND OTP AGAIN
            send_mail(
                "Verify your account",
                f"Your OTP is {otp}",
                "your_email@gmail.com",
                [user.email],
                fail_silently=False,
            )

            return Response({
                "detail": "Email not verified. OTP sent again.",
                "email": user.email   # 👉 frontend use this
            }, status=403)

        # ✅ LOGIN SUCCESS
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })
    
class VerifyOTPView(APIView):
    def post(self, request):

        email = request.data.get("email").strip().lower()
        otp = request.data.get("otp").strip()

        if not email or not otp:
            return Response({"error": "Email & OTP required"}, status=400)

        try:
            user = CustomUser.objects.get(email=email)

            print("DB OTP:", user.otp)
            print("INPUT OTP:", otp)

            # ✅ CHECK OTP SAFELY
            if user.otp and user.otp.strip() == otp:
                user.is_verified = True
                user.otp = None
                user.save()

                return Response({"message": "Verified ✅"})

            return Response({"error": "Invalid OTP"}, status=400)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class ResendOTPView(APIView): 
    def post(self, request):
        email = request.data.get("email")

        try:
            user = CustomUser.objects.get(email=email)

            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.save()

            send_mail(
                "Resend OTP",
                f"Your OTP is {otp}",
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response({"message": "OTP resent"})

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)