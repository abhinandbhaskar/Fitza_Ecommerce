from django.urls import path
from .views import RegisterAPI, UserLogout, PasswordChange
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from .views import CustomTokenObtainPairView,ProfileView

urlpatterns = [
    path('register/',RegisterAPI.as_view(),name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/',ProfileView.as_view(),name='profile'),
    path('logout/',UserLogout.as_view(), name='logout'),
    path('passwordchange/',PasswordChange.as_view(),name='passwordchange'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)