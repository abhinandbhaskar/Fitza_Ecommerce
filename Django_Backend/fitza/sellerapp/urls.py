from django.urls import path
# from sellerapp.views import SellerRegisterAPI,VerifyOtp,ResendOtp,CompleteSellerRegister
from sellerapp.views import SellerRegisterAPI,VerifyOtp,ResendOtp,ShopRegister,SellerBankRegister

urlpatterns = [
    path('register/',SellerRegisterAPI.as_view(),name='register'),
    path('verify_otp/',VerifyOtp.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOtp.as_view(),name='resend_otp'),
    path('shop_register/',ShopRegister.as_view(),name='shop_register'),
    path('bank_seller_register/',SellerBankRegister.as_view(),name='bank_seller_register'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)