from django.shortcuts import redirect, render
from rest_framework.views import APIView
from sellerapp.serializers import SellerRegisterSerializer,VerifyOtpSerializer,ShopRegisterSerializer,SellerBankRegisterSerializer
from rest_framework.response import Response
from rest_framework import status
import time
import smtplib
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class SellerRegisterAPI(APIView):
    def post(self,request):
        serializer = SellerRegisterSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message": "Registration successful. OTP has been sent to your email."}, status=status.HTTP_201_CREATED)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
import hmac
from sellerapp.serializers import generate_otp


class VerifyOtp(APIView):
    def post(self, request):
        email = request.session.get("email")
        stored_otp = request.session.get("otp")
        exp_time = request.session.get("exp_time")

        if not email or not stored_otp or not exp_time:
            return Response(
                {"message": "Session expired or invalid. Please request a new OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = VerifyOtpSerializer(data=request.data, context={"request": request, "email": email})
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        otp = serializer.validated_data["otp"]
        user = serializer.validated_data["user"]


        if not hmac.compare_digest(otp, stored_otp):
            return Response(
                {"message": "The OTP entered is incorrect. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        current_time = datetime.now().timestamp()
        if current_time > exp_time:
            del request.session["otp"]
            del request.session["exp_time"]
            request.session.save()
            return Response(
                {"message": "The OTP has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # user.is_active = True
        user.save()

        del request.session["otp"]
        del request.session["exp_time"]
        request.session.save()

        return Response(
            {"message": "OTP verification completed successfully."},
            status=status.HTTP_200_OK,
        )



from django.conf import settings

class ResendOtp(APIView):
    def post(self,request):
        email=request.session.get("email")
        if not email:
            return Response({
                "message":"Session expired or email not found. Please try again."
            },status=status.HTTP_400_BAD_REQUEST)
        otp,exp_time=generate_otp()
        sender_email=settings.EMAIL_HOST_USER
        sender_password=settings.EMAIL_HOST_PASSWORD
        if not sender_email or not sender_password:
            return Response({
                "message":"Email server configuration is missing. Please contact support."
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        receiver_mail = email

        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                message = (
                    f"Subject: OTP Verification\n\n"
                    f"Hello,\n\n"
                    f"Your OTP for verification is: {otp}. It will expire in 60 seconds.\n\n"
                    "Thank you!"
                )
                server.sendmail(sender_email, receiver_mail, message)
        except smtplib.SMTPException as e:
            print(f"SMTP Error: {e}")
            return Response({"message":"Failed to send OTP email. Please try again later."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        request.session["otp"]=otp
        request.session["exp_time"]=exp_time
        request.session.save() 
        return Response({
            "message":"OTP has been resent successfully."
        },status=status.HTTP_200_OK)

class ShopRegister(APIView):
    def post(self,request):
        email=request.session.get("email")
        serializer=ShopRegisterSerializer(data=request.data,context={"request":request,"email":email})
        if not serializer.is_valid():
            return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message":"Shop Register Completed.."},status=status.HTTP_201_CREATED)
    

class SellerBankRegister(APIView):
    def post(self, request):
        email = request.session.get("email")
        if not email:
            return Response({"message": "Session expired or email not found."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = SellerBankRegisterSerializer(data=request.data, context={"request": request, "email": email})
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({"message": "Bank Details Added Successfully.."}, status=status.HTTP_201_CREATED)


from rest_framework_simplejwt.views import TokenObtainPairView
from sellerapp.serializers import SellerTokenObtainPairSerializer
class SellerTokenObtainPairView(TokenObtainPairView):
    serializer_class=SellerTokenObtainPairSerializer

    def post(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response=Response(serializer.validated_data,status=status.HTTP_200_OK)

        response.set_cookie(
            key="refresh_token",
            value=serializer.validated_data["refresh"],
            httponly=True,
            secure=True,
            samesite=None,
            path="/",
             max_age=60 * 60 * 24 * 7
        )    
        response.data.pop("refresh",None)

        return response
    

class SellerLogout(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        response=Response({"message":"Logged out successfully.."},status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        return response

from sellerapp.serializers import ProfileSerializer,SellerShopSerializer,SellerBankDetailsSerializer

class SellerProfile(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        print("XXXXXX",user)
        serializer=ProfileSerializer(user)
        return Response(serializer.data)
    
from common.models import Seller,SellerBankDetails
class SellerShop(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        print("YYY",user)
        seller=Seller.objects.get(user_id=user.id)
        serializer=SellerShopSerializer(seller)
        return Response(serializer.data)
    
class BankDetails(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        seller=Seller.objects.get(user_id=user.id)
        bank=SellerBankDetails.objects.get(seller_id=seller.id)
        serializer=SellerBankDetailsSerializer(bank)
        return Response(serializer.data)

from sellerapp.serializers import UpdateProfileSerializer,UpdateShopSerializer,BankUpdateSerializer

class UpdateProfile(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        data=request.data
        serializer=UpdateProfileSerializer(data=data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Profile Updated Successfully..."},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        
class UpdateShop(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=UpdateShopSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Shop Details Updated Successfully"},status=status.HTTP_200_OK)
        return Response({"message":"Error Occured"},status=status.HTTP_400_BAD_REQUEST)
    

class BankUpdate(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=BankUpdateSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Bank Details Updated Successfully"},status=status.HTTP_200_OK)
        return Response({"message":"Error While Update Bank details"},status=status.HTTP_400_BAD_REQUEST)
    

from common.models import ProductCategory,Brand,Color,SizeOption
from sellerapp.serializers import GetCategorySerializer,GetBrandsSerializer,GetColorSerializer,GetSizeSerializer

class GetCategory(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=ProductCategory.objects.all()
        serializer=GetCategorySerializer(obj,many=True)
        return Response(serializer.data)



class GetBrands(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Brand.objects.all()
        serializer=GetBrandsSerializer(obj,many=True)
        return Response(serializer.data)
    

class GetColor(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Color.objects.all()
        serializer=GetColorSerializer(obj,many=True)
        return Response(serializer.data)
    

class GetSize(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=SizeOption.objects.all()
        serializer=GetSizeSerializer(obj,many=True)
        return Response(serializer.data)


from sellerapp.serializers import AddProductsSerializer,GetAllProductsSerializer

class AddProducts(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddProductsSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"message": "Product added successfully."}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

from common.models import ProductItem

class GetAllProducts(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        user=request.user
        try:
            seller=Seller.objects.get(user=user)
        except Seller.DoesNotExist:
            return Response({"error":"You are not authorized to access products."},status=status.HTTP_403_FORBIDDEN)
        if id==1:
            statusvalue=None
        elif id==2:
            statusvalue="pending"
        elif id==3:
            statusvalue="rejected"
        elif id==4:
            statusvalue="approved"
        
        # Build query dynamically
        filters = {"product__shop": seller}
        if statusvalue is not None:  
            filters["status"] = statusvalue
        product_items = ProductItem.objects.filter(**filters)
        serializer=GetAllProductsSerializer(product_items,many=True)
        return Response(serializer.data)


class ViewStock(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        try:
            seller=Seller.objects.get(user=user)
        except Seller.DoesNotExist:
            return Response({"error":"You are not authorized to access products."},status=status.HTTP_403_FORBIDDEN)
        total_products = ProductItem.objects.filter(product__shop=seller)
        pending = ProductItem.objects.filter(product__shop=seller,status="pending")
        approve = ProductItem.objects.filter(product__shop=seller,status="approved")
        reject = ProductItem.objects.filter(product__shop=seller,status="rejected")
        serializer={"total_products":len(total_products),"pending":len(pending),"approve":len(approve),"reject":len(reject)}
        return Response(serializer)
        
from sellerapp.serializers import RatingReviewSerializer        
from userapp.models import RatingsReview
class ViewUserReviews(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=RatingsReview.objects.all()
        serializer=RatingReviewSerializer(obj,many=True)
        return Response(serializer.data)

from sellerapp.serializers import ViewUserQuestionsSerializer
from userapp.models import Question
class ViewUserQuestions(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Question.objects.filter(answer__isnull=True)
        serilizer=ViewUserQuestionsSerializer(obj,many=True)
        return Response(serilizer.data)


from sellerapp.serializers import UserAnswerSerializer
class UserAnswer(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = UserAnswerSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"message": "Replayed successfully."}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        

class ViewAnsweredQues(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Question.objects.filter(answer__isnull=False)
        serilizer=ViewUserQuestionsSerializer(obj,many=True)
        return Response(serilizer.data)


from sellerapp.serializers import AddSellerComplaintSerializer

class AddSellerComplaint(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddSellerComplaintSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Complaint Added.."},status=status.HTTP_201_CREATED)
        return Response({"error":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
from adminapp.models import Complaint
from sellerapp.serializers import ViewSellerComplaintsSerializer
class ViewSellerComplaints(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        obj=Complaint.objects.filter(seller=user).order_by('id')
        serializer=ViewSellerComplaintsSerializer(obj,many=True)
        return Response(serializer.data)

from rest_framework.exceptions import NotFound
from adminapp.models import ComplaintMessage
from sellerapp.serializers import ViewUserComplaintSerializer
class ViewUserComplaint(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cid):
        try:
            complaint = Complaint.objects.get(id=cid)
        except Complaint.DoesNotExist:
            raise NotFound("Complaint not found.")

        messages = ComplaintMessage.objects.filter(complaint=complaint).order_by("timestamp")
        serializer = ViewUserComplaintSerializer(messages, many=True)
        return Response(serializer.data)

from sellerapp.serializers import SellerReplySerializer
class SellerReplyComplaint(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        serializer = SellerReplySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "message": "replayed successfully."}, status=status.HTTP_200_OK)
        return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

from sellerapp.serializers import ViewAllUserFeedbacksSerializer,AddSellerFeedBackSerializer
from userapp.models import Feedback
class ViewAllUserFeedbacks(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        sellerobj=Seller.objects.get(user=user)
        obj=Feedback.objects.filter(seller=sellerobj,platform=False)
        serializer=ViewAllUserFeedbacksSerializer(obj,many=True)
        return Response(serializer.data)
    
class AddSellerFeedBacks(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddSellerFeedBackSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Feedback Added Successfully..."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured.."},status=status.HTTP_400_BAD_REQUEST)

from sellerapp.serializers import ViewOrderedUsersSerializer
from userapp.models import OrderLine
from common.models import CustomUser

from collections import Counter
from datetime import datetime

class ViewOrderedUsers(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        seller = CustomUser.objects.get(id=user.id)
        obj = OrderLine.objects.filter(seller=seller)
        serializer = ViewOrderedUsersSerializer(obj, many=True)
        
        user_data = {}
        for entry in serializer.data:
            user_info = entry['order']['user']
            email = user_info['email']
            if email not in user_data:
                user_data[email] = {
                    "user_id": user_info['id'],
                    "full_name": user_info['first_name'],
                    "email": email,
                    "phone": user_info['phone_number'],
                    "order_dates": [],
                }
            user_data[email]["order_dates"].append(entry['order']['order_date'])

        user_details = []
        for data in user_data.values():
            user_details.append({
                "UserID": data["user_id"],
                "FullName": data["full_name"],
                "Email": data["email"],
                "Phone": data["phone"],
                "OrderDate": max(data["order_dates"]),  
                "TotalOrders": len(data["order_dates"])
            })
        return Response(user_details)


from sellerapp.serializers import OrderLineMainSerializer
from common.models import ShopOrder
from userapp.models import OrderLine
class SellerViewOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        seller = CustomUser.objects.get(id=user.id)
        processing = OrderLine.objects.filter(seller=seller,order__order_status__status="processing")
        confirm = OrderLine.objects.filter(seller=seller,order__order_status__status="confirm")
        readyfordispatch = OrderLine.objects.filter(seller=seller,order__order_status__status="ready-for-dispatch")
        cancelled = OrderLine.objects.filter(seller=seller,order__order_status__status="cancelled")
        delivered = OrderLine.objects.filter(seller=seller,order__order_status__status="delivered")
        obj = OrderLine.objects.filter(seller=seller)
        serializer=OrderLineMainSerializer(obj,many=True)
        ordercount={"processing":len(processing),"confirm":len(confirm),"readyfordispatch":len(readyfordispatch),"cancelled":len(cancelled),"delivered":len(delivered)}
        fetchdata={"orders":serializer.data,"counts":ordercount}
        return Response(fetchdata)

from sellerapp.serializers import UpdateOrderShippingSerializer
class UpdateOrderShipping(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = UpdateOrderShippingSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "updated successfully"}, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

from userapp.models import ReturnRefund
from sellerapp.serializers import GetAllReturnRefundSerializer
from rest_framework.permissions import IsAuthenticated
class GetAllReturnRefund(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        seller = request.user
        obj = ReturnRefund.objects.filter(
            order__order_lines__seller=seller
        ).distinct()  
        serializer = GetAllReturnRefundSerializer(obj, many=True)
        return Response(serializer.data)




from sellerapp.serializers import HandleEscalationSerializer
class HadleEscalation(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,returnId):
        serializer=HandleEscalationSerializer(data=request.data,context={"request":request,"returnId":returnId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Escalation Reason successfully.."},status=status.HTTP_200_OK)
        return Response({"errors":"Error occured..."},status=status.HTTP_400_BAD_REQUEST)


from sellerapp.serializers import HandleReturnedSerializer
class HandleReturned(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,returnId):
        serializer=HandleReturnedSerializer(data=request.data,context={"request":request,"returnId":returnId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Returned successfully.."},status=status.HTTP_200_OK)
        return Response({"errors":"Error occured..."},status=status.HTTP_400_BAD_REQUEST)
    

from sellerapp.models import Notification
from sellerapp.serializers import ViewSellerAllNotificationsSerializer
class ViewSellerAllNotifications(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user,group='all_sellers') 
        serializer = ViewSellerAllNotificationsSerializer(notifications, many=True) 
        return Response(serializer.data)

from sellerapp.models import Notification

class MarkSellerRead(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        obj=Notification.objects.get(id=id)
        obj.is_read=True
        obj.save()
        return Response({"message":"Mark As Read...."},status=status.HTTP_200_OK)

class UnReadSellerNotifications(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        obj=Notification.objects.filter(group='all_sellers',is_read=False,user=user)
        serializer={"notifications":len(obj)}
        return Response(serializer)
    

from userapp.models import Bill
from sellerapp.serializers import BillRevenueSerializer

# class ViewSellerRevenue(APIView):
#     permission_classes=[IsAuthenticated]
#     def get(self,request):
#         user = request.user
#         seller = CustomUser.objects.get(id=user.id)
#         order_lineobj = OrderLine.objects.filter(seller=seller)
#         obj=Bill.objects.filter(order__bill=order_lineobj.order_lines).filter(payment_status='paid')
#         serializer=BillRevenueSerializer(obj,many=True)
#         return Response(serializer.data)


from django.db.models import Q

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    

class ViewSellerRevenue(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        user = request.user
        if not user.is_seller():
            return Response({"error": "You are not authorized to view this data."}, status=403)
        
        order_lines = OrderLine.objects.filter(seller=user)
        seller_orders = ShopOrder.objects.filter(order_lines__in=order_lines).distinct()
        bills = Bill.objects.filter(order__in=seller_orders)
        
        # Get all bills data for calculations
        serializer = BillRevenueSerializer(bills, many=True)
        bills_data = serializer.data

        # Calculate totals in Python
        total_revenue = sum(float(bill['total_amount']) for bill in bills_data)
        
        seller_earnings = sum(
            float(bill['total_amount']) - float(bill['payment']['platform_fee']) 
            for bill in bills_data 
            if bill.get('payment', {}).get('platform_fee')
        )
        
        refund_amount = 0
        for bill in bills_data:
            returns = bill.get('order', {}).get('returns', [])
            if returns:
                refund_amount += sum(
                    float(ret['approved_refund_amount']) 
                    for ret in returns 
                    if ret.get('status') == "completed"
                )

        details = {
            "total_revenue": total_revenue,
            "seller_earnings": seller_earnings,
            "refund_amount": refund_amount
        }

        # Paginate the results
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(bills, request)
        serializer = BillRevenueSerializer(result_page, many=True)
        
        # Combine paginated data with details
        response_data = {
            "details": details,
            "transactions": serializer.data,
            "pagination": {
                "count": paginator.page.paginator.count,
                "next": paginator.get_next_link(),
                "previous": paginator.get_previous_link()
            }
        }
        
        return Response(response_data)




# pagination 


# from rest_framework.pagination import PageNumberPagination

# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10
#     page_size_query_param = 'page_size'
#     max_page_size = 100

# class ViewSellerRevenue(APIView):
#     permission_classes = [IsAuthenticated]
#     pagination_class = StandardResultsSetPagination

#     def get(self, request):
#         user = request.user
#         if not user.is_seller():
#             return Response({"error": "You are not authorized to view this data."}, status=403)
        
#         order_lines = OrderLine.objects.filter(seller=user)
#         seller_orders = ShopOrder.objects.filter(order_lines__in=order_lines).distinct()
#         bills = Bill.objects.filter(order__in=seller_orders)
        
#         # Add pagination
#         paginator = self.pagination_class()
#         result_page = paginator.paginate_queryset(bills, request)
#         serializer = BillRevenueSerializer(result_page, many=True)
        
#         return paginator.get_paginated_response(serializer.data)

    
class SellerViewOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        seller = CustomUser.objects.get(id=user.id)
        processing = OrderLine.objects.filter(seller=seller,order__order_status__status="processing")
        confirm = OrderLine.objects.filter(seller=seller,order__order_status__status="confirm")
        readyfordispatch = OrderLine.objects.filter(seller=seller,order__order_status__status="ready-for-dispatch")
        cancelled = OrderLine.objects.filter(seller=seller,order__order_status__status="cancelled")
        delivered = OrderLine.objects.filter(seller=seller,order__order_status__status="delivered")
        obj = OrderLine.objects.filter(seller=seller).exclude(order__order_status__status="Pending")
        serializer=OrderLineMainSerializer(obj,many=True)
        ordercount={"processing":len(processing),"confirm":len(confirm),"readyfordispatch":len(readyfordispatch),"cancelled":len(cancelled),"delivered":len(delivered)}
        fetchdata={"orders":serializer.data,"counts":ordercount}
        return Response(fetchdata)
    


from common.models import Product,Payment
from django.db.models import Sum
from django.db.models import Sum, DecimalField
from django.db.models.functions import Coalesce
from userapp.models import RatingsReview



from sellerapp.serializers import SalesTrendsSerializer
class FetchSellerDashboard(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        if not CustomUser.objects.filter(id=user.id).exists():
            return Response({"error": "You are not authorized to view this data."}, status=403)
        total_users=CustomUser.objects.filter(user_type="user",is_active=True).count()
        total_products=Product.objects.filter(shop__user=user).count()
        order_excluded_status = ["completed", "canceled"]
        total_orders = ShopOrder.objects.exclude(order_status__status__in=order_excluded_status).filter(order_lines__seller=user).distinct().count()
        total_sales = Bill.objects.filter(order__order_lines__seller=user, payment_status="paid").distinct().count()
        total_revenue = Bill.objects.filter(order__order_lines__seller=user).aggregate(total=Sum('total_amount'))['total'] or 0
        bills = Bill.objects.filter(order__order_lines__seller=user,payment_status="paid")
        payments = Payment.objects.filter(order__in=bills.values_list('order', flat=True))
        total_platform_fee = payments.aggregate(total_fee=Sum('platform_fee'))['total_fee'] or 0
        refund_amount = (
            ReturnRefund.objects
            .filter(resolved_by=user, status='completed')
            .annotate(
                safe_refund=Coalesce('approved_refund_amount', 0, output_field=DecimalField())
            )
            .aggregate(total=Sum('safe_refund'))['total'] or 0
        )
        total_earnings=total_revenue-(total_platform_fee+refund_amount)
        total_reviews=RatingsReview.objects.filter(product__shop__user=user).count()
        serializer=SalesTrendsSerializer(bills,many=True)
        

        context={
                "totalusers":total_users,
                "totalproducts":total_products,
                "totalorders":total_orders,
                "total_sales":total_sales,
                "totalearnings":total_earnings,
                "totalreviews":total_reviews,
                "data":serializer.data
                }
        
        return Response({"data":context,"message":"Completed"})


from sellerapp.serializers import OrderLineDashboardSerializer,ReturnRefundDashboardSerializer
class SellerDashBoardOrders(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        seller = CustomUser.objects.get(id=user.id)
        obj = OrderLine.objects.filter(seller=seller)
        serializer=OrderLineDashboardSerializer(obj,many=True)
        obj = ReturnRefund.objects.filter(order__order_lines__seller=user,status="pending").distinct()  
        return_serializer = ReturnRefundDashboardSerializer(obj, many=True)

        processing=[]
        pending=[]
        returnrefund=[]
        for i in serializer.data:
            if i["order"]["order_status"]["status"]=="Pending":
                pending.append({
                    "id":i["order"]["id"],
                    "customer":i["order"]["user"]["first_name"],
                    "status":i["order"]["order_status"]["status"],
                    "date":i["order"]["order_date"]
                })
            elif i["order"]["order_status"]["status"]=="processing":
                processing.append({
                    "id":i["order"]["id"],
                    "customer":i["order"]["user"]["first_name"],
                    "status":i["order"]["order_status"]["status"],
                    "date":i["order"]["order_date"]
                })
        for i in return_serializer.data:
            returnrefund.append({
                "id":i["order"],
                "customer":i["requested_by"]["first_name"] ,
                "reason": i["reason"] ,
                "status": i["status"],
                "amount": i["refund_amount"] ,
            })

        context={
            "pendingorders":pending[:4],
            "processingorders":processing[:4],
            "returnrefund":returnrefund[:4]
        }
        print("Guys",return_serializer.data)
        return Response(context)
    

from sellerapp.serializers import ProductsInventorySerializer
# class FetchInventory(APIView):
#     permission_classes=[IsAuthenticated]
#     def get(self,request):
#         user=request.user
#         if not CustomUser.objects.filter(id=user.id).exists():
#             return Response({"error": "You are not authorized to view this data."}, status=403)
#         obj=Product.objects.filter(shop__user=user)
#         serializer=ProductsInventorySerializer(obj,many=True)
#         context={"data":serializer.data}
#         return Response(context)


from sellerapp.serializers import ProductsInventorySerializer
from django.db.models import Sum
from common.models import ProductCategory




class FetchInventory(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if not CustomUser.objects.filter(id=user.id).exists():
            return Response({"error": "You are not authorized to view this data."}, status=403)
        
        # Get all products for the user
        products = Product.objects.filter(shop__user=user).prefetch_related('items', 'category')
        serializer = ProductsInventorySerializer(products, many=True)
        
        # Calculate inventory value data
        inventory_value = self.calculate_inventory_value(products)
        
        # Get low stock products
        low_stock_products = self.get_low_stock_products(products)
        
        context = {
            "inventory_data": serializer.data,
            "inventory_value": inventory_value,
            "low_stock_products": low_stock_products
        }
        return Response(context)
    
    def calculate_inventory_value(self, products):
        # Calculate total inventory value
        total_value = 0
        for product in products:
            for item in product.items.all():
                if item.sale_price and item.quantity_in_stock:
                    total_value += float(item.sale_price) * item.quantity_in_stock
        
        # Calculate value by category
        categories_data = []
        # Get unique categories from the products to avoid querying all categories
        category_ids = products.values_list('category', flat=True).distinct()
        product_categories = ProductCategory.objects.filter(id__in=category_ids)
        
        for category in product_categories:
            category_products = products.filter(category=category)
            category_value = 0
            for product in category_products:
                for item in product.items.all():
                    if item.sale_price and item.quantity_in_stock:
                        category_value += float(item.sale_price) * item.quantity_in_stock
            
            if category_value > 0:  # Only include categories with inventory
                # For trend, you might want to compare with previous period in a real implementation
                trend = 'up' if category_value > 0 else 'down'  # Simplified for example
                categories_data.append({
                    'name': category.category_name,  # Using correct field name
                    'value': round(category_value, 2),  # Round to 2 decimal places
                    'trend': trend
                })
        
        return {
            'total': round(total_value, 2),
            'categories': categories_data
        }
    
    def get_low_stock_products(self, products):
        low_stock_items = []
        threshold = 10  # You can make this configurable or get from settings
        
        for product in products.prefetch_related('items'):
            for item in product.items.all():
                if item.quantity_in_stock <= threshold and item.status == 'approved':
                    # Determine sales rate (simplified - implement your actual logic)
                    if item.quantity_in_stock <= 2:
                        sales_rate = 'Very High'
                    elif item.quantity_in_stock <= 5:
                        sales_rate = 'High'
                    else:
                        sales_rate = 'Medium'
                    
                    low_stock_items.append({
                        'id': item.product_code,
                        'name': f"{product.product_name} ({item.size.size_name if item.size else 'N/A'})",  # Include size for clarity
                        'stock': item.quantity_in_stock,
                        'threshold': threshold,
                        'salesRate': sales_rate
                    })
        
        # Sort by stock level (lowest first)
        low_stock_items.sort(key=lambda x: x['stock'])
        
        return low_stock_items