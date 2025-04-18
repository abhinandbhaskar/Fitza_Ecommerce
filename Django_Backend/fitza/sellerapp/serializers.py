from rest_framework import serializers
from common.models import CustomUser,SellerBankDetails,Seller
import secrets
import time
import smtplib
from django.contrib import messages


def generate_otp(length=6, exp_time=60):
    current_time = int(time.time())
    exp_time = current_time + exp_time
    otp = "".join(secrets.choice("0123456789") for i in range(length))
    return otp, exp_time

from django.conf import settings

class SellerRegisterSerializer(serializers.Serializer):
    fullname=serializers.CharField()
    email=serializers.EmailField()
    phone=serializers.CharField()
    password1=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)
    
    def validate(self,data):
        if CustomUser.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already exists..")
        if data["password1"]!=data["password2"]:
            raise serializers.ValidationError("Password do not match")
        if len(data["phone"])<10:
            raise serializers.ValidationError("Phone number must contain 10 digits.")
        return data
    
    def create(self, validated_data):
        user=CustomUser.objects.create_user(username=validated_data["email"],email=validated_data["email"],phone_number=validated_data["phone"],password=validated_data["password1"])
        user.first_name=validated_data["fullname"]
        user.is_active=False
        user.save()
        otp, exp_time=generate_otp()
        print("OTP",otp)
        sender_email=settings.EMAIL_HOST_USER
        receiver_mail=validated_data["email"]
        sender_password=settings.EMAIL_HOST_PASSWORD
        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                message = (
                    f"Subject: OTP Verification\n\n"
                    f"Hello {validated_data['fullname']},\n\n"
                    f"Your OTP for verification is: {otp}. It will expire in 60 seconds.\n\n"
                    "Thank you!"
                )
                server.sendmail(sender_email, receiver_mail, message)
        except smtplib.SMTPException as e:
            print(f"SMTP Error: {e}")
            raise serializers.ValidationError("Failed to send OTP email. Please try again.")

        request = self.context.get("request")
        if request:
            request.session["email"]=receiver_mail
            request.session["otp"]=otp
            request.session["exp_time"]=exp_time
            request.session.save() 
        return user



class VerifyOtpSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        request = self.context.get("request")
        email=self.context.get("email")
        if not request:
            raise serializers.ValidationError("Request object not found in context.")

        if not email:
            raise serializers.ValidationError("Session expired or email not found.")

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        otp = data["otp"]
        if not otp.isdigit():
            raise serializers.ValidationError("OTP must be numeric.")
        if len(otp) != 6:
            raise serializers.ValidationError("OTP must be exactly 6 digits.")

        data["user"] = user
        return data


from common.models import Seller

class ShopRegisterSerializer(serializers.Serializer):
    shopName = serializers.CharField(max_length=255)
    shopAddress = serializers.CharField(max_length=500)
    contactNumber = serializers.CharField(max_length=10)
    shopEmail = serializers.EmailField()
    taxId = serializers.CharField(max_length=100, required=False) 
    businessRegistrationNumber = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=1000)

    def validate(self,data):
        request=self.context.get("request")
        email=self.context.get("email")
        if not request:
            raise serializers.ValidationError("Request object not found in context.")

        if not email:
            raise serializers.ValidationError("Session expired or email not found.")
        return data
    
    def save(self):
        email=self.context.get("email")
        user=CustomUser.objects.get(email=email)
        Seller.objects.create(
            user=user,
            shop_name=self.validated_data["shopName"],
            shop_address=self.validated_data["shopAddress"],
            contact_number=self.validated_data["contactNumber"],
            email=self.validated_data["shopEmail"],
            tax_id=self.validated_data["taxId"],
            business_registration_number=self.validated_data["businessRegistrationNumber"],       
            description=self.validated_data["description"]
        )



class SellerBankRegisterSerializer(serializers.Serializer):
    accountHolderName = serializers.CharField(max_length=255)
    bankName = serializers.CharField(max_length=255)
    accountNumber = serializers.CharField(max_length=20) 
    ifscCode = serializers.CharField(max_length=11)
    branchAddress = serializers.CharField(max_length=500)

    def validate(self, data):
        request = self.context.get("request")
        email = self.context.get("email")
        if not request:
            raise serializers.ValidationError("Request object not found in context.")
        if not email:
            raise serializers.ValidationError("Session expired or email not found.")
        return data

    def validate_accountNumber(self, value):
        if not value.isdigit() or len(value) < 8:
            raise serializers.ValidationError("Account number must be at least 8 digits and numeric.")
        return value

    def save(self):
        email = self.context.get("email")
        request = self.context.get("request")
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with the given email does not exist.")

        try:
            seller = Seller.objects.get(user=user)
        except Seller.DoesNotExist:
            raise serializers.ValidationError("Seller profile does not exist.")
        del request.session["email"]
        request.session.save()
        SellerBankDetails.objects.create(
            seller=seller,
            account_holder_name=self.validated_data["accountHolderName"],
            bank_name=self.validated_data["bankName"],
            account_number=self.validated_data["accountNumber"],
            ifsc_code=self.validated_data["ifscCode"],
            branch_address=self.validated_data["branchAddress"]
        )

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class SellerTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data=super().validate(attrs)
        user=self.user
        if not user:
            raise AuthenticationFailed("User not registered or invalid credentials")
        if not user.is_active:
            raise AuthenticationFailed("This account is disabled. Please contact support.")
        data["user_id"]=user.id
        data["username"]=user.email
        data["email"]=user.email
        data["photo"] = str(user.userphoto) if hasattr(user, "userphoto") else None

        return data
    

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['first_name','email','phone_number','password','userphoto']

class SellerShopSerializer(serializers.ModelSerializer):
    class Meta:
        model=Seller
        fields='__all__'


class SellerBankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=SellerBankDetails
        fields='__all__'








        
    






    

    
    
    
    

# from rest_framework import serializers

# class CompleteSellerRegisterSerializer(serializers.Serializer):
#     shopName = serializers.CharField(max_length=255)
#     shopAddress = serializers.CharField(max_length=500)
#     shopLogo = serializers.ImageField(required=False)
#     shopBanner = serializers.ImageField(required=False)
#     description = serializers.CharField(max_length=1000)
#     businessRegistrationNumber = serializers.RegexField(regex="^[A-Z0-9]{8,20}$")
#     taxId = serializers.RegexField(regex="^[A-Z0-9]{8,20}$", required=False)
#     bankAccountNumber = serializers.RegexField(regex="^\d{9,18}$")
#     ifscCode = serializers.RegexField(regex="^[A-Z]{4}0[A-Z0-9]{6}$")
#     accountHolderName = serializers.CharField(max_length=255)
#     paymentMethod = serializers.ChoiceField(choices=["Bank Transfer", "PayPal"])
#     termsAgreed = serializers.BooleanField()

#     def validate_termsAgreed(self, value):
#         if not value:
#             raise serializers.ValidationError("You must agree to the terms and conditions.")
#         return value
