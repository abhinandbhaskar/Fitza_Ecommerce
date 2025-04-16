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

