from django.urls import path
from sellerapp.views import SellerRegisterAPI,VerifyOtp,ResendOtp,CompleteSellerRegister

urlpatterns = [
    path('register/',SellerRegisterAPI.as_view(),name='register'),
    path('verify_otp/',VerifyOtp.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOtp.as_view(),name='resend_otp'),
    path('complete_seller_profile/',CompleteSellerRegister.as_view(),name='complete_seller_profile'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)