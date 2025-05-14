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

from userapp.models import ShoppingCart,ShoppingCartItem

class AddToCartSerializer(serializers.Serializer):
    size = serializers.CharField()
    qnty = serializers.IntegerField()

    def validate(self, data):
        user = self.context["request"].user
        if not user.is_authenticated:
            raise serializers.ValidationError("Unauthorized user.")
        product_id = self.context.get("id")
        if not ProductItem.objects.filter(id=product_id).exists():
            raise serializers.ValidationError("Invalid product ID.")
        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        product_id = self.context["id"]

        shopping_cart, created = ShoppingCart.objects.get_or_create(user=user)

        product = ProductItem.objects.get(id=product_id)

        cart_item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            product_item=product,
            defaults={"quantity": self.validated_data["qnty"]}
        )

        if not created:
            cart_item.quantity += self.validated_data["qnty"]
            cart_item.save()






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


class GetCartDataSerializer(serializers.ModelSerializer):
    product_item = ProductItemSerializer()  # Include nested serializer for product item details

    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'product_item', 'quantity']


# mission




class AddToCartSIzeSerializer(serializers.Serializer):
    size = serializers.CharField()
    # qnty = serializers.IntegerField()

    def validate(self, data):
        user = self.context["request"].user
        if not user.is_authenticated:
            raise serializers.ValidationError("Unauthorized user.")
        product_id = self.context.get("id")
        if not ProductItem.objects.filter(id=product_id).exists():
            raise serializers.ValidationError("Invalid product ID.")
        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        product_id = self.context["id"]

        shopping_cart, created = ShoppingCart.objects.get_or_create(user=user)

        product = ProductItem.objects.get(id=product_id)

        cart_item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            product_item=product,
            # defaults={"quantity": self.validated_data["qnty"]}
        )

        # if not created:
        #     cart_item.quantity += self.validated_data["qnty"]
        #     cart_item.save()



class AddToCartQntySerializer(serializers.ModelSerializer):
    qnty = serializers.IntegerField(write_only=True)

    class Meta:
        model = ShoppingCartItem
        fields = ['qnty']

    def create(self, validated_data):
        # Extracting user and product information from the context
        user = self.context["request"].user
        product_id = self.context["id"]

        # Fetching or creating the shopping cart for the user
        shopping_cart, _ = ShoppingCart.objects.get_or_create(user=user)
        product = ProductItem.objects.get(id=product_id)

        # Checking if the item already exists in the cart
        cart_item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            product_item=product
        )

        # Updating the quantity
        cart_item.quantity = validated_data["qnty"]
        cart_item.save()

        return cart_item



from common.models import Coupon

class CouponValueSerializer(serializers.ModelSerializer):
    class Meta:
        model=Coupon
        fields=["discount_value","minimum_order_amount","code","discount_type"]

class ApplyCouponCodeSerializer(serializers.Serializer):
    couponcode=serializers.CharField()

    def validate(self,data):
        user=self.context["request"].user
        if not CustomUser.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("UnAuthorized User..")
        couponcode=data["couponcode"]
        if not Coupon.objects.filter(code=couponcode).exists():
            raise serializers.ValidationError("Incorrect Coupon code...")
        
        coupon=Coupon.objects.get(code=couponcode)
        
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
    product=ProductsDetailsSerializer(read_only=True)

    class Meta:
        model=ProductOffer
        fields=['id','offer_title','offer_description','discount_percentage','start_date','end_date','product']

from common.models import OrderStatus,ShopOrder
from userapp.models import OrderLine



class AddInitialOrderSerializer(serializers.Serializer):
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    final_total = serializers.DecimalField(max_digits=10, decimal_places=2)
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

            # Create the order
            order = ShopOrder.objects.create(
                user=user,
                order_status=pending_status,
                order_total=self.validated_data["order_total"],
                discount_amount=self.validated_data.get("discount_amount", 0.00),
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
            
            # If you intend to limit the lengths:
            # transaction_id = self.validated_data['transaction_id'][:20]  # Ensure it fits the DB limit (100)
            # tracking_id = self.validated_data.get('tracking_id', "DEFAULT_TRACKING_ID")[:20]  # Updated for consistency

            transaction_id = "KJonkjssjaoioij"  # Ensure it fits the DB limit (100)
            tracking_id = "kajas90oioina"  # Updated for consistency

            payment = Payment.objects.create(
                order=order,
                payment_method=self.validated_data['payment_method'],  
                status=self.validated_data['status'],
                transaction_id=transaction_id,  # Use validated value
                amount=self.validated_data['amount'],
                gateway_response=self.validated_data['gateway_response'],
                currency=self.validated_data['currency'],
                platform_fee=self.validated_data.get('platform_fee', 0.00),
                seller_payout=self.validated_data.get('seller_payout', 0.00),
            )
            
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
            
            return payment  # Return the created Payment object
        except Exception as e:
            print("Error occurred while saving:", str(e))
            raise serializers.ValidationError({"detail": str(e)})



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
        Feedback.objects.create(
            user=user,
            seller=sellerobj,
            rating=self.validated_data["rating"],
            comment=self.validated_data["feedback"]
        )
        
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
        orderId=self.context["orderId"]
        user=self.context["request"].user
        order=ShopOrder.objects.get(id=orderId)
        ReturnRefund.objects.create(order=order,
                                    requested_by=user,
                                    reason=self.validated_data["reason"],
                                    status="pending",
                                    refund_amount=self.validated_data["refundAmount"],
                                    comments=self.validated_data["comments"],
                                    is_partial_refund=self.validated_data["isPartialRefund"],
                                    supporting_files=self.validated_data["supportingFiles"]
                                    )

from userapp.models import ReturnRefund
class GetReturnRefundStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model=ReturnRefund
        fields='__all__'



        
