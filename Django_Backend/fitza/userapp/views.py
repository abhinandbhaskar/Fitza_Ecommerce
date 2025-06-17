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
        serializer=RegisterSerializer(data=request.data,context={"request":request})
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

from notifications.notifiers import SecurityNotifier

class PasswordChange(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=PasswordSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            try:
                SecurityNotifier(user=request.user).password_change()
            except Exception as e:
                print(f"Failed to send notification: {str(e)}")

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
    
from sellerapp.models import ProductOffer
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

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail

class AccountDeactivate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_active = False
        user.save()

        return Response(
            {"message": "Account deactivated successfully."},
            status=status.HTTP_200_OK
        )


from common.models import ProductItem
from userapp.serializers import SellProductsSerializer
from userapp.serializers import ProductSerializer

class ViewNewArrivals(APIView):
    # permission_classes=[IsAuthenticated]
    def get(self,request):
        obj = Product.objects.filter(items__status="approved").distinct() 
        serializer=ProductSerializer(obj,many=True)
        return Response(serializer.data)


from userapp.serializers import DealsOfdayAllProducts

class GetDealsOfDay(APIView):
    # permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=ProductOffer.objects.all().order_by('-id')[:6]
        serializer=DealsOfdayAllProducts(obj,many=True)
        return Response(serializer.data)




# class ViewTopCollections(APIView):
#     permission_classes=[IsAuthenticated]
#     def get(self,request):
#         obj=ProductItem.objects.filter(status="approved")
#         serializer=ProductViewSerializer(obj,many=True)
#         return Response(serializer.data)


from userapp.serializers import ProductSerializer
from rest_framework.pagination import PageNumberPagination

from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12 
    page_size_query_param = 'page_size'
    max_page_size = 100

class ViewTopCollections(APIView):
    # permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        obj = Product.objects.filter(items__status="approved").distinct()
        
        # Set up pagination
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(obj, request)
        
        serializer = ProductSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


from userapp.serializers import ProductDetaileViewSerializer

class ViewSellProduct(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=Product.objects.get(id=id)
        serializer=ProductDetaileViewSerializer(obj)
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

from userapp.serializers import ProductViewSerializer

class FetchCategoryProduct(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pro_name):
        # Use icontains for partial matching and case insensitivity
        obj = Product.objects.filter(
            items__status="approved",
            product_name__icontains=pro_name
        ).distinct()
        
        serializer = ProductSerializer(obj, many=True)
        return Response(serializer.data)
    


# class FetchCategoryProduct(APIView):================================
#     permission_classes=[IsAuthenticated]
#     def get(self,request,pro_name):
#         obj=ProductItem.objects.filter(product__product_name=pro_name)
#         serializer=ProductViewSerializer(obj,many=True)
#         return Response(serializer.data)


from userapp.serializers import BannerShowSerializer
from sellerapp.models import Banner
class GetBanners(APIView):
    # permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Banner.objects.filter(is_active=True)
        serializer=BannerShowSerializer(obj,many=True)
        return Response(serializer.data)

from userapp.serializers import AddToCartSerializer,GetCartDataSerializer

class AddToCart(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,itemId):
        serializer=AddToCartSerializer(data=request.data,context={"request":request,"itemId":itemId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Product added to cart."},status=status.HTTP_201_CREATED)
        return Response({"Error":str(serializer.errors)},status=status.HTTP_400_BAD_REQUEST)

from userapp.models import ShoppingCartItem
class GetCartData(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=self.request.user
        address = UserAddress.objects.filter(user=user).first()
        obj=ShoppingCartItem.objects.filter(shopping_cart__user=user).order_by('-id')
        serializer=GetCartDataSerializer(obj,many=True)
        data={"cartdata":serializer.data,"postcode":address.postal_code}
        return Response(data)
    

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

from userapp.serializers import AddToCartQntySerializer



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

# class CreateRazorpayOrder(APIView):
#     def post(self, request, *args, **kwargs):
#         amount = float(request.data.get('amount')) * 100  # Convert to paise (1 INR = 100 paise)
#         razorpay_config = PaymentGatewayConfig.objects.get(gateway_name="Razorpay", enabled=True)
#         api_key = razorpay_config.api_key
#         api_secret = razorpay_config.api_secret
#         client = razorpay.Client(auth=(api_key, api_secret))
#         # Create the Razorpay order
#         order_data = {
#             'amount': amount,
#             'currency': 'INR',
#             'payment_capture': '1',  # Automatically capture payment
#         }
#         order = client.order.create(data=order_data)

#         # Return the order ID to the frontend
#         return Response({"order_id": order['id']}, status=status.HTTP_201_CREATED)



import logging
from django.core.exceptions import ObjectDoesNotExist

logger = logging.getLogger(__name__)

class CreateRazorpayOrder(APIView):
    def post(self, request, *args, **kwargs):
        try:
            amount = float(request.data.get('amount', 0))
            if amount <= 0:
                return Response(
                    {"error": "Amount must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Convert to paise (1 INR = 100 paise)
            amount_in_paise = int(amount * 100)
            
            # Get Razorpay config
            razorpay_config = PaymentGatewayConfig.objects.get(
                gateway_name="Razorpay",
                enabled=True
            )
            
            # Initialize Razorpay client
            client = razorpay.Client(auth=(
                razorpay_config.api_key,
                razorpay_config.api_secret
            ))
            
            # Get user details (if authenticated)
            user = request.user if request.user.is_authenticated else None
            user_name = user.get_full_name() if user else None
            user_email = user.email if user else None
            user_phone = user.phone_number if user else None
            
            # Create order
            order_data = {
                'amount': amount_in_paise,
                'currency': 'INR',
                'payment_capture': '1',  # Auto-capture payment
                'notes': {
                    'user_id': user.id if user else None,
                    'purpose': 'Payment for service'
                }
            }
            
            order = client.order.create(data=order_data)
            logger.info(f"Razorpay order created: {order['id']} for amount: {amount}")
            
            # Return order details + user info for prefill
            return Response(
                {
                    "order_id": order['id'],
                    "amount": amount,
                    "currency": "INR",
                    "user": {
                        "name": user_name,      # Full name (or username if no full name)
                        "email": user_email,    # User's email
                        "phone": user_phone,    # User's phone number
                    }
                },
                status=status.HTTP_201_CREATED
            )
            
        except ObjectDoesNotExist:
            logger.error("Razorpay configuration not found or disabled")
            return Response(
                {"error": "Payment gateway currently unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        except ValueError:
            logger.error("Invalid amount received")
            return Response(
                {"error": "Invalid amount specified"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Error creating Razorpay order: {str(e)}", exc_info=True)
            return Response(
                {"error": "Unable to process payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



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
            # "callback_url": "https://127.0.0.1:8000/razorpay/callback/",
            "callback_url": "http://127.0.0.1:8000/razorpay/callback/",
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
            order = serializer.save()
            return Response({"message":"Initial Order added successfully...", "order_id": order.id},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured "},status=status.HTTP_400_BAD_REQUEST)
    

from common.models import Shipping,Payment,UserAddress

from userapp.serializers import PaymentSerializer


class SavePaymentDetails(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, cartId):
        print("Received Data:", request.data)
        print("CARTIDAAAAAAAAD", cartId)
        serializer = PaymentSerializer(data=request.data, context={"request": request, "cartId": cartId})
        
        if serializer.is_valid():
            payment = serializer.save()  # Save and get the payment object
            return Response({
                "message": "Payment and shipping details saved successfully.",
                "payment_id": payment.id  # Include the payment ID in the response
            }, status=status.HTTP_201_CREATED)
        
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)




from userapp.serializers import AskQuestionSerializer
class AskQuestion(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AskQuestionSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Question Asked Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    

from userapp.models import Answer,Question

class GetQandAUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,pid):
        productobj=Product.objects.get(id=pid)
        print("Pross",productobj)
        user = request.user
        questions = Question.objects.filter(user=user,product=productobj).select_related('answer', 'product')
        
        data = []
        for question in questions:
            data.append({
                "id": question.id,
                "user": question.user.username,
                "avatar": question.user.userphoto.url if question.user.userphoto else '',
                "askedAt": question.created_at,
                "question": question.question_text,
                "product": question.product.product_name,
                "answer": question.answer.answer_text if hasattr(question, 'answer') else None,
                "answeredBy": question.answer.answered_by.username if hasattr(question, 'answer') else None,
            })
        
        return Response(data)

from userapp.serializers import GetUserOrdersSerializer
class GetUserOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        obj = ShopOrder.objects.filter(user=user, bill__isnull=False).order_by('-id')  # Filter orders for the logged-in user
        serializer = GetUserOrdersSerializer(obj, many=True)
        return Response(serializer.data)


from userapp.serializers import AddUserFeedBackSerializer

class AddShopFeedBack(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,ssid):
        serializer=AddUserFeedBackSerializer(data=request.data,context={"request":request,"sid":ssid})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Feedback Added Successfully..."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured.."},status=status.HTTP_400_BAD_REQUEST)

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from userapp.models import Bill
from common.models import Payment
from django.db import IntegrityError

class BillGenerator(APIView):
    def post(self, request):
        payment_id = request.data.get("payment_id")
        if not payment_id:
            return Response({"error": "Payment ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment_instance = Payment.objects.get(id=payment_id)
            
            # if payment_instance.status != 'completed':
            #     return Response({"error": "Bill can only be generated for completed payments."}, status=status.HTTP_400_BAD_REQUEST)
            
            shop_order = payment_instance.order
            
            # Check if bill already exists (using reverse OneToOne relation)
            if Bill.objects.filter(order=shop_order).exists():
                return Response({"error": "Bill already exists for this order."}, status=status.HTTP_400_BAD_REQUEST)
        
            # Get billing address (if exists)
            billing_address = shop_order.user.addresses.filter(address_type='billing').first()
            
            # Create the bill
            bill = Bill.objects.create(
                order=shop_order,
                total_amount=shop_order.final_total,
                tax=shop_order.tax_amount,
                discount=shop_order.discount_amount,
                billing_address=billing_address,
                payment_status='paid',
                invoice_number=f"INV-{payment_instance.transaction_id}",
                payment=payment_instance,
                created_by=shop_order.user,
                currency='INR',  # Explicitly set if needed
            )
            
            return Response(
                {"message": "Bill generated successfully.", "bill_id": bill.id}, 
                status=status.HTTP_201_CREATED
            )
        
        except Payment.DoesNotExist:
            return Response({"error": "Invalid Payment ID."}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError as e:
            return Response({"error": "Invoice number conflict or duplicate bill."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from userapp.models import Bill, ShopOrder
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter



class GetBillAPIView(APIView):
    """
    API View to generate a PDF invoice with correct data from models.
    """

    def get(self, request, order_id):
        try:
            # Fetch order and related data
            order = ShopOrder.objects.select_related(
                'user', 
                'shipping',
                'payment_method',
                'order_status'
            ).get(id=order_id)
            
            bill = Bill.objects.select_related(
                'billing_address',
                'payment'
            ).get(order=order)
            
            # Get all order items - adjust this based on your actual relationship
            # If you have a through model for order items, use that instead
            order_items = order.order_lines.all()  # Change this to your actual relationship
            
            shipping = order.shipping
            payment = order.payment_method

            # Create PDF buffer
            buffer = BytesIO()
            pdf = canvas.Canvas(buffer, pagesize=letter)
            width, height = letter

            # --- Header: Seller & Invoice Metadata ---
            pdf.setFont("Helvetica-Bold", 16)
            pdf.drawCentredString(width / 2, height - 50, "INVOICE")
            pdf.setFont("Helvetica", 10)

            # Seller Details (Left)
            pdf.drawString(50, height - 80, "Fitza")
            pdf.drawString(50, height - 95, "Kanhangad Kasaragod, Kerala India")
            pdf.drawString(50, height - 110, "+91 9876543210")
            pdf.drawString(50, height - 125, "support@fitza.com")

            # Invoice Metadata (Right)
            pdf.drawRightString(width - 50, height - 80, f"Invoice Number: {bill.invoice_number}")
            pdf.drawRightString(width - 50, height - 95, f"Invoice Date: {bill.bill_date.strftime('%m/%d/%Y')}")
            pdf.drawRightString(width - 50, height - 110, f"Purchase Order Number: 1010{order.id}")
            pdf.drawRightString(width - 50, height - 125, f"Order Date: {order.order_date.strftime('%m/%d/%Y')}")

            # --- Buyer Details ---
            pdf.line(50, height - 140, width - 50, height - 140)
            pdf.setFont("Helvetica-Bold", 12)
            pdf.drawString(50, height - 160, "Bill To:")
            pdf.setFont("Helvetica", 10)
            
            if bill.billing_address:
                pdf.drawString(50, height - 175, f"{bill.billing_address.user.first_name+bill.billing_address.user.last_name}")
                pdf.drawString(50, height - 185, f"{bill.billing_address.address_line1}")
                pdf.drawString(50, height - 195, f"{bill.billing_address.address_line2}")
                pdf.drawString(50, height - 205, f"{bill.billing_address.city}, {bill.billing_address.state} {bill.billing_address.postal_code}")
                pdf.drawString(50, height - 215, f"{bill.billing_address.phone}")
                pdf.drawString(50, height - 225, f"{order.user.email}")
            else:
                pdf.drawString(50, height - 175, f"{order.user.get_full_name()}")
                pdf.drawString(50, height - 190, "Address not specified")
                pdf.drawString(50, height - 205, f"{order.user.phone if hasattr(order.user, 'phone') else 'N/A'}")
                pdf.drawString(50, height - 220, f"{order.user.email}")

            # --- Shipping Details ---
            if shipping and shipping.shipping_address:
                pdf.setFont("Helvetica-Bold", 12)
                pdf.drawString(50, height - 260, "Ship To:")
                pdf.setFont("Helvetica", 10)
                pdf.drawString(50, height - 275, f"{shipping.shipping_address.user.first_name+shipping.shipping_address.user.last_name}")
                pdf.drawString(50, height - 290, f"{shipping.shipping_address.address_line1}")
                pdf.drawString(50, height - 290, f"{shipping.shipping_address.address_line2}")
                pdf.drawString(50, height - 305, f"{shipping.shipping_address.city}, {shipping.shipping_address.state} {shipping.shipping_address.postal_code}")
                pdf.drawString(50, height - 320, f"Tracking: {shipping.tracking_id or 'Not available'}")
                pdf.drawString(50, height - 335, f"Status: {shipping.get_status_display()}")
                if shipping.estimated_delivery_date:
                    pdf.drawString(50, height - 350, f"Est. Delivery: {shipping.estimated_delivery_date.strftime('%m/%d/%Y')}")
                
                y_position = height - 370
            else:
                y_position = height - 260

            # --- Line Items Table ---
            pdf.line(50, y_position - 10, width - 50, y_position - 10)
            pdf.setFont("Helvetica-Bold", 10)
            pdf.drawString(50, y_position - 25, "Item")
            pdf.drawString(250, y_position - 25, "Quantity")
            pdf.drawString(350, y_position - 25, "Price per unit")
            pdf.drawString(450, y_position - 25, "Amount")
            pdf.line(50, y_position - 30, width - 50, y_position - 30)

            # Actual order items
            y_position -= 50
            for item in order_items:  # Use your actual order items relationship
                pdf.setFont("Helvetica", 10)
                pdf.drawString(50, y_position, f"{item.product_item.product.product_name}")
                pdf.drawString(250, y_position, f"{item.quantity}")
                pdf.drawString(350, y_position, f"Rs. {item.price:.2f}")
                pdf.drawString(450, y_position, f"Rs. {item.price * item.quantity:.2f}")
                y_position -= 20

            # --- Totals Section ---
            pdf.line(50, y_position - 20, width - 50, y_position - 20)
            pdf.setFont("Helvetica-Bold", 10)
            
            # Subtotal
            pdf.drawString(350, y_position - 40, "Subtotal:")
            pdf.drawString(450, y_position - 40, f"Rs. {order.order_total:.2f}")
            
            # Shipping
            if shipping and shipping.shipping_cost:
                pdf.drawString(350, y_position - 55, "Shipping:")
                shipping_cost = 0.00 if order.free_shipping_applied else shipping.shipping_cost
                pdf.drawString(450, y_position - 55, f"Rs. {shipping_cost:.2f}")
                if order.free_shipping_applied:
                    pdf.drawString(350, y_position - 65, "(Free Shipping Applied)")
            
            # Tax
            if payment and payment.platform_fee:
                pdf.drawString(350, y_position - 75, f"Platform fee :")
                pdf.drawString(450, y_position - 75, f"Rs. {payment.platform_fee:.2f}")             


            pdf.drawString(350, y_position - 90, f"Tax:")
            pdf.drawString(450, y_position - 90, f"Rs. {order.tax_amount:.2f}")
            
            # Discount

            pdf.drawString(350, y_position - 110, "Discount:")
            pdf.drawString(450, y_position - 110, f"Rs. - {order.discount_amount:.2f}")
            if order.applied_coupon.discount_type=="fixed":
                pdf.drawString(350, y_position - 125, "Coupon:")
                pdf.drawString(450, y_position - 125, f"Rs. -{order.applied_coupon.discount_value}")
            if order.applied_coupon.discount_type=="percentage":
                pdf.drawString(350, y_position - 125, "Coupon:")
                pdf.drawString(450, y_position - 125, f" {order.applied_coupon.discount_value}%")
            
            # Grand Total
            pdf.line(350, y_position - 150, width - 50, y_position - 150)
            pdf.setFont("Helvetica-Bold", 12)
            pdf.drawString(350, y_position - 170, "TOTAL:")
            pdf.drawString(450, y_position - 170, f"Rs. {order.final_total:.2f}")

            # --- Payment Information ---
            pdf.setFont("Helvetica-Bold", 10)
            pdf.drawString(50, y_position - 200, "Payment Information:")
            pdf.setFont("Helvetica", 10)
            
            if payment:
                pdf.drawString(50, y_position - 215, f"Method: {payment.payment_method}")
                pdf.drawString(50, y_position - 230, f"Status: {payment.get_status_display()}")
                pdf.drawString(50, y_position - 245, f"Transaction ID: {payment.transaction_id}")
            else:
                pdf.drawString(50, y_position - 215, "Payment information not available")

            # --- Footer: Terms & Notes ---
            pdf.setFont("Helvetica-Bold", 9)
            pdf.drawString(50, y_position - 260, "Terms and Conditions:")
            terms = bill.notes or "Payment due upon receipt. Late payments may incur fees."
            pdf.drawString(50, y_position - 275, terms)

            # Save PDF
            pdf.save()
            buffer.seek(0)

            # Return PDF response
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Invoice_{bill.invoice_number}.pdf"'
            return response

        except ShopOrder.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found."}, status=404)




from userapp.serializers import SendReturnRefundSerializer
class SendReturnRefund(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,orderId):
        serializer=SendReturnRefundSerializer(data=request.data,context={"request":request,"orderId":orderId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Refund Return Added Successfully..."},status=status.HTTP_200_OK)
        return Response({"errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
from userapp.models import ReturnRefund
from userapp.serializers import GetReturnRefundStatusSerializer
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

class GetReturnRefundStatus(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, orderId):
        try:
            order = ShopOrder.objects.get(id=orderId, user=request.user)
            obj = ReturnRefund.objects.get(order=order)
            serializer = GetReturnRefundStatusSerializer(obj)
            return Response(serializer.data)
        except ShopOrder.DoesNotExist:
            return Response(
                {"error": "Order not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except ReturnRefund.DoesNotExist:
            return Response(
                {"error": "Return/Refund request not found for this order"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


from userapp.serializers import CustomerCancelOrderSerializer
class CustomerCancelOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, orderId):
        serializer = CustomerCancelOrderSerializer(data=request.data, context={"request": request, "orderId": orderId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Order Cancelled..."}, status=status.HTTP_200_OK)
        return Response({"error": "Error Occurred..."}, status=status.HTTP_400_BAD_REQUEST)



from sellerapp.models import Notification
from userapp.serializers import ViewUserAllNotificationsSerializer
class ViewUserAllNotifications(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user,group='all_users') 
        serializer = ViewUserAllNotificationsSerializer(notifications, many=True) 
        return Response(serializer.data)
    

from sellerapp.models import Notification
class MarksUserRead(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        obj=Notification.objects.get(id=id)
        obj.is_read=True
        obj.save()
        return Response({"message":"Mark As Read...."},status=status.HTTP_200_OK)
    
class UserUnreadNotifications(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        obj=Notification.objects.filter(user=user,group='all_users',is_read=False)
        serializer={"notifications":len(obj)}
        return Response(serializer)



#find location

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import requests
from django.http import JsonResponse

def test_pincode_distance(request):
    import requests
    from django.http import JsonResponse

    start_pincode = request.GET.get('start_pincode')
    end_pincode = request.GET.get('end_pincode')

    try:
        # Step 1: Geocode PIN codes to coordinates (using Nominatim/OSM)
        def get_coordinates(pincode, country="India"):
            response = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "postalcode": pincode,
                    "country": country,
                    "format": "json",
                    "limit": 1
                },
                headers={"User-Agent": "YourAppName"}  # Required by Nominatim
            )
            data = response.json()
            if data:
                return f"{data[0]['lon']},{data[0]['lat']}"
            return None

        start_coords = get_coordinates(start_pincode)
        end_coords = get_coordinates(end_pincode)

        if not start_coords or not end_coords:
            return JsonResponse({"error": "Geocoding failed for one or both PIN codes"})

        # Step 2: Calculate driving distance via OpenRouteService
        OPENROUTE_API_KEY = "5b3ce3597851110001cf6248ea0e2aae29944a8ba4c48c397f55cd55"  # Replace with your actual key
        route_response = requests.get(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            params={
                "api_key": OPENROUTE_API_KEY,
                "start": start_coords,
                "end": end_coords
            },
            headers={"Accept": "application/geo+json"}
        )
        route_data = route_response.json()

        # Extract distance in kilometers
        distance_km = route_data["features"][0]["properties"]["segments"][0]["distance"] / 1000

        # Step 3: Calculate shipping fee based on distance
        def calculate_shipping_fee(distance):
            if distance < 30:
                return 0
            elif 30 <= distance <= 80:
                return 15
            elif 80 < distance <= 150:
                return 30
            elif 150 < distance <= 300:
                return 50
            elif 300 < distance <= 600:
                return 75
            elif 600 < distance <= 1000:
                return 100
            elif 1000 < distance <= 1500:
                return 150
            else:
                return "Distance exceeds shipping limit."

        shipping_fee = calculate_shipping_fee(distance_km)

        return JsonResponse({
            "start_pincode": start_pincode,
            "end_pincode": end_pincode,
            "distance_km": round(distance_km, 2),
            "shipping_fee": shipping_fee,
            "coordinates": {
                "start": start_coords,
                "end": end_coords
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)})

from userapp.serializers import GetDiscountCardsSerializer
from sellerapp.models import DiscountCard  
class GetDiscountCard(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=DiscountCard.objects.all().order_by('-id')
        serializer=GetDiscountCardsSerializer(obj,many=True)
        return Response(serializer.data)


   


from sellerapp.models import FreeShippingOffer
from userapp.serializers import FreeShipDataSerializer
class FreeshipOffers(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=FreeShippingOffer.objects.all().order_by('-id')
        serializer=FreeShipDataSerializer(obj,many=True)
        return Response(serializer.data)

class CompareProducts(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        print("Workingsssss.....................")
        product_obj=Product.objects.get(id=id)
        obj=Product.objects.filter(product_name=product_obj.product_name)
        serializer=ProductDetaileViewSerializer(obj,many=True)
        return Response(serializer.data)