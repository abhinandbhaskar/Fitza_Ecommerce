from django.contrib import admin
from userapp.models import* 
from common.models import *
from adminapp.models import *
from sellerapp.models import *


admin.site.register(ShoppingCart)
admin.site.register(ShoppingCartItem)
admin.site.register(OrderLine)
admin.site.register(Wishlist)
admin.site.register(RatingsReview)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Bill)
admin.site.register(ReturnRefund)
admin.site.register(Feedback)

admin.site.register(UserAddress)
admin.site.register(OrderStatus)
admin.site.register(Brand)
admin.site.register(Color)
admin.site.register(SizeOption)
