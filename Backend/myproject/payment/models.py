from django.db import models
from django.core.validators import RegexValidator
from app.models import CustomUser
from products.models import Product


# ---------------- VALIDATORS ----------------

phone_validator = RegexValidator(
    regex=r'^\d{10}$',
    message="Enter valid 10 digit phone number"
)

pincode_validator = RegexValidator(
    regex=r'^\d{6}$',
    message="Enter valid 6 digit pincode"
)


# ---------------- ORDER ----------------

class Order(models.Model):

    PAYMENT_METHODS = (
        ("cod", "Cash on Delivery"),
        ("onlinepayment", "Online Payment"),
        ("wallet", "Wallet"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    name = models.CharField(max_length=200)
    address = models.TextField()
    pincode = models.CharField(
        max_length=6,
        validators=[pincode_validator]
    )
    phone = models.CharField(
        max_length=10,
        validators=[phone_validator]
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        default="cod"   # 🔥 prevents migration error
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # Razorpay fields
    razorpay_order_id = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    razorpay_payment_id = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    razorpay_signature = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


# ---------------- ORDER ITEMS ----------------

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField(default=1)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


# ---------------- PAYMENT ----------------

class Payment(models.Model):

    PAYMENT_STATUS = (
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    )

    PAYMENT_METHODS = (
        ("cod", "Cash on Delivery"),
        ("onlinepayment", "Online Payment"),
        ("wallet", "Wallet"),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Order {self.order.id}"