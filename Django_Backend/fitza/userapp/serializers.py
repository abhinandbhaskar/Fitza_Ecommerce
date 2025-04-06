from rest_framework import serializers
from common.models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django_email_verification import send_email
from django.conf import settings


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

    def create(self, validated_data):
        user=CustomUser.objects.create_user(username=validated_data["email"],email=validated_data["email"],phone_number=validated_data["phone"],password=validated_data["password1"])
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

        print("USER",user.id)
        print("USER",user.username)
        print("USER",user.email)
        data["user_id"] = user.id 
        data["username"] = user.username
        data["email"] = user.email

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
        






    

        

    