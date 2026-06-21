from django.core.mail import send_mail
from django.conf import settings

def send_register_email(to_email, username):
    subject = "Welcome to GlamAuraa"
    message = f"""
Hi {username},

Your account has been created successfully

Welcome to GlamAuraa!
Start shopping now 

Thank you 
"""

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [to_email],
        fail_silently=False,
    )