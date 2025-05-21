


# from sellerapp.models import ProductImage
# from sellerapp.models import ProductOffer
# class ViewProductImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductImage
#         fields = ['main_image']

# from django.utils.timezone import now
# from django.db.models import Q, Avg
# from common.models import Product,ProductItem
# class ActiveOfferSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductOffer
#         fields = ['offer_title', 'discount_percentage', 'end_date']
#         read_only_fields = fields

# from common.models import ProductCategory
# class ProductCategorySerializer2(serializers.ModelSerializer):
#     class Meta:
#         model = ProductCategory
#         fields=['category_name']

# class ProductsSerializer(serializers.ModelSerializer):
#     active_offer = serializers.SerializerMethodField()
#     category=ProductCategorySerializer2(read_only=True)
    
#     class Meta:
#         model = Product
#         fields = '__all__'
    
#     def get_active_offer(self, obj):
#         active_offers = obj.offers.filter(
#             Q(is_active=True) &
#             Q(start_date__lte=now()) &
#             Q(end_date__gte=now())
#         ).order_by('-discount_percentage')[:1]
        
#         return ActiveOfferSerializer(active_offers.first()).data if active_offers.exists() else None

# class ProductViewSerializer(serializers.ModelSerializer):
#     images = ViewProductImageSerializer(many=True, read_only=True)
#     product = ProductsSerializer(read_only=True)
#     ratings = serializers.SerializerMethodField()
#     final_price = serializers.SerializerMethodField()

#     class Meta:
#         model = ProductItem
#         fields = '__all__'
#         extra_fields = ['final_price']

#     def get_ratings(self, obj):
#         reviews = RatingsReview.objects.filter(product=obj.product, status='approved')
#         average_rating = reviews.aggregate(average=Avg('rating'))['average']
#         return {
#             'average_rating': round(average_rating, 1) if average_rating else 0,
#             'total_reviews': reviews.count(),
#         }

#     def get_final_price(self, obj):
#         base_price = obj.sale_price if obj.sale_price is not None else obj.original_price
        
#         if offer := self.context.get('active_offer'):
#             discount = base_price * (offer['discount_percentage'] / 100)
#             return float(base_price - discount)
        
#         return float(base_price)





















# class ViewProductsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Product
#         fields = '__all__'

# class ViewProductImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductImage
#         fields = ['main_image', 'sub_image_1', 'sub_image_2', 'sub_image_3']

# from common.models import SizeOption,Color,Brand,Seller,ProductCategory

# class ViewSizeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=SizeOption
#         fields='__all__'

# class ViewColorsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Color
#         fields='__all__'

# class BrandSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Brand
#         fields='__all__'

# class ViewCategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model=ProductCategory
#         fields='__all__'



# class ShopSellerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Seller
#         fields = '__all__'

# class SellProductsSerializer(serializers.ModelSerializer):
#     product = ViewProductsSerializer(read_only=True) 
#     images = ViewProductImageSerializer(many=True, read_only=True) 
#     brand=serializers.SerializerMethodField()
#     size=ViewSizeSerializer(read_only=True)
#     color=ViewColorsSerializer(read_only=True)
#     category=serializers.SerializerMethodField() 
#     shop=serializers.SerializerMethodField() 

#     class Meta:
#         model = ProductItem
#         fields = [
#             'id', 'product','color','shop', 'size', 'original_price', 'sale_price', 'product_code',
#             'quantity_in_stock', 'rejection_reason', 'images', 'brand', 'category'
#         ]


#     def get_brand(self, obj):
#         if obj.product and obj.product.brand:
#             return BrandSerializer(obj.product.brand).data
#         return None

#     def get_category(self, obj):
#         if obj.product and obj.product.category:
#             return ViewCategorySerializer(obj.product.category).data
#         return None

#     def get_shop(self, obj):
#         if obj.product and obj.product.shop:
#             return ShopSellerSerializer(obj.product.shop).data
#         return None





