from django.db import models
from django.utils.timezone import now
from datetime import timedelta
# Create your models here.


from django.contrib.auth.models import AbstractUser, Group, Permission

class CustomUser(AbstractUser):
    USER_TYPES = [
        ('user', 'User'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    ]

    # Custom fields
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    userphoto = models.ImageField(
        upload_to="user_photos/",
        blank=True,
        null=True,
        default="user_photos/default.jpg"  # Path to the default photo
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='user')  # User type field

    # Explicitly set related_name to avoid clashes
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions",
        blank=True
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def is_seller(self):
        """Check if the user is a seller."""
        return self.user_type == 'seller'

    def is_admin(self):
        """Check if the user is an admin."""
        return self.user_type == 'admin'


class UserAddress(models.Model):
    ADDRESS_TYPE_CHOICES = [
    ('billing','Billing'),
    ('shipping','Shipping'),
    ]
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='addresses')
    address_type=models.CharField(max_length=10,choices=ADDRESS_TYPE_CHOICES)
    address_line1=models.CharField(max_length=255)
    address_line2=models.CharField(max_length=255,blank=True,null=True)
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    postal_code=models.CharField(max_length=20)
    country=models.CharField(max_length=100)
    phone=models.CharField(max_length=15)

    def __str__(self):
        return f"{self.address_type.capitalize()} Address for {self.user.username}"

class OrderStatus(models.Model):
    status=models.CharField(max_length=50)

    def __str__(self):
        return self.status





#seller models

class Brand(models.Model):
    brand_name=models.CharField(max_length=255)
    brand_description=models.TextField(blank=True,null=True)

    def __str__(self):
        return self.brand_name


class Color(models.Model):
    color_name=models.CharField(max_length=50)

    def __str__(self):
        return self.color_name

class SizeOption(models.Model):
    size_name=models.CharField(max_length=50)
    sort_order=models.PositiveIntegerField()

    def __str__(self):
        return self.size_name
    







class Seller(models.Model):
    SHOP_STATUS_CHOICES=[
    ('Active','Active'),
    ('Suspended','Suspended')
    ]
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='seller_profile')
    shop_name=models.CharField(max_length=255)
    shop_address=models.TextField(blank=True,null=True)
    contact_number=models.CharField(max_length=15,blank=True,null=True)
    email=models.EmailField(blank=True,null=True)
    tax_id=models.CharField(max_length=50,blank=True,null=True)
    business_registration_number=models.CharField(max_length=50,blank=True,null=True)
    shop_logo=models.ImageField(upload_to='shop_logos/',blank=True,null=True)
    shop_banner=models.ImageField(upload_to='shop_banners/',blank=True,null=True)
    products_sold=models.PositiveIntegerField(default=0)
    rating=models.DecimalField(max_digits=3,decimal_places=2,default=0.0)
    account_verified=models.BooleanField(default=False)
    joining_date=models.DateField(auto_now_add=True)
    payout_details=models.JSONField(blank=True,null=True)
    shop_status=models.CharField(max_length=50,choices=SHOP_STATUS_CHOICES,default='Active')
    description=models.TextField(blank=True,null=True)

    def __str__(self):
        return f"Shop : {self.shop_name} ({self.user.username})"
    
class ProductCategory(models.Model):
    category_name=models.CharField(max_length=255)
    category_image=models.ImageField(upload_to='categories/',blank=True,null=True)
    category_description=models.TextField(blank=True,null=True)

    def __str__(self):
        return self.category_name
    


class SubCategory(models.Model):
    category = models.ForeignKey(
        ProductCategory, 
        on_delete=models.CASCADE, 
        related_name='subcategories'
    )
    subcategory_name = models.CharField(max_length=255)
    subcategory_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.subcategory_name} (under {self.category.category_name})"



class Product(models.Model):
    category=models.ForeignKey(ProductCategory,on_delete=models.CASCADE,related_name='products')
    # subcategory = models.ForeignKey(SubCategory,on_delete=models.CASCADE,related_name='products',null=True,blank=True)
    brand=models.ForeignKey(Brand,on_delete=models.SET_NULL,null=True,blank=True,related_name='products')
    shop=models.ForeignKey(Seller,on_delete=models.CASCADE,related_name='products')
    product_name=models.CharField(max_length=255)
    product_description=models.TextField()
    model_height=models.CharField(max_length=50,blank=True,null=True)
    model_wearing=models.CharField(max_length=50,blank=True,null=True)
    care_instructions=models.TextField(blank=True,null=True)
    about=models.TextField(blank=True,null=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00, help_text="Product weight in kg")


    def __str__(self):
        return self.product_name


class ProductItem(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='items')
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    size = models.ForeignKey(SizeOption, on_delete=models.CASCADE, related_name='product_items')
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    product_code = models.CharField(max_length=100, unique=True)
    quantity_in_stock = models.PositiveIntegerField()
    
    # New fields for approval/rejection workflow
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)  # Optional, for rejection reasons

    def __str__(self):
        details = f"{self.product.product_name} - "
        if self.color:
            details += f"{self.color.color_name} - "
        details += f"{self.size.size_name}"
        return details




from django.core.exceptions import ValidationError
from datetime import timedelta
from django.utils.timezone import now


def default_coupon_end_date():
    """Returns the default end date, 30 days from now."""
    return now() + timedelta(days=30)


class Coupon(models.Model):
    COUPONS_CHOICES=[
    ('percentage', 'Percentage'),
    ('fixed', 'Fixed Amount')
    ]
    code = models.CharField(max_length=20, unique=True)
    discount_type = models.CharField(
        max_length=10,
        choices=COUPONS_CHOICES,
        default='percentage'
    )
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(default=default_coupon_end_date)
    usage_limit = models.PositiveIntegerField(default=1)
    used_count = models.PositiveIntegerField(default=0)

    def clean(self):
        """Validates the discount value based on the discount type."""
        if self.discount_type == 'percentage' and not (0 <= self.discount_value <= 100):
            raise ValidationError("Percentage discount value must be between 0 and 100.")
        if self.discount_value < 0:
            raise ValidationError("Discount value must be positive.")

    def __str__(self):
        return f"Coupon: {self.code} ({self.discount_type} - {self.discount_value})"

    def is_valid(self):
        """Checks if the coupon is valid based on the current date and usage count."""
        return (
            self.start_date <= now() <= self.end_date and
            self.used_count < self.usage_limit
        )

    def increment_usage(self):
        """
        Increments the used count if the coupon is valid and usage limit isn't exceeded.
        """
        if self.is_valid():
            self.used_count += 1
            self.save()
            return True
        return False

    

class ShopOrder(models.Model):
    user=models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='orders')
    payment_method=models.ForeignKey('Payment',on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
    shipping_address=models.ForeignKey('Shipping',on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
    order_status=models.ForeignKey(OrderStatus,on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
    order_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    applied_coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    final_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Final price after discount
    order_date = models.DateTimeField(auto_now_add=True)
    free_shipping_applied = models.BooleanField(default=False)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00,null=True, blank=True)  # New Field
    order_notes = models.TextField(null=True, blank=True)  # New Field

    def __str__(self):
        return f"Order - {self.id} by {self.user.username}"


class Shipping(models.Model):
    SHIPPING_STATUS_CHOICES=[
    ('pending', 'Pending'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('failed', 'Failed')]
    order = models.OneToOneField(ShopOrder, on_delete=models.CASCADE, related_name='shipping')
    shipping_address = models.ForeignKey(UserAddress, on_delete=models.CASCADE)
    tracking_id = models.CharField(max_length=600, null=True, blank=True)  
    status = models.CharField(
        max_length=50, 
        choices=SHIPPING_STATUS_CHOICES
    )
    estimated_delivery_date = models.DateField(null=True, blank=True) 
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00,null=True, blank=True)  # New Field



#Admin models

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('failed', 'Failed'),
    ('refunded', 'Refunded'),
    ('disputed', 'Disputed'),
    ]
    PAYOUT_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('failed', 'Failed'),
    ]
    order = models.ForeignKey(ShopOrder, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES)
    transaction_id = models.CharField(max_length=600)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)  # Tracks when the payment was made
    gateway_response = models.JSONField(null=True, blank=True)  # Stores the raw response from the payment gateway
    currency = models.CharField(max_length=10, default='USD')  # Tracks the currency of the payment
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    seller_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payout_status = models.CharField(max_length=50, choices=PAYOUT_STATUS_CHOICES, default='pending')
    payout_date = models.DateTimeField(null=True, blank=True)  # When the payout was processed

    def __str__(self):
        return f"Payment {self.transaction_id} for Order {self.order.id}"




from django.db import models
from django.utils.timezone import now
from cryptography.fernet import Fernet
from django.conf import settings
import os

class SellerBankDetails(models.Model):
    seller = models.OneToOneField(
        'Seller',
        on_delete=models.CASCADE,
        related_name='bank_details'
    )
    account_holder_name = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    account_number = models.BinaryField()  # To store encrypted account numbers
    ifsc_code = models.CharField(max_length=11)
    branch_address = models.TextField()
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """
        Override save method to encrypt the account number before saving.
        """
        if isinstance(self.account_number, str):
            cipher = Fernet(settings.BANK_ENCRYPTION_KEY)
            self.account_number = cipher.encrypt(self.account_number.encode())
        super().save(*args, **kwargs)

    def decrypt_account_number(self):
        """
        Decrypt the account number when needed.
        """
        cipher = Fernet(settings.BANK_ENCRYPTION_KEY)
        return cipher.decrypt(self.account_number).decode()

    def __str__(self):
        return f"Bank Details for Seller: {self.seller.shop_name}"
    


class PaymentGatewayConfig(models.Model):
    gateway_name = models.CharField(max_length=50, unique=True)  # e.g., PayPal, Razorpay
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)
    callback_url = models.URLField()
    enabled = models.BooleanField(default=True)  # To toggle availability
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.gateway_name} Configuration"

