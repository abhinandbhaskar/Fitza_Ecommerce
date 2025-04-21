from django.urls import path

from adminapp.views import AdminTokenObtainPairView,AdminLogout,ViewUsers,ViewSellers,RemoveUsers,ViewSellerDetails,RemoveSeller
from adminapp.views import SellerApprovals,ApproveSeller,AddCategory,ViewCategory,fetchUpdateCategory,UpdateNewCategory,DeleteCategory,AddColor,ViewColors,DeleteColor,AddSize
from adminapp.views import ViewSize,SizeDelete,AddBrand,ViewBrand,ViewUpdateBrand,UpdateNewBrand,DeleteBrand

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
    path('add_color/',AddColor.as_view(),name="add_color"),
    path('view_colors/',ViewColors.as_view(),name="view_colors"),
    path('delete_color/<int:color_id>/',DeleteColor.as_view(),name="delete_color"),
    path('add_size/',AddSize.as_view(),name="add_size"),
    path('view_size/',ViewSize.as_view(),name="view_size"),
    path('delete_size/<int:size_id>/',SizeDelete.as_view(),name="delete_size"),
    path('add_brand/',AddBrand.as_view(),name="add_brand"),
    path('view_brand/',ViewBrand.as_view(),name="view_brand"),
    path('view_update_brand/<int:brand_id>/',ViewUpdateBrand.as_view(),name='view_update_brand'),
    path('update_brand/<int:brand_id1>/',UpdateNewBrand.as_view(),name='update_brand'),
    path('delete_brand/<int:brand_id>/',DeleteBrand.as_view(),name="delete_brand"),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)