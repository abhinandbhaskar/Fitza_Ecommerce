from django.urls import path
# from sellerapp.views import SellerRegisterAPI,VerifyOtp,ResendOtp,CompleteSellerRegister
from sellerapp.views import SellerRegisterAPI,VerifyOtp,ResendOtp,ShopRegister,SellerBankRegister
from sellerapp.views import SellerTokenObtainPairView,SellerLogout,SellerProfile,SellerShop,BankDetails,UpdateProfile,UpdateShop,BankUpdate


urlpatterns = [
    path('register/',SellerRegisterAPI.as_view(),name='register'),
    path('verify_otp/',VerifyOtp.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOtp.as_view(),name='resend_otp'),
    path('shop_register/',ShopRegister.as_view(),name='shop_register'),
    path('bank_seller_register/',SellerBankRegister.as_view(),name='bank_seller_register'),
    path('seller_login/',SellerTokenObtainPairView.as_view(),name='seller_login'),
    path('seller_logout/',SellerLogout.as_view(),name="seller_logout"),
    path('seller_profile/',SellerProfile.as_view(),name='seller_profile'),
    path('shop_details/',SellerShop.as_view(),name="shop_details"),
    path('bank_details/',BankDetails.as_view(),name='bank_details'),
    path('update_profile/',UpdateProfile.as_view(),name='update_profile'),
    path('update_shop/',UpdateShop.as_view(),name='update_shop'),
    path('bank_update/',BankUpdate.as_view(),name="bank_update"),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)