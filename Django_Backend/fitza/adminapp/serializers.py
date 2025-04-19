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
        if ProductCategory.objects.filter(category_name=data["category"]).exists():
            raise serializers.ValidationError("Category already exists.")
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

