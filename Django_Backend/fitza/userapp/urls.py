from django.urls import path
from .views import AddToWallet, RegisterAPI, UserLogout, PasswordChange
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from .views import CustomTokenObtainPairView,ProfileView,profileupdate,AddBillingAddess,GetBillingAddress
from userapp.views import AddShippingAddess,GetShippingAddress,AccountDeactivate,ViewNewArrivals,ViewTopCollections,ViewSellProduct
from userapp.views import AddReviewRating,ViewRating


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
    path('add-to-wallet/',AddToWallet.as_view(),name='add-to-wallet'),
    path('new_arrivals/',ViewNewArrivals.as_view(),name='new_arrivals'),
    path('top_collections/<str:topfilter>/',ViewTopCollections.as_view(),name="top_collections"),
    path('view_sell_product/<int:id>/',ViewSellProduct.as_view(),name="view_sell_product"),
    path('add_review_rating/',AddReviewRating.as_view(),name='add_review_rating'),
    path('view_rating/<int:product_id>/',ViewRating.as_view(),name="view_rating"),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)