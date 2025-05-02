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
        users = CustomUser.objects.filter(seller_profile__isnull=True, admin_profile__isnull=True,user_type='user',is_superuser=False)
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


from adminapp.serializers import AddColorSerializer,ViewColorsSerializer,DeleteColorSerializer

class AddColor(APIView):
    permission_classes={IsAuthenticated}
    def post(self,request):
        serializer=AddColorSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Color Added Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":"Error Occured While Adding Color"},status=status.HTTP_400_BAD_REQUEST)

from common.models import Color
class ViewColors(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Color.objects.all()
        serializer=ViewColorsSerializer(obj,many=True)
        return Response(serializer.data)

class DeleteColor(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,color_id):
        try:
            serializer=DeleteColorSerializer(context={"request":request,"color_id":color_id})
            serializer.save()
            return Response({"message":"Color Deleted Successfully..."},status=status.HTTP_200_OK)
        except Color.DoesNotExist:
            return Response({"errors":"Color Does not exist"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"errors":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from adminapp.serializers import AddSizeSerializer,ViewSizeSerializer,SizeDeleteSerializer
class AddSize(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddSizeSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Size Added Successfully.."},status=status.HTTP_201_CREATED)
        if serializer.errors:
            return Response({"errors":str(serializer.errors)},status=status.HTTP_400_BAD_REQUEST)
        return Response({"errors":"Error Occured while adding size.."},status=status.HTTP_400_BAD_REQUEST)



from common.models import SizeOption,Brand

class ViewSize(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        size=SizeOption.objects.all()
        serializer=ViewSizeSerializer(size,many=True)
        return Response(serializer.data)


class SizeDelete(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,size_id):
        try:
            serializer=SizeDeleteSerializer(context={"request":request,"size_id":size_id})
            serializer.save()
            return Response({"message":"Size Deleted Successfully..."},status=status.HTTP_200_OK)
        except SizeOption.DoesNotExist:
            return Response({"errors":"Size Does not exist"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"errors":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from adminapp.serializers import AddBrandSerializer,BrandSerializer,UpdateNewBrandSerializer,DeleteBrandSerializer

class AddBrand(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddBrandSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Brand Added Successfully.."},status=status.HTTP_201_CREATED)
        if serializer.errors:
            return Response({"errors":str(serializer.errors)},status=status.HTTP_400_BAD_REQUEST)
        return Response({"errors":"Error Occured while adding size.."},status=status.HTTP_400_BAD_REQUEST)


class ViewBrand(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Brand.objects.all()
        serializer=BrandSerializer(obj,many=True)
        return Response(serializer.data)
    
class ViewUpdateBrand(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,brand_id):
        obj=Brand.objects.get(id=brand_id)
        serializer=BrandSerializer(obj)
        return Response(serializer.data)
    
class UpdateNewBrand(APIView):
    permission_classes=[IsAuthenticated]
    def put(self,request,brand_id1):
        print("BRRRRR",brand_id1)
        serializer=UpdateNewBrandSerializer(data=request.data,context={"request":request,"brand_id1":brand_id1})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Brand Updated Successfully.."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured.."},status=status.HTTP_400_BAD_REQUEST)

class DeleteBrand(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,brand_id):
        try:
            serializer=DeleteBrandSerializer(context={"request":request,"brand_id":brand_id})
            serializer.save()
            return Response({"message":"Brand deleted Successfully.."},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from adminapp.serializers import ViewPendingProductSerializer,IndividualProductsSerializer
from common.models import ProductItem

class ViewPendingProduct(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=ProductItem.objects.filter(status='pending')
        serializer=ViewPendingProductSerializer(obj,many=True)
        return Response(serializer.data)
    
    

class ViewAllProduct(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=ProductItem.objects.filter(status="approved")
        serializer=ViewPendingProductSerializer(obj,many=True)
        return Response(serializer.data)

from adminapp.serializers import ApproveProductSerializer,RejectProductSerializer
class ApproveProduct(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        obj=ProductItem.objects.get(id=id)
        obj.status="approved"
        obj.save()
        serializer=ApproveProductSerializer(data=request.data,context={"request":request,"id":id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Product Approved Successfully..."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured While Approve product"},status=status.HTTP_400_BAD_REQUEST)



class RejectProduct(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        obj=ProductItem.objects.get(id=id)
        obj.status="rejected"
        obj.save()
        serializer=RejectProductSerializer(data=request.data,context={"request":request,"id":id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Product Rejected.."},status=status.HTTP_200_OK)
        return Response({"errors":"Error Occured While Reject product"},status=status.HTTP_400_BAD_REQUEST)


class ViewProduct(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=ProductItem.objects.filter(id=id)
        serializer=IndividualProductsSerializer(obj,many=True)
        return Response(serializer.data)
    

from userapp.models import RatingsReview  
from adminapp.serializers import RatingReviewSerializer  
class ViewRatingReview(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,filterreview):
        print("MMM",filterreview)
        if filterreview=="All":
            obj=RatingsReview.objects.all()
        elif filterreview=="approved":
            status="approved"
            obj=RatingsReview.objects.filter(status=status)
        elif filterreview=="rejected":
            status="rejected"
            obj=RatingsReview.objects.filter(status=status)
        serializer=RatingReviewSerializer(obj,many=True)
        return Response(serializer.data)


from userapp.models import RatingsReview  


class ApproveReview(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        try:
            obj=RatingsReview.objects.get(id=id)
            obj.status="approved"
            obj.save()
            return Response({"message":"Approved..."},status=status.HTTP_200_OK)
        except RatingsReview.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RejectReview(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        try:
            obj=RatingsReview.objects.get(id=id)
            obj.status="rejected"
            obj.save()
            return Response({"message":"Rejected..."},status=status.HTTP_200_OK)
        except RatingsReview.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from adminapp.serializers import AddBannerSerializer

class AddBanner(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddBannerSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Banner Added Successfully"},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


from adminapp.serializers import GetBannersSerializer,UpdateBannerSerializer
from sellerapp.models import Banner
class GetBanners(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Banner.objects.all()
        serializer=GetBannersSerializer(obj,many=True)
        return Response(serializer.data)


class DeleteBanner(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        try:
            banner=Banner.objects.get(id=id)
        except Banner.DoesNotExist:
            return Response({"error": "Banner with the provided ID does not exist."},status=status.HTTP_404_NOT_FOUND)
        banner.delete()
        return Response({"message":"Banner Deleted Successfully..."},status=status.HTTP_204_NO_CONTENT)



class EditBannerData(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=Banner.objects.get(id=id)
        serializer=GetBannersSerializer(obj)
        return Response(serializer.data)
    
class UpdateBanner(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        serializer=UpdateBannerSerializer(data=request.data,context={"request":request,"id":id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Banner Updated Successfully"},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


class ActivateBanner(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        try:
            banner=Banner.objects.get(id=id)
        except Banner.DoesNotExist:
            return Response({"error": "Banner with the provided ID does not exist."},status=status.HTTP_404_NOT_FOUND)
        banner.is_active=True
        banner.save()
        return Response({"message":"Banner Activated Successfully..."},status=status.HTTP_204_NO_CONTENT)


class DeactivateBanner(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        try:
            banner=Banner.objects.get(id=id)
        except Banner.DoesNotExist:
            return Response({"error": "Banner with the provided ID does not exist."},status=status.HTTP_404_NOT_FOUND)
        banner.is_active=False
        banner.save()
        return Response({"message":"Banner Deactivated..."},status=status.HTTP_204_NO_CONTENT)

from adminapp.serializers import AddCouponSerializer,GetCouponsSerializer,EditCouponSerializer
from common.models import Coupon
class AddCoupon(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddCouponSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Coupon Added Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)

class GetCoupons(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Coupon.objects.all()
        serializer=GetCouponsSerializer(obj,many=True)
        return Response(serializer.data)

class DeleteCoupon(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        user=request.user
        if not CustomUser.objects.filter(id=user.id).exists():
            return Response({"message":"UnAuthorized User..."},status=status.HTTP_404_NOT_FOUND)
        if not Coupon.objects.filter(id=id).exists():
            return Response({"message":"Coupon does not exists..."})
        coupondata=Coupon.objects.get(id=id)
        coupondata.delete()
        return Response({"message":"Coupon deleted successfully..."},status=status.HTTP_200_OK)


class GetEditCoupon(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=Coupon.objects.filter(id=id)
        serializer=GetCouponsSerializer(obj,many=True)
        return Response(serializer.data)
    

class EditCoupon(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        serializer=EditCouponSerializer(data=request.data,context={"request":request,"id":id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Coupon Edited Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)

from adminapp.serializers import AddDiscountCardSerializer,GetDiscountCardSerializer,EditDiscountCardSerializer

class AddDiscountCard(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddDiscountCardSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Discount Card Added Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)


from sellerapp.models import DiscountCard  
class GetDiscountCards(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=DiscountCard.objects.all().order_by('-id')
        serializer=GetDiscountCardSerializer(obj,many=True)
        return Response(serializer.data)


class ActiveDeactive(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id, newStatus):
        if not DiscountCard.objects.filter(id=id).exists():
            return Response({"message": "Discount Card does not exist."})

        obj = DiscountCard.objects.get(id=id)
        print("Status:", newStatus)

        # Determine the active status based on the input
        if newStatus.lower() == "false":
            active_status = False
        elif newStatus.lower() == "true":
            active_status = True
        else:
            return Response({"message": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

        obj.is_active = active_status
        obj.save()

        return Response({"message": "Status changed successfully."}, status=status.HTTP_200_OK)


class DeleteDiscountCard(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        user=request.user
        if not CustomUser.objects.filter(id=user.id).exists():
            return Response({"message":"UnAuthorized User..."},status=status.HTTP_404_NOT_FOUND)
        if not DiscountCard.objects.filter(id=id).exists():
            return Response({"message":"DiscountCard does not exists..."})
        coupondata=DiscountCard.objects.get(id=id)
        coupondata.delete()
        return Response({"message":"DiscountCard deleted successfully..."},status=status.HTTP_200_OK)


class GetEditDiscountCard(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=DiscountCard.objects.filter(id=id)
        serializer=GetDiscountCardSerializer(obj,many=True)
        return Response(serializer.data)

class EditDiscountData(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,editCardId):
        serializer=EditDiscountCardSerializer(data=request.data,context={"request":request,"id":editCardId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"DiscountCard Edited Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)


from adminapp.serializers import AddFreeShippingSerializer,GetFreeShipDataSerializer

class AddFreeShippingOffer(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddFreeShippingSerializer(data=request.data,context={"request":request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Free Shipping Offer Added Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)


from sellerapp.models import FreeShippingOffer
class GetFreeshipOffers(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=FreeShippingOffer.objects.all().order_by('-id')
        serializer=GetFreeShipDataSerializer(obj,many=True)
        return Response(serializer.data)



class ShipOfferActiveDeactive(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id, newStatus):
        if not FreeShippingOffer.objects.filter(id=id).exists():
            return Response({"message": "FreeShippingOffer Card does not exist."})

        obj = FreeShippingOffer.objects.get(id=id)
        print("Status:", newStatus)

        # Determine the active status based on the input
        if newStatus.lower() == "false":
            active_status = False
        elif newStatus.lower() == "true":
            active_status = True
        else:
            return Response({"message": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

        obj.is_active = active_status
        obj.save()

        return Response({"message": "Status changed successfully."}, status=status.HTTP_200_OK)


class DeleteFreeShippingOffer(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,id):
        user=request.user
        if not CustomUser.objects.filter(id=user.id).exists():
            return Response({"message":"UnAuthorized User..."},status=status.HTTP_404_NOT_FOUND)
        if not FreeShippingOffer.objects.filter(id=id).exists():
            return Response({"message":"FreeShippingOffer does not exists..."})
        freeship=FreeShippingOffer.objects.get(id=id)
        freeship.delete()
        return Response({"message":"FreeShippingOffer deleted successfully..."},status=status.HTTP_200_OK)



class GetEditFreeShipOffer(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,id):
        obj=FreeShippingOffer.objects.filter(id=id)
        serializer=GetFreeShipDataSerializer(obj,many=True)
        return Response(serializer.data)  
    
from adminapp.serializers import EditShippingOfferSerializer,AddProductOfferSerializer

class EditShippingOfferData(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,editOfferId):
        serializer=EditShippingOfferSerializer(data=request.data,context={"request":request,"id":editOfferId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"FreeShippingOffer Edited Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)

from adminapp.serializers import ProductSelectSerializer
from common.models import Product
class GetSelectAllProducts(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=Product.objects.all()
        serializer=ProductSelectSerializer(obj,many=True)
        return Response(serializer.data)


class AddProductOffer(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print("Request Data:", request.data)  # Debug incoming data
        serializer = AddProductOfferSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            print("Saved successfully.")
            return Response({"message": "ProductOffer Added Successfully..."}, status=status.HTTP_201_CREATED)
        print("Serializer Errors:", serializer.errors)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

from sellerapp.models import ProductOffer
from adminapp.serializers import GetProductsAllOffersSerializer,EditProductOfferSerializer

class GetProductsAllOffers(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        obj=ProductOffer.objects.all().order_by('-id')
        serializer=GetProductsAllOffersSerializer(obj,many=True)
        return Response(serializer.data)


class DeleteProductOffer(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,offerId):
        user=request.user
        if not CustomUser.objects.filter(id=user.id).exists():
            return Response({"message":"UnAuthorized User..."},status=status.HTTP_404_NOT_FOUND)
        if not ProductOffer.objects.filter(id=offerId).exists():
            return Response({"message":"ProductOffer does not exists..."})
        freeship=ProductOffer.objects.get(id=offerId)
        freeship.delete()
        return Response({"message":"ProductOffer deleted successfully..."},status=status.HTTP_200_OK)

class ProductOfferActiveDeactive(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id, newStatus):
        if not ProductOffer.objects.filter(id=id).exists():
            return Response({"message": "ProductOffer does not exist."})

        obj = ProductOffer.objects.get(id=id)
        print("Status:", newStatus)

        # Determine the active status based on the input
        if newStatus.lower() == "false":
            active_status = False
        elif newStatus.lower() == "true":
            active_status = True
        else:
            return Response({"message": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

        obj.is_active = active_status
        obj.save()

        return Response({"message": "Status changed successfully."}, status=status.HTTP_200_OK)


class GetEditProductOffer(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,offerid):
        obj=ProductOffer.objects.filter(id=offerid)
        serializer=GetProductsAllOffersSerializer(obj,many=True)
        return Response(serializer.data)  

class EditProductOffers(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,editingOfferId):
        serializer=EditProductOfferSerializer(data=request.data,context={"request":request,"id":editingOfferId})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Product Offer Edited Successfully..."},status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors},status=status.HTTP_404_NOT_FOUND)