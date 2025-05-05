


# class OrderStatus(models.Model):
#     status=models.CharField(max_length=50)

#     def __str__(self):
#         return self.status




# class ShopOrder(models.Model):
#     user=models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='orders')
#     payment_method=models.ForeignKey('Payment',on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
#     shipping_address=models.ForeignKey('Shipping',on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
#     order_status=models.ForeignKey(OrderStatus,on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
#     order_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     applied_coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
#     final_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Final price after discount
#     order_date = models.DateTimeField(auto_now_add=True)
#     free_shipping_applied = models.BooleanField(default=False)

#     def __str__(self):
#         return f"Order - {self.id} by {self.user.username}"
    



# class OrderLine(models.Model):
#     order=models.ForeignKey(ShopOrder,on_delete=models.CASCADE,related_name='order_lines')
#     product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='order_lines')
#     quantity = models.PositiveIntegerField(default=1)
#     price = models.DecimalField(max_digits=10, decimal_places=2) 

#     def __str__(self):
#         return f"OrderLine - {self.product_item.name} (Order ID : {self.order.id})"
    





# class Payment(models.Model):
#     PAYMENT_STATUS_CHOICES = [
#     ('pending', 'Pending'),
#     ('completed', 'Completed'),
#     ('failed', 'Failed'),
#     ('refunded', 'Refunded'),
#     ('disputed', 'Disputed'),
#     ]
#     PAYOUT_STATUS_CHOICES = [
#     ('pending', 'Pending'),
#     ('completed', 'Completed'),
#     ('failed', 'Failed'),
#     ]
#     order = models.ForeignKey(ShopOrder, on_delete=models.CASCADE, related_name='payments')
#     payment_method = models.CharField(max_length=50)
#     status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES)
#     transaction_id = models.CharField(max_length=100)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     payment_date = models.DateTimeField(auto_now_add=True)  # Tracks when the payment was made
#     gateway_response = models.JSONField(null=True, blank=True)  # Stores the raw response from the payment gateway
#     currency = models.CharField(max_length=10, default='USD')  # Tracks the currency of the payment
#     platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     seller_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     payout_status = models.CharField(max_length=50, choices=PAYOUT_STATUS_CHOICES, default='pending')
#     payout_date = models.DateTimeField(null=True, blank=True)  # When the payout was processed

#     def __str__(self):
#         return f"Payment {self.transaction_id} for Order {self.order.id}"



# class Shipping(models.Model):
#     SHIPPING_STATUS_CHOICES=[
#     ('pending', 'Pending'),
#     ('shipped', 'Shipped'),
#     ('delivered', 'Delivered'),
#     ('failed', 'Failed')]
#     order = models.OneToOneField(ShopOrder, on_delete=models.CASCADE, related_name='shipping')
#     shipping_address = models.ForeignKey(UserAddress, on_delete=models.CASCADE)
#     tracking_id = models.CharField(max_length=255, null=True, blank=True)  
#     status = models.CharField(
#         max_length=50, 
#         choices=SHIPPING_STATUS_CHOICES
#     )



# PAYMENT DETAILSSSSSSSSSSSSSSSSS 

# amount: 200
# currency: "INR"
# gateway_response: {razorpay_payment_id: 'pay_QR6IJ9z8WcXrX6', razorpay_order_id: 'order_QR6HAEMgayUWWv', razorpay_signature: '50fc83b8b352ec877d83d5e8a97a9ceb9fab5a3c3c588562b429a20db95d8e21'}
# order_id: "order_QR6HAEMgayUWWv"
# status: "completed"
# transaction_id: "pay_QR6IJ9z8WcXrX6"