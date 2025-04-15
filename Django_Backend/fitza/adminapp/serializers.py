from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers
from common.models import CustomUser,Seller

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

class ViewUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields='__all__'

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['first_name']


class ViewSellerSerializer(serializers.ModelSerializer):
    user=UserDetailsSerializer(read_only=True)
    class Meta:
        model=Seller
        fields='__all__'

