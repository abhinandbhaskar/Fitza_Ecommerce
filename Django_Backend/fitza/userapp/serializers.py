from rest_framework import serializers
from common.models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django_email_verification import send_email
from django.conf import settings
from django.utils.timezone import now


from common.models import Product,ProductItem
from sellerapp.models import ProductOffer
class RegisterSerializer(serializers.Serializer):
    fullname=serializers.CharField()
    email=serializers.EmailField()
    phone=serializers.CharField()
    password1=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)

    def validate(self, data):
        if CustomUser.objects.filter(email=self.initial_data['email']).exists():
            raise serializers.ValidationError("Email already exists..")
        if self.initial_data["password1"]!=self.initial_data["password2"]:
            raise serializers.ValidationError("Passwords do not match.")
        if len(self.initial_data["phone"])<10:
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



from sellerapp.models import ProductImage
class ProductImageSerializer1(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id','main_image']

from common.models import ProductItem
class ProductItemSerializer1(serializers.ModelSerializer):
    images = ProductImageSerializer1(many=True, read_only=True)  # Corrected

    class Meta:
        model = ProductItem
        fields = ['id', 'images']


class GetProductDataSerializer1(serializers.ModelSerializer):
    items = ProductItemSerializer1(many=True, read_only=True)  # Corrected

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'items']


class DealsOfdayAllProducts(serializers.ModelSerializer):
    product=GetProductDataSerializer1(read_only=True)
    
    class Meta:
        model=ProductOffer
        fields=['end_date','product']







from sellerapp.models import ProductImage
from sellerapp.models import ProductOffer
class ViewProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image']

from django.utils.timezone import now
from django.db.models import Q, Avg
from common.models import Product,ProductItem
class ActiveOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOffer
        fields = ['offer_title', 'discount_percentage', 'end_date']
        read_only_fields = fields


from common.models import Color,Brand,SizeOption
class ViewColorsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Color
        fields='__all__'

class ViewSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model=SizeOption
        fields='__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model=Brand
        fields='__all__'

from common.models import ProductCategory

class ProductItemSerializer3(serializers.ModelSerializer):
    images = ViewProductImageSerializer(many=True, read_only=True)
    final_price = serializers.SerializerMethodField()
    color=ViewColorsSerializer(read_only=True)
    size=ViewSizeSerializer(read_only=True)

    class Meta:
        model = ProductItem
        fields = '__all__'

    def get_final_price(self, obj):
        # Calculate the final price using sale_price if available; otherwise, use original_price
        base_price = obj.sale_price if obj.sale_price else obj.original_price
        return float(base_price)


from django.utils import timezone
from common.models import ProductCategory
class ProductCategorySerializer2(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields=['category_name']

class ProductSerializer(serializers.ModelSerializer):
    items = ProductItemSerializer3(many=True, read_only=True)  # Properly handle related items
    category = ProductCategorySerializer2(read_only=True)
    ratings = serializers.SerializerMethodField()
    offers = serializers.SerializerMethodField()
    brand=BrandSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_ratings(self, obj):
        reviews = RatingsReview.objects.filter(product=obj, status='approved')  # Fetch approved reviews
        average_rating = reviews.aggregate(average=Avg('rating'))['average']
        return {
            'average_rating': round(average_rating, 1) if average_rating else 0,
            'total_reviews': reviews.count(),
        }

    def get_offers(self, obj):
            """Retrieve active offers for the product."""
            active_offers = obj.offers.filter(is_active=True, start_date__lte=timezone.now(), end_date__gte=timezone.now())
            return ActiveOfferSerializer(active_offers, many=True).data




class ProductViewSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductItem
        fields='__all__'












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
    images = ViewProductImageSerializer(many=True, read_only=True) 
    size=ViewSizeSerializer(read_only=True)
    color=ViewColorsSerializer(read_only=True)

    class Meta:
        model = ProductItem
        fields = '__all__'




class ProductDetaileViewSerializer(serializers.ModelSerializer):
    items=SellProductsSerializer(read_only=True,many=True)
    category=ViewCategorySerializer(read_only=True)
    brand=BrandSerializer(read_only=True)
    shop=ShopSellerSerializer(read_only=True)
    ratings = serializers.SerializerMethodField()
    offers = serializers.SerializerMethodField()


    class Meta:
        model=Product
        fields='__all__'
    
    def get_ratings(self, obj):
        reviews = RatingsReview.objects.filter(product=obj, status='approved')  # Fetch approved reviews
        average_rating = reviews.aggregate(average=Avg('rating'))['average']
        return {
            'average_rating': round(average_rating, 1) if average_rating else 0,
            'total_reviews': reviews.count(),
        }


    def get_offers(self, obj):
            """Retrieve active offers for the product."""
            active_offers = obj.offers.filter(is_active=True, start_date__lte=timezone.now(), end_date__gte=timezone.now())
            return ActiveOfferSerializer(active_offers, many=True).data






from notifications.notifiers import FeedbackAndReviewNotifier
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
        notifier=FeedbackAndReviewNotifier(user=obj.product.shop.user,sender=user)
        notifier.notify_seller_review(review_id=obj.id, product_name=obj.product.product_name, user_name=user.first_name)
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

from userapp.models import ShoppingCart,ShoppingCartItem

class AddToCartSerializer(serializers.Serializer):
    qnty = serializers.IntegerField()

    def validate(self, data):
        user = self.context["request"].user
        if not user.is_authenticated:
            raise serializers.ValidationError("Unauthorized user.")
        itemId = self.context.get("itemId")
        if not ProductItem.objects.filter(id=itemId).exists():
            raise serializers.ValidationError("Invalid product ID.")
        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        itemId = self.context["itemId"]

        shopping_cart, created = ShoppingCart.objects.get_or_create(user=user)

        productitem = ProductItem.objects.get(id=itemId)

        cart_item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            product_item=productitem,
            defaults={"quantity": self.validated_data["qnty"]}
        )

        if not created:
            cart_item.quantity += self.validated_data["qnty"]
            cart_item.save()






class ViewProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

from rest_framework import serializers
from userapp.models import ShoppingCartItem
from common.models import ProductItem

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image']

class ProductItemSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)  # Use `many=True` to handle multiple related images
    product = ViewProductsSerializer(read_only=True) 
    color = ViewColorsSerializer(read_only=True)
    size = ViewSizeSerializer(read_only=True)
    class Meta:
        model = ProductItem
        fields = ['id', 'product','sale_price', 'color','size', 'images']  # Include `images` to access related ProductImage data


from sellerapp.models import ProductOffer
class CartProductOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductOffer
        fields=['id','discount_percentage','start_date','end_date']

from common.models import CustomUser,UserAddress

class UserAddressSerilizer2(serializers.ModelSerializer):
    class Meta:
        model=UserAddress
        fields='__all__'

class CartDataUserSerializer(serializers.ModelSerializer):
    addresses=UserAddressSerilizer2(read_only=True,many=True)

    class Meta:
        model=CustomUser
        fields=['id','addresses']

class CartDataShopSerializer(serializers.ModelSerializer):
    user=CartDataUserSerializer(read_only=True)

    class Meta:
        model=Seller
        fields=['id','user']


class CartDataProductSerializer(serializers.ModelSerializer):
    offers=CartProductOfferSerializer(many=True)
    shop=CartDataShopSerializer(read_only=True)

    class Meta:
        model=Product
        fields='__all__'

class CartProductItemSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    product=CartDataProductSerializer(read_only=True)
    size=ViewSizeSerializer(read_only=True)

    class Meta:
        model=ProductItem
        fields='__all__'

class GetCartDataSerializer(serializers.ModelSerializer):
    product_item = CartProductItemSerializer()  # Include nested serializer for product item details


    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'product_item', 'quantity']


# mission




class AddToCartQntySerializer(serializers.ModelSerializer):
    qnty = serializers.IntegerField(write_only=True)

    class Meta:
        model = ShoppingCartItem
        fields = ['qnty']

    def create(self, validated_data):
        user = self.context["request"].user
        itemid = self.context.get("id")
        shopping_cart, _ = ShoppingCart.objects.get_or_create(user=user)
        produstitemobj = ProductItem.objects.get(id=itemid)
        
        cart_item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            product_item=produstitemobj
        )
        cart_item.quantity = validated_data["qnty"]
        cart_item.save()

        return cart_item



from common.models import Coupon

class CouponValueSerializer(serializers.ModelSerializer):
    class Meta:
        model=Coupon
        fields='__all__'


from datetime import datetime
from django.utils.timezone import now

class ApplyCouponCodeSerializer(serializers.Serializer):
    couponcode = serializers.CharField()

    def validate(self, data):
        user = self.context["request"].user

        # Check if the user exists
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("Unauthorized user.")
        
        # Check if the coupon code exists
        couponcode = data["couponcode"]
        try:
            coupon = Coupon.objects.get(code=couponcode)
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Incorrect coupon code.")
        
        # Check if the coupon is expired
        if coupon.end_date < now():  # Use Django's timezone-aware 'now'
            raise serializers.ValidationError("The coupon code has expired.")
        
        # Add the coupon to the validated data
        data["coupon"] = coupon
        return data


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['main_image']

class ProductItemSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)  # Use `many=True` to handle multiple related images 

    class Meta:
        model = ProductItem
        fields = ['id','images'] 

class ProductsDetailsSerializer(serializers.ModelSerializer):
    items=ProductItemSerializer(many=True)
    class Meta:
        model=Product
        fields='__all__'

from sellerapp.models import ProductOffer
class OfferProductsSerializer(serializers.ModelSerializer):
    product=ProductDetaileViewSerializer(read_only=True)

    class Meta:
        model=ProductOffer
        fields=['id','start_date','end_date','product']

from common.models import OrderStatus,ShopOrder
from userapp.models import OrderLine

class AddInitialOrderSerializer(serializers.Serializer):
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    final_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    coupon = serializers.CharField(required=False, allow_null=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)
    free_shipping_applied = serializers.BooleanField(default=False)

    def validate(self, data):
        user = self.context["request"].user
        if not user.is_authenticated:
            raise serializers.ValidationError("Unauthorized User.")
        return data

    def save(self):
        user = self.context["request"].user
        try:
            pending_status, created = OrderStatus.objects.get_or_create(status="Pending")
            if created:
                print("Created 'Pending Payment' status")

            # Create the order with optional coupon
            coupon = None
            discount_amount = self.validated_data.get("discount_amount", 0.00)
            
            if "coupon" in self.validated_data and self.validated_data["coupon"]:
                try:
                    coupon = Coupon.objects.get(id=self.validated_data["coupon"])
                except Coupon.DoesNotExist:
                    raise serializers.ValidationError("Invalid coupon")
            
            order = ShopOrder.objects.create(
                user=user,
                order_status=pending_status,
                order_total=self.validated_data["order_total"],
                discount_amount=discount_amount,
                applied_coupon=coupon,
                final_total=self.validated_data["final_total"],
                free_shipping_applied=self.validated_data.get("free_shipping_applied", False),
            )

            # Fetch the user's shopping cart
            shopping_cart = ShoppingCart.objects.get(user=user)

            # Fetch all items in the shopping cart
            cart_items = shopping_cart.cart_items.all()

            # Initialize a total variable for validation
            calculated_order_total = 0

            # Loop through the cart items and create corresponding order lines
            for cart_item in cart_items:
                product_item = cart_item.product_item
                seller = product_item.product.shop.user

                # Create order line for each cart item
                OrderLine.objects.create(
                    order=order,
                    product_item=cart_item.product_item,
                    quantity=cart_item.quantity,
                    price=cart_item.product_item.sale_price or cart_item.product_item.original_price,
                    seller=seller 
                )
                # Add to calculated order total
                calculated_order_total += cart_item.quantity * (cart_item.product_item.sale_price or cart_item.product_item.original_price)

            # Ensure the calculated total matches the provided order total
            if calculated_order_total != order.order_total:
                raise serializers.ValidationError("Calculated order total does not match provided order total.")

            return order

        except OrderStatus.DoesNotExist:
            raise serializers.ValidationError("Order status 'Pending Payment' is not configured.")
        except Exception as e:
            raise serializers.ValidationError(f"Failed to create order: {str(e)}")


from rest_framework import serializers
from common.models import Payment, Shipping, UserAddress
from notifications.notifiers import SellerNotifier
class PaymentSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Payment.PAYMENT_STATUS_CHOICES)
    transaction_id = serializers.CharField(max_length=50)  # Reduced length
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    gateway_response = serializers.JSONField(required=False, default=dict)  # Simplified JSON
    currency = serializers.CharField(max_length=3, default='USD')  # Currency codes are 3 characters
    payment_method = serializers.CharField(max_length=20, default='razorpay')  # Reduced length
    platform_fee = serializers.DecimalField(max_digits=7, decimal_places=2, default=0.00, required=False)
    seller_payout = serializers.DecimalField(max_digits=7, decimal_places=2, default=0.00, required=False)
    tracking_id = serializers.CharField(max_length=20, required=False, default="DEFAULT_TRACKING_ID")

    def validate(self, data):
        # Validate and truncate data
        cart_id = self.context.get("cartId", None)
        print("Cart ID in validation:", cart_id)
        if not cart_id:
            raise serializers.ValidationError({"cartId": "Cart ID not provided."})

        user = self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            print("Validation failed: Unauthorized user.")
            raise serializers.ValidationError({"user": "Unauthorized user."})

        if not ShopOrder.objects.filter(id=cart_id).exists():
            print("Validation failed: Shop order does not exist.")
            raise serializers.ValidationError({"cartId": "The specified shop order does not exist."})

        if not UserAddress.objects.filter(user=user).exists():
            print("Validation failed: User address not found.")
            raise serializers.ValidationError({"address": "User address not found."})

        # Truncate long fields
        data['transaction_id'] = data['transaction_id'][:50]
        data['tracking_id'] = data.get('tracking_id', 'DEFAULT_TRACKING_ID')[:20]

        # Simplify gateway_response
        gateway_response = data.get('gateway_response', {})
        data['gateway_response'] = {
            "payment_id": gateway_response.get("razorpay_payment_id", ""),
            "order_id": gateway_response.get("razorpay_order_id", ""),
            "signature": gateway_response.get("razorpay_signature", ""),
        }

        print("Validation passed successfully.")
        return data

    def save(self):
        try:
            print("Saving payment details...")
            user = self.context["request"].user
            order = ShopOrder.objects.get(id=self.context["cartId"])
            addressobj = UserAddress.objects.get(user=user, address_type='shipping')
            
            transaction_id = "KJonkjssjaoioij"  # Ensure it fits the DB limit (100)
            tracking_id = "kajas90oioina"  # Updated for consistency

            payment = Payment.objects.create(
                order=order,
                payment_method=self.validated_data['payment_method'],  
                status=self.validated_data['status'],
                transaction_id=transaction_id, 
                amount=self.validated_data['amount'],
                gateway_response=self.validated_data['gateway_response'],
                currency=self.validated_data['currency'],
                platform_fee=self.validated_data.get('platform_fee', 0.00),
                seller_payout=self.validated_data.get('seller_payout', 0.00),
            )
            seller_instance = order.order_lines.first().seller
            print("Payment saved successfully.")
            
            shipping = Shipping.objects.create(
                order=order,
                shipping_address=addressobj,
                status="pending",
                tracking_id=tracking_id,  # Ensure it's truncated if necessary
            )
            
            print("Shipping created successfully.")
            order.payment_method = payment
            order.shipping_address = shipping
            order.save()

            if self.validated_data['status']=="completed":
                notifier = SellerNotifier(seller_user=seller_instance,sender=user)
                notifier.new_order_received(order_id=order.id, user_name=user, order_total=self.validated_data['amount'])
            
            return payment  # Return the created Payment object
        except Exception as e:
            print("Error occurred while saving:", str(e))
            raise serializers.ValidationError({"detail": str(e)})


from notifications.notifiers import QASectionNotifier
from userapp.models import Question
class AskQuestionSerializer(serializers.Serializer):
    pid = serializers.IntegerField()  
    question = serializers.CharField(max_length=500)
    def validate(self,data):
        user = self.context["request"].user
        if not user.is_authenticated:
            raise serializers.ValidationError("Unauthorized User.")
      
        try:
            product = Product.objects.get(id=data["pid"])
        except Product.DoesNotExist:
            raise serializers.ValidationError("product not found.")
        
        data["product"]=product
        return data
    
    
    def save(self):
        user = self.context["request"].user
        product = self.validated_data["product"]
        question=Question.objects.create(
            user=user,
            product=product,
            question_text=self.validated_data["question"],
        )
        notifier=QASectionNotifier(user=question.product.shop.user,sender=user)
        notifier.new_question_added(question_id=question.id,product_name=self.validated_data["product"],user_name=user.first_name)
        return question

class ShopSellerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['id','shop_name','shop_logo','description','email']

class ProductsFullDetailsSerializer(serializers.ModelSerializer):
    items=ProductItemSerializer(many=True)
    shop=ShopSellerDetailsSerializer(read_only=True)

    class Meta:
        model=Product
        fields='__all__'




class ProductItemssSerializer(serializers.ModelSerializer):
    product=ProductsFullDetailsSerializer(read_only=True)

    class Meta:
        model = ProductItem
        fields = ['id','product','sale_price']


class OrderLineSerializer(serializers.ModelSerializer):
    product_item = ProductItemssSerializer(read_only=True)

    class Meta:
        model = OrderLine
        fields = ['id', 'product_item', 'quantity', 'price']

class OrderStatusgetSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderStatus
        fields='__all__'


class ShippingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Shipping
        fields='__all__'

class GetUserOrdersSerializer(serializers.ModelSerializer):
    order_lines = OrderLineSerializer(many=True, read_only=True)  # Include related order lines
    order_status=OrderStatusgetSerializer(read_only=True)
    shipping_address=ShippingDetailsSerializer(read_only=True)

    class Meta:
        model = ShopOrder
        fields = [
            'id', 'user', 'payment_method', 'shipping_address', 'order_status',
            'order_total', 'discount_amount', 'applied_coupon', 'final_total',
            'order_date', 'free_shipping_applied', 'order_lines' ,'order_status', # Include order_lines field
        ]


from notifications.notifiers import FeedbackAndReviewNotifier
from userapp.models import Feedback

class AddUserFeedBackSerializer(serializers.Serializer):
    rating = serializers.IntegerField()
    feedback = serializers.CharField()

    def validate(self, data):
        user = self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("Unauthorized user")
        return data

    def save(self):
        user = self.context["request"].user
        sid = self.context.get("sid")
        sellerobj = Seller.objects.get(id=sid)
        feedobj=Feedback.objects.create(
            user=user,
            seller=sellerobj,
            rating=self.validated_data["rating"],
            comment=self.validated_data["feedback"]
        )
        notifier=FeedbackAndReviewNotifier(user=sellerobj.user,sender=user)
        notifier.notify_seller_feedback( feedback_id=feedobj.id, user_name=user.first_name)


from notifications.notifiers import ReturnRefundNotifier
from userapp.models import ReturnRefund
class SendReturnRefundSerializer(serializers.Serializer):
    reason=serializers.CharField()
    refundAmount=serializers.IntegerField()
    refundMethod=serializers.CharField()
    isPartialRefund=serializers.BooleanField()
    comments=serializers.CharField()
    supportingFiles=serializers.FileField()
    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("UnAuthorized User...")
        return data

    def save(self):
        order_id = self.context["orderId"]
        user = self.context["request"].user
        order = ShopOrder.objects.get(id=order_id)
        
        sellers = order.order_lines.values_list('seller', flat=True).distinct()
        
        if len(sellers) == 1:
            seller = CustomUser.objects.get(id=sellers[0])
        else:
            seller = None 

        ReturnRefund.objects.create(
            order=order,
            requested_by=user,
            reason=self.validated_data["reason"],
            status="pending",
            refund_amount=self.validated_data["refundAmount"],
            refund_method=self.validated_data["refundMethod"],
            comments=self.validated_data["comments"],
            is_partial_refund=self.validated_data["isPartialRefund"],
            supporting_files=self.validated_data["supportingFiles"]
        )

        if seller:
            notifier = ReturnRefundNotifier(user=seller, sender=user)
            notifier.return_requested(order_id=order_id)
        else:
            pass



from userapp.models import ReturnRefund
class GetReturnRefundStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model=ReturnRefund
        fields='__all__'



class CustomerCancelOrderSerializer(serializers.Serializer):
    cancellationReason = serializers.CharField()

    def save(self):
        user=self.context["request"].user
        cancelled_status = OrderStatus.objects.get(status="cancelled")
        obj = ShopOrder.objects.get(id=self.context["orderId"])
        obj.order_status = cancelled_status
        obj.order_notes = self.validated_data["cancellationReason"]
        obj.save()
        seller_instance = obj.order_lines.first().seller
        notifier = SellerNotifier(seller_user=seller_instance,sender=user)
        notifier.order_canceled(order_id=obj.id, cancellation_reason=self.validated_data["cancellationReason"])


from sellerapp.models import Notification
class ViewUserAllNotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notification
        fields='__all__'
       



from sellerapp.models import DiscountCard,FreeShippingOffer
class GetDiscountCardsSerializer(serializers.ModelSerializer):
    class Meta:
        model=DiscountCard
        fields='__all__'

class FreeShipDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=FreeShippingOffer
        fields='__all__'