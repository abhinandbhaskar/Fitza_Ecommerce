


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
    

