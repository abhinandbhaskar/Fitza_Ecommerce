from django.shortcuts import redirect, render
from rest_framework.views import APIView
from sellerapp.serializers import SellerRegisterSerializer,VerifyOtpSerializer
from rest_framework.response import Response
from rest_framework import status
import time
import smtplib
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

        user.is_active = True
        user.save()

        del request.session["otp"]
        del request.session["exp_time"]
        request.session.save()

        return Response(
            {"message": "OTP verification completed successfully."},
            status=status.HTTP_200_OK,
        )


class ResendOtp(APIView):
    def post(self,request):
        email=request.session.get("email")
        if not email:
            return Response({
                "message":"Session expired or email not found. Please try again."
            },status=status.HTTP_400_BAD_REQUEST)
        otp,exp_time=generate_otp()
        sender_email='abhinandbhaskar43@gmail.com'
        sender_password='osdn bmfw hrdg hiop'
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

class CompleteSellerRegister(APIView):
    def post(self,request):
        email=request.session.get("email")
        serializer=CompleteSellerRegisterSerializer(data=request.data,context={"request":request,"email":email})

