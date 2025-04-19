from django.urls import path

from adminapp.views import AdminTokenObtainPairView,AdminLogout,ViewUsers,ViewSellers,RemoveUsers,ViewSellerDetails,RemoveSeller
from adminapp.views import SellerApprovals,ApproveSeller,AddCategory,ViewCategory,fetchUpdateCategory,UpdateNewCategory,DeleteCategory

urlpatterns = [
    path('login/',AdminTokenObtainPairView.as_view(), name='admin_token_obtain_pair'),
    path('adminlogout/',AdminLogout.as_view(),name='adminlogout'),
    path('view_users/',ViewUsers.as_view(),name='view_users'),
    path('view_sellers/',ViewSellers.as_view(),name='view_sellers'),
    path('view_seller_approvals/',SellerApprovals.as_view(),name='view_seller_approvals'),
    path('remove_users/<int:user_id>/',RemoveUsers.as_view(),name="remove_users"),
    path('view_sellers_details/<int:id>/',ViewSellerDetails.as_view(),name="view_sellers_details"),
    path('remove_seller/<int:seller_id>/',RemoveSeller.as_view(),name="remove_seller"),
    path('approve_seller/<int:seller_id>/',ApproveSeller.as_view(),name="approve_seller"),
    path('add_category/',AddCategory.as_view(),name="add_category"),
    path('view_category/',ViewCategory.as_view(),name="view_category"),
    path('fetch_update_category/<int:cate_id>/',fetchUpdateCategory.as_view(),name="fetch_update_category"),
    path('update_new_category/<int:cate_id>/',UpdateNewCategory.as_view(),name="update_new_category"),
    path('delete_category/<int:cate_id>/',DeleteCategory.as_view(),name="delete_category"),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)