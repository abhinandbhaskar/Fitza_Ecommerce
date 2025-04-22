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
        user=CustomUser.objects.create_user(username=validated_data["email"],email=validated_data["email"],phone_number=validated_data["phone"],password=validated_data["password1"],user_type="seller")
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
            description=self.validated_data["description"],
            shop_logo="seller/logo1.jpg",
            shop_banner="seller/shopbanner.jpg",
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
        if not user.user_type=="seller":
            raise AuthenticationFailed("Sellers can only login here..")
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



class UpdateProfileSerializer(serializers.Serializer):
    fullname=serializers.CharField()
    email=serializers.CharField()
    mobile=serializers.CharField()
    photo=serializers.FileField(required=False)
    print("PHOTO",photo)
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("User credentials are invalid")
        return data
    
        
    def save(self):
        user=self.context["request"].user
        user.first_name=self.validated_data["fullname"]
        user.email=self.validated_data["email"]
        user.phone_number=self.validated_data["mobile"]
        user.userphoto=self.validated_data["photo"]
        user.save()

class UpdateShopSerializer(serializers.Serializer):
        banner=serializers.FileField()
        logo=serializers.FileField()
        shopname=serializers.CharField()
        shopaddress=serializers.CharField()
        phone=serializers.CharField()
        email=serializers.CharField()
        taxid=serializers.CharField()
        registerno=serializers.CharField()
        description=serializers.CharField()
        def validate(self,data):
            user=self.context["request"].user
            if not CustomUser.objects.filter(id=user.id).exists():
                raise serializers.ValidationError("User credentials are invalid")
            if not Seller.objects.filter(user_id=user.id).exists():
                raise serializers.ValidationError("You Are Not Able to Update Data")
            return data
        def save(self):
            user=self.context["request"].user
            seller=Seller.objects.get(user_id=user.id)
            seller.user=user
            seller.shop_name=self.validated_data["shopname"]
            seller.shop_address=self.validated_data["shopaddress"]
            seller.contact_number=self.validated_data["phone"]
            seller.email=self.validated_data["email"]
            seller.tax_id=self.validated_data["taxid"]
            seller.business_registration_number=self.validated_data["registerno"]
            seller.shop_logo=self.validated_data["logo"]
            seller.shop_banner=self.validated_data["banner"]
            seller.description=self.validated_data["description"]
            seller.save()
           

            
class BankUpdateSerializer(serializers.Serializer):
    accholder=serializers.CharField()
    bank=serializers.CharField()
    accno=serializers.CharField()
    ifsc=serializers.CharField()
    branch=serializers.CharField()

    def validate(self, data):
        user = self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("User credentials are invalid.")

        seller = Seller.objects.filter(user=user).first()
        if not seller:
            raise serializers.ValidationError("Seller profile not found.")
        
        if not SellerBankDetails.objects.filter(seller=seller).exists():
            raise serializers.ValidationError("You cannot change bank details at this time.")
        
        return data

    def save(self):
        user = self.context["request"].user
        seller = Seller.objects.get(user=user)  # Fetch the seller instance
        bank_details = SellerBankDetails.objects.get(seller=seller)  # Fetch the existing bank details

        # Update the bank details
        bank_details.account_holder_name = self.validated_data["accholder"]
        bank_details.bank_name = self.validated_data["bank"]
        bank_details.account_number = self.validated_data["accno"].encode()  # Handle as binary if necessary
        bank_details.ifsc_code = self.validated_data["ifsc"]
        bank_details.branch_address = self.validated_data["branch"]
        bank_details.save()


from common.models import ProductCategory,Brand,Color,SizeOption
class GetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductCategory
        fields=['category_name','id']


class GetBrandsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Brand
        fields=['brand_name','id']

class GetColorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Color
        fields=['color_name','id']

class GetSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model=SizeOption
        fields=['size_name','id']

from rest_framework import serializers
from common.models import Product, ProductItem, CustomUser, Seller, Brand,ProductCategory
from sellerapp.models import ProductImage


class AddProductsSerializer(serializers.Serializer):
    product = serializers.CharField()
    description = serializers.CharField()
    cateid = serializers.IntegerField()  
    brandid = serializers.IntegerField() 
    modelheight = serializers.CharField()
    modelwearing = serializers.CharField()
    instruction = serializers.CharField()
    about = serializers.CharField()
    color = serializers.CharField()
    size = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2) 
    productcode = serializers.CharField()
    stock = serializers.IntegerField() 
    photo=serializers.FileField()
    img1=serializers.FileField()
    img2=serializers.FileField()
    img3=serializers.FileField()

    def validate(self, data):
        user = self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("Unauthorized user")
        
        if not ProductCategory.objects.filter(id=data["cateid"]).exists():
            raise serializers.ValidationError("Invalid category ID")
        
        if not Brand.objects.filter(id=data["brandid"]).exists():
            raise serializers.ValidationError("Invalid brand ID")
        
        if not Color.objects.filter(id=data["color"]).exists():
            raise serializers.ValidationError("Invalid color ID")
        
        if not SizeOption.objects.filter(id=data["size"]).exists():
            raise serializers.ValidationError("Invalid Size ID")
        
        return data

    def save(self):
        user = self.context["request"].user
        try:
            seller = Seller.objects.get(user=user)
        except Seller.DoesNotExist:
            raise serializers.ValidationError("Seller not found.")

        categoryobj = ProductCategory.objects.get(id=self.validated_data["cateid"])
        brandobj = Brand.objects.get(id=self.validated_data["brandid"])
        sizeobj=SizeOption.objects.get(id=self.validated_data["size"])
        colorobj=Color.objects.get(id=self.validated_data["color"])

        product = Product.objects.create(
            category=categoryobj,
            brand=brandobj,
            shop=seller,
            product_name=self.validated_data["product"],
            product_description=self.validated_data["description"],
            model_height=self.validated_data["modelheight"],
            model_wearing=self.validated_data["modelwearing"],
            care_instructions=self.validated_data["instruction"],
            about=self.validated_data["about"]
        )

        productitemobj=ProductItem.objects.create(
            product=product,
            color=colorobj,
            size=sizeobj,
            original_price=self.validated_data["price"],
            product_code=self.validated_data["productcode"],
            quantity_in_stock=self.validated_data["stock"]
        )

        ProductImage.objects.create(
            product_item=productitemobj,
            main_image=self.validated_data["photo"],
            sub_image_1=self.validated_data["img1"],
            sub_image_2=self.validated_data["img2"],
            sub_image_3=self.validated_data["img3"],

        )


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'



class GetAllProductsSerializer(serializers.ModelSerializer):
    product=ProductsSerializer(read_only=True)
    class Meta:
        model=ProductItem
        fields='__all__'

