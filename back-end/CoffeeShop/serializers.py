from rest_framework import serializers

from .models import CoffeeProduct, Category, AnonymousCart, AnonymousCartItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug']

class CoffeeProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = CoffeeProduct
        fields = ['id', 'name', 'slug', 'description', 'image', 'price', 'category', 'category_id']



class ProductMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoffeeProduct
        fields = ['id', 'title', 'price']

class AnonymousCartItemSerializer(serializers.ModelSerializer):
    product = ProductMiniSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=CoffeeProduct.objects.all(), write_only=True, source='product'
    )

    class Meta:
        model = AnonymousCartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class AnonymousCartSerializer(serializers.ModelSerializer):
    items = AnonymousCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = AnonymousCart
        fields = ['uuid', 'created_at', 'items']
