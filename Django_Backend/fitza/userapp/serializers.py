from rest_framework import serializers
from common.models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django_email_verification import send_email
from django.conf import settings

from userapp.models import Wallet, WalletTransaction


class RegisterSerializer(serializers.Serializer):
    fullname=serializers.CharField()
    email=serializers.EmailField()
    phone=serializers.CharField()
    password1=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)

    def validate(self, data):
        if CustomUser.objects.filter(email=data['email']).exists():
            
            raise serializers.ValidationError("Email already exists..")
        if data["password1"]!=data["password2"]:
            raise serializers.ValidationError("Passwords do not match.")
        if len(data["phone"])<10:
            raise serializers.ValidationError("Phone number must contain 10 digits.") 
        return data
    # Most commonly, we override create() when we want to save the currently logged-in user (or any extra info not directly coming from the request.data) into the model.
    def create(self, validated_data):
        user=CustomUser.objects.create_user(username=validated_data["email"],email=validated_data["email"],phone_number=validated_data["phone"],password=validated_data["password1"],user_type='user')
        user.first_name=validated_data["fullname"]
        user.is_active=False
        print("SET FALSE")
        user.save()
        try:
            send_email(user)
            print("USER",user)
        except Exception as e:
            raise serializers.ValidationError(f"Failed to send verification email: {e}")
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        if not user:
            raise AuthenticationFailed("User not registered or invalid credentials")

        if not user.is_active:
            raise AuthenticationFailed("This account is disabled. Please contact support.")
        
        if not user.user_type=="user":
            raise AuthenticationFailed("User can only login here..")

        print("USER",user.id)
        print("USER",user.username)
        print("USER",user.email)
        data["user_id"] = user.id 
        data["username"] = user.first_name
        data["email"] = user.email
        data["photo"] = str(user.userphoto) if hasattr(user, "userphoto") else None

        return data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=["id", 
            "first_name",
            "email",
            "phone_number",
            "userphoto",
            "password"]
    def get_userphoto(self, obj):
        request = self.context.get('request')  # Get the request context
        if obj.userphoto:
            return request.build_absolute_uri(obj.userphoto.url) if request else f"{settings.MEDIA_URL}{obj.userphoto.url}"
        return None

from rest_framework import serializers
from django.contrib.auth.hashers import check_password

class PasswordSerializer(serializers.Serializer):
    currentPassword=serializers.CharField()
    newPassword=serializers.CharField()
    confirmpassword=serializers.CharField()

    def validate(self,data):
        user=self.context['request'].user
        if not check_password(data['currentPassword'],user.password):
            raise serializers.ValidationError("Current Password is incorrect.")
        
        if data['newPassword'] != data['confirmpassword']:
            raise serializers.ValidationError("New Password do not match.")
        return data
    
    def save(self):
        user=self.context['request'].user
        user.set_password(self.validated_data['newPassword'])
        user.save()


class ProfileUpdateSerializer(serializers.Serializer):
    fullname=serializers.CharField()
    email=serializers.CharField()
    phone=serializers.CharField()
    photo=serializers.FileField()
    def validate(self,data):
        user=self.context['request'].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("User credentials are invalid")
        return data
    
    def save(self):
        user=self.context["request"].user
        user.first_name=self.validated_data['fullname']
        user.email=self.validated_data['email']
        user.phone_number=self.validated_data['phone']
        user.userphoto=self.validated_data['photo']
        user.save()

from common.models import UserAddress



class AddBillingAddessSerializer(serializers.Serializer):
    firstname=serializers.CharField(required=False, allow_blank=True)
    lastname=serializers.CharField(required=False, allow_blank=True)
    address1=serializers.CharField(required=False, allow_blank=True)
    address2=serializers.CharField(required=False, allow_blank=True)
    country=serializers.CharField(required=False, allow_blank=True)
    zipcode=serializers.CharField(required=False, allow_blank=True)
    city=serializers.CharField(required=False, allow_blank=True)
    state=serializers.CharField(required=False, allow_blank=True)
    mobile=serializers.CharField(required=False, allow_blank=True)
    def validate(self,data):
        user=self.context['request'].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("User credentials are invalid")
        return data
    
    # Serializer	def save(self): ✅
    # ModelSerializer	def create(self, validated_data): ✅
    # def update(self, instance, validated_data): ✅
    def save(self):
        user=self.context['request'].user
        user.first_name = self.validated_data.get('firstname', user.first_name)
        user.last_name = self.validated_data.get('lastname', user.last_name)
        user.save()
        billing_address=UserAddress.objects.filter(user=user, address_type='billing').first()
        if billing_address:
            billing_address.address_line1=self.validated_data['address1']
            billing_address.address_line2=self.validated_data['address2']
            billing_address.city=self.validated_data['city']
            billing_address.state=self.validated_data['state']
            billing_address.postal_code=self.validated_data['zipcode']
            billing_address.country=self.validated_data['country']
            billing_address.phone=self.validated_data['mobile']
            billing_address.save()
        else:
            UserAddress.objects.create(
                user=user,
                address_type='billing',
                address_line1=self.validated_data['address1'],
                address_line2=self.validated_data['address2'],
                city=self.validated_data['city'],
                state=self.validated_data['state'],
                postal_code=self.validated_data['zipcode'],
                country=self.validated_data['country'],
                phone=self.validated_data['mobile']
            )



from common.models import CustomUser

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['first_name','last_name']


class BillingAddressSerializer(serializers.ModelSerializer):
    user=UserDetailsSerializer(read_only=True)
    class Meta:
        model=UserAddress
        fields='__all__'


class AddShippingAddessSerializer(serializers.Serializer):
    firstname=serializers.CharField(required=False, allow_blank=True)
    lastname=serializers.CharField(required=False, allow_blank=True)
    address1=serializers.CharField(required=False, allow_blank=True)
    address2=serializers.CharField(required=False, allow_blank=True)
    country=serializers.CharField(required=False, allow_blank=True)
    zipcode=serializers.CharField(required=False, allow_blank=True)
    city=serializers.CharField(required=False, allow_blank=True)
    state=serializers.CharField(required=False, allow_blank=True)
    mobile=serializers.CharField(required=False, allow_blank=True)

    def validate(self,data):
        user=self.context['request'].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("User Credentials are Invalid")
        return data
    def save(self):
        user=self.context['request'].user
        user.first_name = self.validated_data.get('firstname', user.first_name)
        user.last_name = self.validated_data.get('lastname', user.last_name)
        user.save()
        shippingAddress=UserAddress.objects.filter(user=user,address_type='shipping').first()
        if shippingAddress:
            shippingAddress.address_line1=self.validated_data['address1']
            shippingAddress.address_line2=self.validated_data['address2']
            shippingAddress.city=self.validated_data['city']
            shippingAddress.state=self.validated_data['state']
            shippingAddress.postal_code=self.validated_data['zipcode']
            shippingAddress.country=self.validated_data['country']
            shippingAddress.phone=self.validated_data['mobile']
            shippingAddress.save()
        else:
            UserAddress.objects.create(
                user=user,
                address_type='shipping',
                address_line1=self.validated_data['address1'],
                address_line2=self.validated_data['address2'],
                city=self.validated_data['city'],
                state=self.validated_data['state'],
                postal_code=self.validated_data['zipcode'],
                country=self.validated_data['country'],
                phone=self.validated_data['mobile']
            )



class GetShippingAddressSerializer(serializers.ModelSerializer):
    user=UserDetailsSerializer(read_only=True)
    class Meta:
        model=UserAddress
        fields='__all__'

class AddtowalletSerializer(serializers.Serializer):
    money=serializers.FloatField()

    def validate_money(self,value):
        value=float(value)
        if value<=0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def create(self, validated_data):
        user=self.context['request'].user
        money=validated_data['money']

        wallet,created=Wallet.objects.get_or_create(user=user,balance=0.00)
        wallet.balance+=money
        wallet.save()

        WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type='credit',
            amount=money,
            description="Amount added to wallet",

        )
        return wallet

from sellerapp.models import ProductImage

class ViewProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image']

from common.models import Product
class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'

from common.models import ProductItem
class ProductViewSerializer(serializers.ModelSerializer):
    images = ViewProductImageSerializer(many=True, read_only=True) 
    product=ProductsSerializer(read_only=True)
    class Meta:
        model=ProductItem
        fields='__all__'
        
# jj


class ViewProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ViewProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image', 'sub_image_1', 'sub_image_2', 'sub_image_3']

from common.models import SizeOption,Color,Brand,Seller,ProductCategory

class ViewSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model=SizeOption
        fields='__all__'

class ViewColorsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Color
        fields='__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model=Brand
        fields='__all__'

class ViewCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductCategory
        fields='__all__'



class ShopSellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'

class SellProductsSerializer(serializers.ModelSerializer):
    product = ViewProductsSerializer(read_only=True) 
    images = ViewProductImageSerializer(many=True, read_only=True) 
    brand=serializers.SerializerMethodField()
    size=ViewSizeSerializer(read_only=True)
    color=ViewColorsSerializer(read_only=True)
    category=serializers.SerializerMethodField() 
    shop=serializers.SerializerMethodField() 

    class Meta:
        model = ProductItem
        fields = [
            'id', 'product','color','shop', 'size', 'original_price', 'sale_price', 'product_code',
            'quantity_in_stock', 'rejection_reason', 'images', 'brand', 'category'
        ]


    def get_brand(self, obj):
        if obj.product and obj.product.brand:
            return BrandSerializer(obj.product.brand).data
        return None

    def get_category(self, obj):
        if obj.product and obj.product.category:
            return ViewCategorySerializer(obj.product.category).data
        return None

    def get_shop(self, obj):
        if obj.product and obj.product.shop:
            return ShopSellerSerializer(obj.product.shop).data
        return None

from userapp.models import RatingsReview
class AddReviewRatingSerializer(serializers.Serializer):
    id=serializers.CharField()
    rating=serializers.CharField()
    description=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("UnAuthorized user")
        return data
    
    def save(self):
        user=self.context["request"].user
        pro_id=Product.objects.get(id=self.validated_data["id"])
        obj=RatingsReview.objects.create(user=user,product=pro_id,rating=self.validated_data["rating"],review_content=self.validated_data["description"])
        return obj

class UserProSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['first_name','userphoto']

from userapp.models import RatingsReview
class RatingReviewSerializer(serializers.ModelSerializer):
    user=UserProSerializer(read_only=True)
    class Meta:
        model=RatingsReview
        fields='__all__'



from common.models import Product
from userapp.models import Wishlist
from sellerapp.models import ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image', 'sub_image_1', 'sub_image_2', 'sub_image_3']

class ProductItemSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)  # Corrected here

    class Meta:
        model = ProductItem
        fields = ['id', 'original_price', 'sale_price', 'product_code', 'images']

class WishlistProductsSerializer(serializers.ModelSerializer):
    items = ProductItemSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'product_description', 'items']

class WishlistSerializer(serializers.ModelSerializer):
    products = WishlistProductsSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'created_at', 'products']

from common.models import ProductCategory
class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductCategory
        fields=['category_name','category_description']

class ProductDataSerializer(serializers.ModelSerializer):
    category=CategoriesSerializer(read_only=True)
    class Meta:
        model=Product
        fields=['id','product_name','category']






from common.models import ProductCategory
class DropCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductCategory
        fields='__all__'

from sellerapp.models import Banner
class BannerShowSerializer(serializers.ModelSerializer):
    class Meta:
        model=Banner
        fields='__all__'