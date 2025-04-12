"""
URL configuration for fitza project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django_email_verification import urls as email_urls
from django.contrib.auth import views as auth_views
from userapp import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from userapp.views import CookieTokenRefreshView,oauth_redirect_handler,get_tokens

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('userapp.urls')),
    path('api/admin/',include('adminapp.urls')),
    path('api/seller/',include('sellerapp.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh_cookie"),
    path('email/', include(email_urls)),
    path('password-reset/',auth_views.PasswordResetView.as_view(template_name='password_reset.html'), name='password_reset'),
    path('password-reset/done/',auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'),name='password_reset_confirm'),
    path('reset/done/',auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'),name='password_reset_complete'),
    path('social/', include('social_django.urls', namespace='social')),  # Required for social auth
    path('clear-session/', views.clear_session, name='clear_session'),
    path('accounts/login/', views.custom_login_view, name='login'), 
    path('set-cookie-after-login/', views.oauth_redirect_handler, name='set_cookie_after_login'),
    path('get-tokens/', views.get_tokens, name='get_tokens'),

]
