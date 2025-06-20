from django.urls import path
from .views import RegisterAPI, UserLogout, PasswordChange
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from .views import CustomTokenObtainPairView,ProfileView,profileupdate,AddBillingAddess,GetBillingAddress
from userapp.views import AddShippingAddess,GetShippingAddress,AccountDeactivate,ViewNewArrivals,ViewTopCollections,ViewSellProduct,MarksUserRead
from userapp.views import AddReviewRating,ViewRating,AddToWishlist,GetWishlist,RemoveWishlist,fetchDropDownData,DropDownCategory,FetchCategoryProduct
from userapp.views import GetBanners,AddToCart,GetCartData,RemoveCartProduct,CartProductQuantity,ApplyCouponCode,GetDealsOfDay,GetDiscountCard,FreeshipOffers,CompareProducts,AddProductInteration

from userapp.views import CreateRazorpayOrder, OrderPayment, RazorpayCallback,OfferProducts,AddInitialOrder,SavePaymentDetails,AskQuestion,GetQandAUser,GetUserOrders,AddShopFeedBack,AddCartProductInteration
from userapp.views import BillGenerator,GetBillAPIView,SendReturnRefund,GetReturnRefundStatus,CustomerCancelOrder,ViewUserAllNotifications,UserUnreadNotifications,test_pincode_distance
from userapp.views import ai_recommendations

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
    path('new_arrivals/',ViewNewArrivals.as_view(),name='new_arrivals'),
    path('top_collections/',ViewTopCollections.as_view(),name="top_collections"),
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
    path('add_to_cart/<int:itemId>/',AddToCart.as_view(),name="add_to_cart"),
    path('get_cart_data/',GetCartData.as_view(),name="get_cart_data"),
    path('remove_cart_product/<int:id>/',RemoveCartProduct.as_view(),name="remove_cart_product"),


    path('deals_of_day/',GetDealsOfDay.as_view(),name="deals_of_day"),
    
    path('cart_quantity/<int:id>/',CartProductQuantity.as_view(),name="cart_quantity"),
    path('apply_coupon_code/',ApplyCouponCode.as_view(),name="apply_coupon_code"),

    path('create-razorpay-order/', CreateRazorpayOrder.as_view(), name='create_razorpay_order'),
    path('order-payment/', OrderPayment.as_view(), name='order_payment'),
    path('razorpay/callback/', RazorpayCallback.as_view(), name='razorpay_callback'),

    path('offer_products/',OfferProducts.as_view(),name="offer_products"),
    path('compare_products/<int:id>/',CompareProducts.as_view(),name="compare_products"),

    path('initial_order/',AddInitialOrder.as_view(),name="initial_order"),
    path('save-payment-details/<int:cartId>/',SavePaymentDetails.as_view(),name="save-payment-details"),
    path('ask_question/',AskQuestion.as_view(),name="ask_question"),
    path('get_question_answer/<int:pid>/',GetQandAUser.as_view(),name="get_question_answer"),
    path('get_orders/',GetUserOrders.as_view(),name="get_orders"),
    path('add_shop_feedback/<int:ssid>/', AddShopFeedBack.as_view(), name="add_shop_feedback"),
    path('generate-bill/',BillGenerator.as_view(),name="generate-bill"),
    path('get_bill/<int:order_id>/', GetBillAPIView.as_view(), name='get_bill'),
    path('send_return_refund/<int:orderId>/',SendReturnRefund.as_view(),name="send_return_refund"),
    path('get_returnrefund_status/<int:orderId>/',GetReturnRefundStatus.as_view(),name="get_returnrefund_status"),
    path('user_cancel_order/<int:orderId>/',CustomerCancelOrder.as_view(),name="user_cancel_order"),
    path('view_user_all_notifications/',ViewUserAllNotifications.as_view(),name="view_user_all_notifications"),
    path('marks_user_read/<int:id>/',MarksUserRead.as_view(),name="marks_user_read"),
    path('user_unread_notifications/',UserUnreadNotifications.as_view(),name="user_unread_notifications"),
    path('route/', test_pincode_distance , name='get_route'),
    path('get_discount_card/',GetDiscountCard.as_view(),name='get_discount_card'),
    path('freeshipping_offer/',FreeshipOffers.as_view(),name='freeshipping_offer'),
    path('add_product_interation/<int:id>/<str:type>/',AddProductInteration.as_view(),name="add_product_interation"),
    path('addcart_product_interation/<int:itemId>/<str:type>/',AddCartProductInteration.as_view(),name="addcart_product_interation"),
    # path('api/recommendations/ai/', ai_recommendations, name='ai-recommendations'),
    path('recommendations/ai/', ai_recommendations, name='ai-recommendations'),

]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)