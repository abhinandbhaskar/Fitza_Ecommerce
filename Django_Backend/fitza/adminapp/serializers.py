from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers
from common.models import CustomUser,Seller,SellerBankDetails

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data=super().validate(attrs)
        user=self.user
        if not user:
            raise AuthenticationFailed("User not registered or invalid credentials")
        if not user.is_active:
            raise AuthenticationFailed("This account is disabled. Please contact support.")
        if not user.is_staff:
            raise AuthenticationFailed("Access denied. Only admins can log in here.")
        if not user.user_type=="admin":
            raise AuthenticationFailed("Only admins can log in here..")
   
        data["user_id"]=user.id
        data["username"]=user.username
        data["email"]=user.email
        data["photo"] = str(user.userphoto) if hasattr(user, "userphoto") else None
        data["is_admin"]=user.is_staff

        return data



class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['first_name']


class ViewSellerSerializer(serializers.ModelSerializer):
    user=UserDetailsSerializer(read_only=True)
    class Meta:
        model=Seller
        fields='__all__'


from cryptography.fernet import Fernet
from django.conf import settings
from rest_framework import serializers

class BankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerBankDetails
        fields = ['account_holder_name', 'bank_name', 'account_number', 'ifsc_code', 'branch_address']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            # Access the encrypted account_number from the instance
            encrypted_account_number = instance.account_number
            cipher = Fernet(settings.BANK_ENCRYPTION_KEY)
            # Decrypt the account number
            representation['account_number'] = cipher.decrypt(encrypted_account_number).decode()
        except Exception as e:
            # Log the error and mask the sensitive data
            representation['account_number'] = None
        return representation




class ViewUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields='__all__'

class ViewSellerDetailsSerializer(serializers.ModelSerializer):
    bank_details=BankDetailsSerializer(read_only=True)
    user=ViewUsersSerializer(read_only=True)
    class Meta:
        model=Seller
        fields='__all__'

from common.models import ProductCategory
class AddCategorySerializer(serializers.Serializer):
    category=serializers.CharField(max_length=255)
    description=serializers.CharField(required=False, allow_blank=True)
    image=serializers.FileField(required=False, allow_null=True)
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("You don't have permission to add a category.")
        if ProductCategory.objects.filter(category_description=data["description"]).exists():
            raise serializers.ValidationError("Sub Category already exists.")
        return data
    def save(self):
        try:
            category=ProductCategory.objects.create(
                category_name=self.validated_data["category"],
                category_image=self.validated_data["image"],
                category_description=self.validated_data["description"],
            )
            return category
        except Exception as e:
            raise serializers.ValidationError(f"Failed to create category: {e}")


    

class ViewCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductCategory
        fields='__all__'



class UpdateNewCategorySerializer(serializers.Serializer):
    category = serializers.CharField()
    description = serializers.CharField()
    image = serializers.FileField()

    def validate(self, data):
        cate_id = self.context["cate_id"]
        if not ProductCategory.objects.filter(id=cate_id).exists():
            raise serializers.ValidationError({"category": "The category does not exist."})
        return data

    def save(self):
        cate_id = self.context["cate_id"]
        obj = ProductCategory.objects.get(id=cate_id)
        obj.category_name = self.validated_data["category"]
        obj.category_description = self.validated_data["description"]
        obj.category_image = self.validated_data["image"]
        obj.save()


class DeleteCategorySerializer(serializers.Serializer):
    def validate(self):
        cate_id = self.context["cate_id"]
        if not ProductCategory.objects.filter(id=cate_id).exists():
            raise serializers.ValidationError({"category": "The category does not exist."})
        return {}
    
    def save(self):
        cate_id = self.context["cate_id"]
        category = ProductCategory.objects.get(id=cate_id)
        category.delete()

from common.models import Color,SizeOption,Brand
class AddColorSerializer(serializers.Serializer):
    color=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("You can't able to add color")
        if Color.objects.filter(color_name=data["color"]).exists():
            raise serializers.ValidationError("Color already exists...")
        return data
    def save(self):
        obj=Color.objects.create(color_name=self.validated_data["color"])
        return obj

    
class ViewColorsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Color
        fields='__all__'

class DeleteColorSerializer(serializers.Serializer):
    def validate(self):
        color_id=self.context["color_id"]
        if not Color.objects.filter(id=color_id).exists():
            raise serializers.ValidationError("Color Does not exist")
    def save(self):
        color_id=self.context["color_id"]
        obj=Color.objects.get(id=color_id)
        obj.delete()


class AddSizeSerializer(serializers.Serializer):
    size=serializers.CharField()
    order=serializers.CharField()
    def validate(self,data):
        if SizeOption.objects.filter(size_name=data["size"]).exists():
            raise serializers.ValidationError("Size name already exists...")
        if SizeOption.objects.filter(sort_order=data["order"]).exists():
            raise serializers.ValidationError("Sort Order Value already used")
        return data
    def save(self):
        obj=SizeOption.objects.create(size_name=self.validated_data["size"],sort_order=self.validated_data["order"] )
        return obj

class ViewSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model=SizeOption
        fields='__all__'

class SizeDeleteSerializer(serializers.Serializer):
    def validate(self):
        size_id=self.context["size_id"]
        if not SizeOption.objects.filter(id=size_id).exists():
            raise serializers.ValidationError("Size Does not exist")
    def save(self):
        size_id=self.context["size_id"]
        obj=SizeOption.objects.get(id=size_id)
        obj.delete()


class AddBrandSerializer(serializers.Serializer):
    brand=serializers.CharField()
    description=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("You can't able to add color")
        if Brand.objects.filter(brand_name=self.initial_data["brand"]).exists():
            raise serializers.ValidationError("Brandname already added...")
        return data
    
    def save(self):
        obj=Brand.objects.create(brand_name=self.validated_data["brand"],brand_description=self.validated_data["description"])
        return obj
    
        
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model=Brand
        fields='__all__'


class UpdateNewBrandSerializer(serializers.Serializer):
    brand=serializers.CharField()
    description=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        brand_id1=self.context["brand_id1"]
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("Un authorised user")
        if not Brand.objects.filter(id=brand_id1).exists():
            raise serializers.ValidationError("You can't update..")
        return data
    
    def save(self):
        brand_id1=self.context["brand_id1"]
        obj=Brand.objects.get(id=brand_id1)
        obj.brand_name=self.validated_data["brand"]
        obj.brand_description=self.validated_data["description"]
        obj.save()
        return obj
            
    
class DeleteBrandSerializer(serializers.Serializer):
    def validate(self,attrs):
        user=self.context["request"].user
        brand_id=self.context["brand_id"]
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("UnAuthprized User")
        if not Brand.objects.filter(id=brand_id).exists():
            raise serializers.ValidationError("Brand already deleted")
        return attrs

    def save(self):
        brand_id=self.context["brand_id"]   
        obj=Brand.objects.get(id=brand_id).delete()
        return obj


from sellerapp.models import ProductImage
from common.models import ProductItem
from common.models import Product

# Serializer for ProductImage
class ViewProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image', 'sub_image_1', 'sub_image_2', 'sub_image_3']

# Serializer for Product
class ViewProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'




# Serializer for ProductItem

class ViewPendingProductSerializer(serializers.ModelSerializer):
    product = ViewProductsSerializer(read_only=True)  # Product relationship
    images = ViewProductImageSerializer(many=True, read_only=True)  # Automatically maps to `images` related_name

    class Meta:
        model = ProductItem
        fields = [
            'id', 'product', 'color', 'size', 'original_price', 'sale_price', 
            'product_code', 'quantity_in_stock', 'status', 'rejection_reason', 'images'
        ]

from common.models import Seller

class ShopSellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'

class IndividualProductsSerializer(serializers.ModelSerializer):
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


class ApproveProductSerializer(serializers.Serializer):
    saleprice=serializers.CharField()
    code=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        if not user.is_staff:
            raise serializers.ValidationError("You are not authorized to perform this action.")
        return data
    def save(self):
        id=self.context["id"]
        obj1=ProductItem.objects.get(id=id)
        obj1.sale_price=self.validated_data["saleprice"]
        obj1.product_code=self.validated_data["code"]
        obj1.save()



class RejectProductSerializer(serializers.Serializer):
    reason=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        if not user.is_staff:
            raise serializers.ValidationError("You are not authorized to perform this action.")
        return data
    def save(self):
        id=self.context["id"]
        obj1=ProductItem.objects.get(id=id)
        obj1.rejection_reason=self.validated_data["reason"]
        obj1.save()


from userapp.models import RatingsReview

class ViewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name']

class RatingReviewSerializer(serializers.ModelSerializer):
    user = ViewUserSerializer(read_only=True)
    shop_name = serializers.SerializerMethodField()

    class Meta:
        model = RatingsReview
        fields = '__all__'

    def get_shop_name(self, obj):
        # Check if the product exists and has a related shop (Seller)ll
        if obj.product and obj.product.shop:
            return obj.product.shop.shop_name
        return None
    
from sellerapp.models import Banner
class AddBannerSerializer(serializers.Serializer):
    image=serializers.FileField()
    title=serializers.CharField()
    description=serializers.CharField()
    offer=serializers.CharField()
    startdate=serializers.CharField()
    endDate=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("UnAuthprized User")
        return data

    def save(self):
        obj=Banner.objects.create(
            title=self.validated_data["title"],
            description=self.validated_data["description"],
            offer_details=self.validated_data["offer"],
            image=self.validated_data["image"],
            start_date=self.validated_data["startdate"],
            end_date=self.validated_data["endDate"],
            is_active=False,
        )
        return obj

from sellerapp.models import Banner
class GetBannersSerializer(serializers.ModelSerializer):
    class Meta:
        model=Banner
        fields='__all__'


class UpdateBannerSerializer(serializers.Serializer):
    image=serializers.FileField()
    title=serializers.CharField()
    description=serializers.CharField()
    offer=serializers.CharField()
    startdate=serializers.CharField()
    endDate=serializers.CharField()
    def validate(self,data):
        user=self.context["request"].user
        id=self.context["id"]
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("UnAuthprized User")
        if not Banner.objects.filter(id=id).exists():
            raise serializers.ValidationError("Banner Does not exists..")
        return data
    

    def save(self):
        obj=Banner.objects.get(id=self.context["id"])
        obj.title=self.validated_data["title"]
        obj.description=self.validated_data["description"]
        obj.offer_details=self.validated_data["offer"]
        obj.image=self.validated_data["image"]
        obj.start_date=self.validated_data["startdate"]
        obj.end_date=self.validated_data["endDate"]
        obj.is_active=False
        obj.save()
        return obj
