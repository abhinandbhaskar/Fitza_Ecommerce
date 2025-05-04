from rest_framework.views import APIView
from .serializers import PasswordSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer,ProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django_email_verification import send_email
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
# Create your views here.


#register function
class RegisterAPI(APIView):
    def post(self,request):
        _data=request.data
        serializer=RegisterSerializer(data=_data)
        if not serializer.is_valid():
            return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message":"Registration Successful! Please verify your email."},status=status.HTTP_201_CREATED)


#login related function
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer 

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        
        response.set_cookie(
            key="refresh_token",
            value=serializer.validated_data["refresh"],
            httponly=True,
            secure=False,  # Set to True in production
            samesite="None",
            path="/",
            max_age=60 * 60 * 24 * 7
        )

        response.data.pop("refresh", None)

        return response



from rest_framework_simplejwt.tokens import RefreshToken, TokenError

class CookieTokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        print("BOOOO",refresh_token)

        if refresh_token is None:
            return Response({"detail": "Refresh token missing in cookie."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)

        except TokenError as e:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


#profile related function
class ProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        serializer=ProfileSerializer(user)
        return Response(serializer.data)


from django.http import JsonResponse

#in the case of google authentication handle redirect page will call this

def get_tokens(request):
    access_token = request.COOKIES.get('access_token')
    refresh_token = request.COOKIES.get('refresh_token')
    user_id = request.COOKIES.get('user_id')

    if not access_token or not refresh_token:
        return JsonResponse({'error': 'Token not found in cookies'}, status=401)

    return JsonResponse({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_id':user_id,
    })



from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def clear_session(request):
    if request.method == 'POST':
        request.session.flush()
        return JsonResponse({'message': 'Session cleared successfully!'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)


from social_core.exceptions import AuthAlreadyAssociated
from django.urls import reverse
from social_django.views import do_complete

def custom_complete_view(request, *args, **kwargs):
    try:
        return do_complete(request.backend, *args, **kwargs)
    except AuthAlreadyAssociated:
        return redirect(reverse('/'))  # Replace 'dashboard' with your target page

def custom_login_view(request):
    return redirect('http://localhost:5173/authredirect')  # Redirects to React frontend


# SOCIAL aUTH USING THIS LINK https://www.horilla.com/blogs/how-to-implement-social-login-in-django/


#User Logout function
class UserLogout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=200)
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")

        return response


from django.http import HttpResponseRedirect

#google authentication time after pipe line save_userprofile then call this 

def oauth_redirect_handler(request):
    token_data = request.session.pop('token_data', None)  
    print("DADA",token_data)

    response = HttpResponseRedirect("http://localhost:5173/authredirect")

    if token_data:
        response.set_cookie(
            key="access_token",
            value=token_data['access_token'],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=3600,
        )
        response.set_cookie(
            key="refresh_token",
            value=token_data['refresh_token'],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=86400,
        )
        response.set_cookie(
            key="user_id",
            value=token_data['user_id'],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=86400,     
        )

    return response



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import PasswordSerializer,ProfileUpdateSerializer,AddBillingAddessSerializer


class PasswordChange(APIView):
    # IsAuthenticated handles token validation before entering the method.
    permission_classes=[IsAuthenticated]
    # self : Refers to the class instance
    # request: Carries the data from the frontend.  
    def post(self,request):
        serializer=PasswordSerializer(data=request.data,context={'request':request})
        # data=request.data: This is the JSON body you sent from React — currentPassword, newPassword, confirmpassword
        # context={'request': request}: You're passing the full request object as extra context, so that the serializer can access request.user.
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Password changed successfully"},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    

class profileupdate(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=ProfileUpdateSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Profile Updated Successfully.."},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


class AddBillingAddess(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddBillingAddessSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Billing Address Added Successfully.."},status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors, "data": request.data}, status=status.HTTP_400_BAD_REQUEST)

    
from userapp.serializers import BillingAddressSerializer,AddShippingAddessSerializer,GetShippingAddressSerializer
from common.models import UserAddress

class GetBillingAddress(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        address=UserAddress.objects.filter(user=request.user,address_type='billing').first()
        if address:
            serializer=BillingAddressSerializer(address)
            return Response(serializer.data)
        return Response({"error":"Address not found"},status=status.HTTP_404_NOT_FOUND)
    

class AddShippingAddess(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddShippingAddessSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Shipping Address Added Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"error":serializer.errors,"data":request.data},status=status.HTTP_400_BAD_REQUEST)
    

class GetShippingAddress(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        address=UserAddress.objects.filter(user=request.user,address_type='shipping').first()
        if address:
            serializer=GetShippingAddressSerializer(address)
            return Response(serializer.data)
        return Response({"error":"Address not found"},status=status.HTTP_404_NOT_FOUND)    

class AccountDeactivate(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        user=request.user
        user.is_active=False
        user.save()
        return Response({"message":"Account deactivated successfully."},status=status.HTTP_200_OK)

from userapp.serializers import AddtowalletSerializer
class AddToWallet(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddtowalletSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Money added successfully"},status=status.HTTP_200_OK)
        return Response({"errors":serializer.errors,"data":request.data},status=status.HTTP_400_BAD_REQUEST)
    

from common.models import ProductItem
from userapp.serializers import ProductViewSerializer,SellProductsSerializer

class ViewNewArrivals(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=ProductItem.objects.filter(status="approved")
        serializer=ProductViewSerializer(obj,many=True)
        return Response(serializer.data)


class ViewTopCollections(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,topfilter):
        print("FILTEERRRR",topfilter)
        if topfilter=="all":
            cate_status=None
        elif topfilter=="men":
            cate_status="Men's Wear"
        elif topfilter=="women":
            cate_status="Women's Wear"
        elif topfilter=="kids":
            cate_status="Kid's Wear"
        filters={"status":"approved"}
        if cate_status is not None:
            filters={"product__category__category_name":cate_status,"status":"approved"}
        obj=ProductItem.objects.filter(**filters)
        serializer=ProductViewSerializer(obj,many=True)
        return Response(serializer.data)

class ViewSellProduct(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=ProductItem.objects.filter(id=id)
        serializer=SellProductsSerializer(obj,many=True)
        return Response(serializer.data)

from userapp.serializers import AddReviewRatingSerializer,RatingReviewSerializer

class AddReviewRating(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddReviewRatingSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Review & Rating Added Successfully..."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured.."},status=status.HTTP_400_BAD_REQUEST)

from userapp.models import RatingsReview
class ViewRating(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,product_id):
        obj=RatingsReview.objects.filter(product=product_id)
        serializer=RatingReviewSerializer(obj,many=True)
        return Response(serializer.data)
    
from userapp.models import Wishlist
from common.models import Product
class AddToWishlist(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        try:
            user=request.user
            product=Product.objects.get(id=id)
            wishlist,created = Wishlist.objects.get_or_create(user=user)
            wishlist.products.add(product)
            return Response({"message": "Product added to wishlist."}, status=status.HTTP_201_CREATED)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

from userapp.models import Wishlist
from userapp.serializers import WishlistSerializer
class GetWishlist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        obj = Wishlist.objects.filter(user=user).prefetch_related('products')  # Optimize query with prefetch
        serializer = WishlistSerializer(obj, many=True)
        return Response(serializer.data)


class RemoveWishlist(APIView):
    def post(self,request,id):
        user=request.user

        try:
            wishlist=Wishlist.objects.get(user=user)

            product=Product.objects.get(id=id)

            wishlist.products.remove(product)
            return Response({"message": "Product removed from wishlist"}, status=status.HTTP_200_OK)

        except Wishlist.DoesNotExist:
            return Response({"error": "Wishlist not found"}, status=status.HTTP_404_NOT_FOUND)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from userapp.serializers import ProductDataSerializer

class fetchDropDownData(APIView):
    def get(self,request):
        obj=Product.objects.all()
        serializer=ProductDataSerializer(obj,many=True)
        return Response(serializer.data)

from userapp.serializers import DropCategorySerializer

from common.models import ProductCategory
class DropDownCategory(APIView):
    def get(self,request,cate_status):
        obj=ProductCategory.objects.filter(category_name=cate_status)
        serializer=DropCategorySerializer(obj,many=True)
        return Response(serializer.data)

# from userapp.serializers import CategoryProductSerializer

class FetchCategoryProduct(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,pro_name):
        obj=ProductItem.objects.filter(product__product_name=pro_name)
        serializer=ProductViewSerializer(obj,many=True)
        return Response(serializer.data)


from userapp.serializers import BannerShowSerializer
from sellerapp.models import Banner
class GetBanners(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Banner.objects.filter(is_active=True)
        serializer=BannerShowSerializer(obj,many=True)
        return Response(serializer.data)

from userapp.serializers import AddToCartSerializer,GetCartDataSerializer

class AddToCart(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        print("WORKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        serializer=AddToCartSerializer(data=request.data,context={"request":request,"id":id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Product added to cart."},status=status.HTTP_201_CREATED)
        return Response({"Error":str(serializer.errors)},status=status.HTTP_400_BAD_REQUEST)

from userapp.models import ShoppingCartItem
class GetCartData(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=self.request.user
        obj=ShoppingCartItem.objects.filter(shopping_cart__user=user).order_by('-id')
        serializer=GetCartDataSerializer(obj,many=True)
        return Response(serializer.data)
    

from common.models import CustomUser
from userapp.models import ProductItem
from userapp.models import ShoppingCart,ShoppingCartItem

class RemoveCartProduct(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        user=request.user
        user=CustomUser.objects.get(id=user.id)
        product_item=ProductItem.objects.get(id=id)
        shopping_cart=ShoppingCart.objects.get(user=user)
        cart_item=ShoppingCartItem.objects.get(shopping_cart=shopping_cart,product_item=product_item)
        cart_item.delete()
        return Response({"message":"Cart Product Removed..."})
    


# mission

from userapp.serializers import AddToCartSIzeSerializer,AddToCartQntySerializer

class CartProductSize(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        serializer=AddToCartSIzeSerializer(data=request.data,context={"request":request,"id":id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Size added to cart."},status=status.HTTP_201_CREATED)
        return Response({"Error":str(serializer.errors)},status=status.HTTP_400_BAD_REQUEST)
    


class CartProductQuantity(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request, id):
            # Instantiate the serializer with the request data and context
            serializer = AddToCartQntySerializer(data=request.data, context={"request": request, "id": id})

            if serializer.is_valid():
                # Save the validated data to trigger the create logic
                serializer.save()
                return Response({"message": "Cart updated successfully!"}, status=status.HTTP_200_OK)

            # Return errors if validation fails
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from userapp.serializers import ApplyCouponCodeSerializer,CouponValueSerializer

class ApplyCouponCode(APIView):
    def post(self,request):
        serializer=ApplyCouponCodeSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            coupon = serializer.validated_data["coupon"]
            coupon_data = CouponValueSerializer(coupon).data
            return Response({"message":"Coupon Applied Successfully..","coupon":coupon_data},status=status.HTTP_200_OK)
        return Response({"errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


from userapp.serializers import OfferProductsSerializer
from sellerapp.models import ProductOffer
class OfferProducts(APIView):
    def get(self,request):
        obj=ProductOffer.objects.all()
        serializer=OfferProductsSerializer(obj,many=True)
        return Response(serializer.data)





#razor pay

import razorpay

from django.conf import settings
# client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET_KEY))



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import razorpay
from common.models import ShopOrder  # Use your ShopOrder model
from common.models import PaymentGatewayConfig

class CreateRazorpayOrder(APIView):
    def post(self, request, *args, **kwargs):
        amount = float(request.data.get('amount')) * 100  # Convert to paise (1 INR = 100 paise)
        razorpay_config = PaymentGatewayConfig.objects.get(gateway_name="Razorpay", enabled=True)


        api_key = razorpay_config.api_key
        api_secret = razorpay_config.api_secret
        client = razorpay.Client(auth=(api_key, api_secret))
        # Create the Razorpay order
        order_data = {
            'amount': amount,
            'currency': 'INR',
            'payment_capture': '1',  # Automatically capture payment
        }
        order = client.order.create(data=order_data)

        # Return the order ID to the frontend
        return Response({"order_id": order['id']}, status=status.HTTP_201_CREATED)

class OrderPayment(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user  
        amount = request.data.get("amount")

        razorpay_config = PaymentGatewayConfig.objects.get(gateway_name="Razorpay", enabled=True)

        api_key = razorpay_config.api_key
        api_secret = razorpay_config.api_secret
        client = razorpay.Client(auth=(api_key, api_secret))

        # Create the Razorpay order
        razorpay_order = client.order.create(
            {"amount": int(amount) * 100, "currency": "INR", "payment_capture": "1"}
        )

        # Save order details in your ShopOrder model
        order = ShopOrder.objects.create(
            user=user,
            order_total=amount,
            final_total=amount,  # Adjust based on discounts or calculations
        )
        order.save()
        callback=razorpay_config.callback_url

        return Response({
            "callback_url": "https://127.0.0.1:8000/razorpay/callback/",
            # "callback_url": callback,
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "order_id": razorpay_order["id"],
        }, status=status.HTTP_201_CREATED)

class RazorpayCallback(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch the Razorpay payment details using payment ID from the query params
        payment_id = request.GET.get('payment_id')
        order_id = request.GET.get('order_id')

        razorpay_config = PaymentGatewayConfig.objects.get(gateway_name="Razorpay", enabled=True)
        api_key = razorpay_config.api_key
        api_secret = razorpay_config.api_secret
        client = razorpay.Client(auth=(api_key, api_secret))

        # Verify payment signature (this is for security and payment verification)
        payment = client.payment.fetch(payment_id)

        if payment['status'] == 'captured':
            # Payment was successful, update the order status in your DB
            order = ShopOrder.objects.get(id=order_id)  # Adjust query if needed
            order.payment_method = "Online Payment"  # Example placeholder
            order.order_status = "Paid"  # Assuming you map statuses to OrderStatus objects
            order.save()

            return Response({"message": "Payment successful!"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Payment failed!"}, status=status.HTTP_400_BAD_REQUEST)

from userapp.serializers import AddInitialOrderSerializer
class AddInitialOrder(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddInitialOrderSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Initial Order added successfully..."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured "},status=status.HTTP_400_BAD_REQUEST)
    
