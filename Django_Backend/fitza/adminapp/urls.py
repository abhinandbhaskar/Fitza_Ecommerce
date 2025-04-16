from django.urls import path

from adminapp.views import AdminTokenObtainPairView,AdminLogout,ViewUsers,ViewSellers,RemoveUsers,ViewSellerDetails,RemoveSeller
from adminapp.views import SellerApprovals,ApproveSeller

urlpatterns = [
    path('login/',AdminTokenObtainPairView.as_view(), name='admin_token_obtain_pair'),
    path('adminlogout/',AdminLogout.as_view(),name='adminlogout'),
    path('view_users/',ViewUsers.as_view(),name='view_users'),
    path('view_sellers/',ViewSellers.as_view(),name='view_sellers'),
    path('view_seller_approvals/',SellerApprovals.as_view(),name='view_seller_approvals'),
    path('remove_users/<int:user_id>/',RemoveUsers.as_view(),name="remove_users"),
    path('view_sellers_details/<int:id>/',ViewSellerDetails.as_view(),name="view_sellers_details"),
    path('remove_seller/<int:seller_id>/',RemoveSeller.as_view(),name="remove_seller"),
    path('approve_seller/<int:seller_id>/',ApproveSeller.as_view(),name="approve_seller")
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)