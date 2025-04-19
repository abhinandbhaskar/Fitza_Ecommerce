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

from common.models import CustomUser,Seller,SellerBankDetails
from adminapp.serializers import ViewUsersSerializer,ViewSellerSerializer,ViewSellerDetailsSerializer
from django.db.models import Q

class ViewUsers(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        # users=CustomUser.objects.all()
        # users = CustomUser.objects.filter(
        #     ~Q(seller_profile__isnull=False) & ~Q(admin_profile__isnull=False)
        # )
        users = CustomUser.objects.filter(seller_profile__isnull=True, admin_profile__isnull=True)
        serializer=ViewUsersSerializer(users,many=True)
        return Response(serializer.data)







from django.shortcuts import get_object_or_404


class RemoveUsers(APIView):

    permission_classes=[IsAuthenticated]

    def post(self,request, user_id):

        if not request.user.is_staff:
            return Response({"error":"Unauthorized"},status=status.HTTP_403_FORBIDDEN)
        
        user=get_object_or_404(CustomUser, id=user_id)

        if user.is_superuser:
            return Response({"error":"Cannot remove superuser"},status=status.HTTP_400_BAD_REQUEST)
        
        if user.is_staff:
            return Response({"status":"Cannot Remove staffs"},status=status.HTTP_400_BAD_REQUEST)
        
        if user==request.user:
            return Response({"error":"Cannot remove your self"},status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({"message":"User removed successfully"},status=status.HTTP_200_OK)
        

class ViewSellerDetails(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        seller=Seller.objects.filter(id=id)
        serializer=ViewSellerDetailsSerializer(seller,many=True)
        return Response(serializer.data)

class ViewSellers(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        active_users=CustomUser.objects.filter(is_active=True).values_list('id', flat=True)
        sellers=Seller.objects.filter(account_verified=True,user_id__in=active_users)
        serializer=ViewSellerSerializer(sellers,many=True)
        return Response(serializer.data)


class SellerApprovals(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        obj=CustomUser.objects.filter(is_active=False).values_list('id', flat=True)
        sellers=Seller.objects.filter(account_verified=False,user_id__in=obj)
        serializer=ViewSellerSerializer(sellers,many=True)
        return Response(serializer.data)

from django.db import transaction
class RemoveSeller(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,seller_id):
        if not request.user.is_staff:
            return Response({"error": "You are not authorized to perform this action."},status=status.HTTP_403_FORBIDDEN)
        try:
            with transaction.atomic():
                seller=get_object_or_404(Seller,id=seller_id)
                user=get_object_or_404(CustomUser,id=seller.user_id)
                obj=get_object_or_404(SellerBankDetails,seller_id=seller.id)
                obj.delete()
                seller.delete()
                user.delete()
            return Response({"message": "Seller removed successfully."},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f" Failed to remove seller {str(e)}"},status=status.HTTP_400_BAD_REQUEST)


class ApproveSeller(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,seller_id):
        if not request.user.is_staff:
            return Response({"errors":"You are not authorized to perform this action."},status=status.HTTP_403_FORBIDDEN)
        seller=Seller.objects.get(id=seller_id)
        user=CustomUser.objects.get(id=seller.user_id)
        user.is_active=True
        user.save()
        seller.account_verified=True
        seller.save()
        return Response({"message":"Approved Successfully..."},status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from adminapp.serializers import AddCategorySerializer

class AddCategory(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddCategorySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"message": "Category added successfully"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": f"Failed to add category: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

from adminapp.serializers import ViewCategorySerializer,UpdateNewCategorySerializer,DeleteCategorySerializer
from common.models import ProductCategory

class ViewCategory(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            categories=ProductCategory.objects.all()
            serializer=ViewCategorySerializer(categories,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":f"An Error Occured while fetching Categories {e}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class fetchUpdateCategory(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,cate_id):
        try:
            categories=ProductCategory.objects.filter(id=cate_id)
            serializer=ViewCategorySerializer(categories,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":f"An Error Occured while fetching Categories {e}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class UpdateNewCategory(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, cate_id):
        serializer = UpdateNewCategorySerializer(
            data=request.data, context={"request": request, "cate_id": cate_id}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Category Updated Successfully"}, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DeleteCategory(APIView):
    permission_classes=[IsAuthenticated]

    def delete(self,request,cate_id):
        try:
            serializer=DeleteCategorySerializer(context={"request":request,"cate_id":cate_id})
            serializer.save()
            return Response({"message":"Category Deleted Successfully..."},status=status.HTTP_200_OK)
        except ProductCategory.DoesNotExist:
            return Response({"errors":"The Category does not exist."},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"errors":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
