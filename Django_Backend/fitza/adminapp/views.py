from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from adminapp.serializers import AdminTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
# Create your views here.
from rest_framework import status

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class=AdminTokenObtainPairSerializer

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
    
class AdminLogout(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        response=Response({"message":"Logged out successfully.. "},status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        return response

from common.models import CustomUser,Seller
from adminapp.serializers import ViewUsersSerializer,ViewSellerSerializer

class ViewUsers(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        users=CustomUser.objects.all()
        serializer=ViewUsersSerializer(users,many=True)
        return Response(serializer.data)

class ViewSellers(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        sellers=Seller.objects.all()
        serializer=ViewSellerSerializer(sellers,many=True)
        return Response(serializer.data)