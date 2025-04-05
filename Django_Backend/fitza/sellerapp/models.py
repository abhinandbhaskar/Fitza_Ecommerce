from django.db import models

from common.models import CustomUser, ShopOrder,UserAddress,Product,ProductItem
from django.utils.timezone import now
from datetime import timedelta
# Create your models here.

#seller


class ProductImage(models.Model):
    product_item=models.ForeignKey(ProductItem,on_delete=models.CASCADE,related_name='images')
    image_filename=models.ImageField(upload_to='product_images/')

    def __str__(self):
        return f"Image for {self.product_item}"
    

def default_discount_card_end_date():
    """Returns the default end date, one year from now."""
    return now() + timedelta(days=365)

class DiscountCard(models.Model):
    card_name = models.CharField(max_length=50)  # Name of the discount card (e.g., "Gold Card")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage discount for the card
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(default=default_discount_card_end_date)  # Default 1-year validity
    is_active = models.BooleanField(default=True)

    def is_valid(self):
        """Check if the discount card is currently valid."""
        return self.is_active and self.start_date <= now() <= self.end_date

    def __str__(self):
        return f"{self.card_name} ({self.discount_percentage}%)"


def default_free_shipping_end_date():
    """Returns the default end date, 30 days from now."""
    return now() + timedelta(days=30)

class FreeShippingOffer(models.Model):
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2) 
    description = models.TextField(blank=True, null=True) 
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(default=default_free_shipping_end_date)  # Use the standalone function
    is_active = models.BooleanField(default=True)

    def is_valid(self):
        """Check if the free shipping offer is currently valid."""
        return self.is_active and self.start_date <= now() <= self.end_date

    def __str__(self):
        return f"Free Shipping Offer (Min Order: ${self.min_order_amount})"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('success', 'Success'),
        ('error', 'Error'),
        ('admin', 'Admin Notification'),
        ('seller', 'Seller Notification'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')  # Receiver
    sender = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')  # Sender
    message = models.TextField()
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    redirect_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Notification to {self.user.username} - {self.type.capitalize()}"







class Banner(models.Model):
    title = models.CharField(max_length=255, help_text="Title for the banner, e.g., 'Limited Time Offer'")
    description = models.TextField(help_text="Description for the banner")
    offer_details = models.CharField(max_length=255, blank=True, help_text="Offer details, e.g., 'Up to 50% off'")
    image = models.ImageField(upload_to="banners/", null=True, blank=True, help_text="Banner background image")
    start_date = models.DateTimeField(help_text="Start date for displaying the banner")
    end_date = models.DateTimeField(help_text="End date for displaying the banner")
    is_active = models.BooleanField(default=True, help_text="Toggle to enable/disable the banner")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-start_date']
        verbose_name = "Banner"
        verbose_name_plural = "Banners"





class ProductOffer(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="offers")
    offer_title = models.CharField(max_length=255, help_text="Title for the offer, e.g., 'Special Discount'")
    offer_description = models.TextField(blank=True, help_text="Description of the offer")
    discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Discount percentage, e.g., 20.00 for 20%"
    )
    start_date = models.DateTimeField(help_text="Start date for the offer")
    end_date = models.DateTimeField(help_text="End date for the offer")
    is_active = models.BooleanField(default=True, help_text="Toggle to enable/disable the offer")

    def is_currently_active(self):
        """Check if the offer is active based on the current date and time."""
        return self.is_active and self.start_date <= now() <= self.end_date

    def __str__(self):
        return f"{self.offer_title} - {self.product.name}"

    class Meta:
        ordering = ['-start_date']
        verbose_name = "Product Offer"
        verbose_name_plural = "Product Offers"


