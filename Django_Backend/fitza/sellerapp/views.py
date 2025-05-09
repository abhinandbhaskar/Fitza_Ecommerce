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

        print("CCCCCCC",user_details)

        return Response(user_details)
