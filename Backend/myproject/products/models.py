from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()
class Product(models.Model):
    CATEGORY_CHOICES = (
        ('face', 'Face'),
        ('eye', 'Eye'),
        ('lips', 'Lips'),
        ('nail', 'Nail'),
        ('brushes-tools', 'Brushes & Tools'),
        ('new-arrivals', 'New Arrivals'),
        ('bridal-bundle', 'Bridal Bundle'),
        ('skincare', 'Skin Care'),
    )

    name = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to="products/")
    old_price = models.DecimalField(max_digits=10, decimal_places=2)
    new_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name



class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(default=1)


class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)