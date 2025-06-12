from django.contrib import admin
from userapp.models import* 
from common.models import *
from adminapp.models import *
from sellerapp.models import *
# Register your models here.

admin.site.register(ProductImage)
admin.site.register(DiscountCard)
admin.site.register(FreeShippingOffer)
admin.site.register(Notification)
admin.site.register(Banner)
admin.site.register(ProductOffer)

admin.site.register(Seller)
admin.site.register(ProductCategory)
admin.site.register(SubCategory)
admin.site.register(Product)
admin.site.register(ProductItem)
admin.site.register(Coupon)
admin.site.register(ShopOrder)
admin.site.register(Shipping)
admin.site.register(Payment)
admin.site.register(SellerBankDetails)
admin.site.register(PaymentGatewayConfig)



