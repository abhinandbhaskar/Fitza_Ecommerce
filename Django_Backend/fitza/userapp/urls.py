from django.urls import path
from .views import AddToWallet, RegisterAPI, UserLogout, PasswordChange
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from .views import CustomTokenObtainPairView,ProfileView,profileupdate,AddBillingAddess,GetBillingAddress
from userapp.views import AddShippingAddess,GetShippingAddress,AccountDeactivate,ViewNewArrivals,ViewTopCollections,ViewSellProduct
from userapp.views import AddReviewRating,ViewRating,AddToWishlist,GetWishlist,RemoveWishlist,fetchDropDownData,DropDownCategory,FetchCategoryProduct
from userapp.views import GetBanners,AddToCart,GetCartData,RemoveCartProduct,CartProductSize,CartProductQuantity,ApplyCouponCode

from userapp.views import CreateRazorpayOrder, OrderPayment, RazorpayCallback,OfferProducts,AddInitialOrder,SavePaymentDetails,AskQuestion,GetQandAUser,GetUserOrders,AddShopFeedBack

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
    path('add_wishlist/<int:id>/',AddToWishlist.as_view(),name="add_wishlist"),
    path('get_wishlist/',GetWishlist.as_view(),name="get_wishlist"),
    path('remove_wishlist/<int:id>/',RemoveWishlist.as_view(),name='remove_wishlist'),
    path('fetch_drop_data/',fetchDropDownData.as_view(),name="fetch_drop_data"),
    path('drop_down_category/<str:cate_status>/',DropDownCategory.as_view(),name="drop_down_category"),
    path('fetch_cate_products/<str:pro_name>/',FetchCategoryProduct.as_view(),name="fetch_cate_products"),
    path('getbanners/',GetBanners.as_view(),name="getbanners"),
    path('add_to_cart/<int:id>/',AddToCart.as_view(),name="add_to_cart"),
    path('get_cart_data/',GetCartData.as_view(),name="get_cart_data"),
    path('remove_cart_product/<int:id>/',RemoveCartProduct.as_view(),name="remove_cart_product"),
    path('cart_size/<int:id>/',CartProductSize.as_view(),name="cart_size"),
    
    path('cart_quantity/<int:id>/',CartProductQuantity.as_view(),name="cart_quantity"),
    path('apply_coupon_code/',ApplyCouponCode.as_view(),name="apply_coupon_code"),

    path('create-razorpay-order/', CreateRazorpayOrder.as_view(), name='create_razorpay_order'),
    path('order-payment/', OrderPayment.as_view(), name='order_payment'),
    path('razorpay/callback/', RazorpayCallback.as_view(), name='razorpay_callback'),

    path('offer_products/',OfferProducts.as_view(),name="offer_products"),
    path('initial_order/',AddInitialOrder.as_view(),name="initial_order"),
    path('save-payment-details/<int:cartId>/',SavePaymentDetails.as_view(),name="save-payment-details"),
    path('ask_question/',AskQuestion.as_view(),name="ask_question"),
    path('get_question_answer/<int:pid>/',GetQandAUser.as_view(),name="get_question_answer"),
    path('get_orders/',GetUserOrders.as_view(),name="get_orders"),
    path('add_shop_feedback/<int:ssid>/', AddShopFeedBack.as_view(), name="add_shop_feedback"),

]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)