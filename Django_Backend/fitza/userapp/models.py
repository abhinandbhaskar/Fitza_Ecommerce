from django.db import models
from django.utils.timezone import now
from datetime import timedelta
from common.models import CustomUser,ShopOrder,UserAddress,Product, ProductItem,Seller,Payment



class ShoppingCart(models.Model):
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='shopping_cart')

    def __str__(self):
        return f"Shopping Cart for {self.user.username}"
    
    class Meta:
        verbose_name = "Shopping Cart"
        verbose_name_plural = "Shopping Carts"



class ShoppingCartItem(models.Model):
    shopping_cart=models.ForeignKey(ShoppingCart,on_delete=models.CASCADE,related_name='cart_items')
    product_item=models.ForeignKey(ProductItem,on_delete=models.CASCADE,related_name='cart_product_items')
    quantity=models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product_item.name} in Cart {self.shopping_cart.id}"
    
    class Meta:
        verbose_name="Shopping Cart Item"
        verbose_name_plural="Shopping Cart Items"



class OrderLine(models.Model):
    order=models.ForeignKey(ShopOrder,on_delete=models.CASCADE,related_name='order_lines')
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='order_lines')
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) 

    def __str__(self):
        return f"OrderLine - {self.product_item.name} (Order ID : {self.order.id})"
    


class Wishlist(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(Product, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Wishlist"

class RatingsReview(models.Model):
    STATUS_CHOICES = [
    ('approved', 'Approved'),
    ('pending', 'Pending'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.DecimalField(max_digits=3, decimal_places=2)  # Allows ratings like 4.5
    review_content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )  

    def __str__(self):
        return f"Review by {self.user.username} for Product {self.product.name} - Status: {self.status}"


class Question(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='questions')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Question by {self.user.username} on {self.product.name}"

class Answer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='answer')
    answered_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='answers')  # Seller or Admin
    answer_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer by {self.answered_by.username} for Question ID {self.question.id}"




class Bill(models.Model):
    PAYMENT_STATUS_CHOICES = [
    ('paid', 'Paid'),
    ('pending', 'Pending'),
    ('failed', 'Failed'),
    ]
    order = models.OneToOneField(ShopOrder, on_delete=models.CASCADE, related_name='bill')
    bill_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)  # Total after tax and discount
    tax = models.DecimalField(max_digits=5, decimal_places=2)  # Tax amount
    discount = models.DecimalField(max_digits=5, decimal_places=2)  # Discount applied
    billing_address = models.ForeignKey(
        UserAddress,
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        limit_choices_to={'address_type': 'billing'}, 
        related_name='bills'
    )  # Link to the billing address
    payment_status = models.CharField(
        max_length=15,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )  # Payment status
    invoice_number = models.CharField(max_length=20, unique=True)  # Unique invoice number
    notes = models.TextField(null=True, blank=True)  # Additional notes or remarks

    def __str__(self):
        return f"Invoice {self.invoice_number} for Order {self.order.id}"



class ReturnRefund(models.Model):
    STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
    ('completed', 'Completed'),
    ]

    order = models.ForeignKey(ShopOrder, on_delete=models.CASCADE, related_name='returns')
    reason = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    request_date = models.DateTimeField(auto_now_add=True)
    processed_date = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    is_partial_refund = models.BooleanField(default=False)
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='refunds')
    is_escalated = models.BooleanField(default=False)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    supporting_files = models.FileField(upload_to='refunds/', null=True, blank=True)

    def __str__(self):
        return f"Return/Refund for Order {self.order.id} - Status: {self.status}"


class Wallet(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    last_transaction = models.DateTimeField(auto_now=True)


class WalletTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
    ('credit', 'Credit'),
    ('debit', 'Debit'),
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    transaction_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type.capitalize()} of {self.amount} on {self.transaction_date}"



class Feedback(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]  # 1 to 5 stars

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='feedbacks')
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='feedbacks', null=True, blank=True)  # Feedback for seller
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='feedbacks', null=True, blank=True)  # Feedback for product
    platform = models.BooleanField(default=False)  # If feedback is for the platform
    rating = models.IntegerField(choices=RATING_CHOICES)  # 1 to 5 stars
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.seller:
            return f"Feedback by {self.user.username} for Seller {self.seller.seller.username}"
        elif self.platform:
            return f"Platform Feedback by {self.user.username}"
        else:
            return f"Feedback by {self.user.username} for Product {self.product.name}"
