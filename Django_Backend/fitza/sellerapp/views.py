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