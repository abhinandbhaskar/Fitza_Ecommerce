from django.urls import path
from .views import AddToWallet, RegisterAPI, UserLogout, PasswordChange
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from .views import CustomTokenObtainPairView,ProfileView,profileupdate,AddBillingAddess,GetBillingAddress
from userapp.views import AddShippingAddess,GetShippingAddress,AccountDeactivate

urlpatterns = [
    path('register/',RegisterAPI.as_view(),name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/',ProfileView.as_view(),name='profile'),
    path('logout/',UserLogout.as_view(), name='logout'),
    path('passwordchange/',PasswordChange.as_view(),name='passwordchange'),
    path('profileupdate/',profileupdate.as_view(),name='profileupdate'),
    path('AddBillingAddess/',AddBillingAddess.as_view(),name='AddBillingAddess'),
    path('getBillingAddress/',GetBillingAddress.as_view(),name='getBillingAddress'),
    path('AddShippingAddess/',AddShippingAddess.as_view(),name='AddShippingAddess'),
    path('getShippingAddress/',GetShippingAddress.as_view(),name='getShippingAddress'),
    path('accountDeactivate/',AccountDeactivate.as_view(),name='accountDeactivate'),
    path('add-to-wallet/',AddToWallet.as_view(),name='add-to-wallet')
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)