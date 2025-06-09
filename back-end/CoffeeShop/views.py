from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView


from .models import *
from .serializers import CoffeeProductSerializer, CategorySerializer, AnonymousCartSerializer, AnonymousCartItemSerializer



class CoffeeProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CoffeeProduct.objects.select_related('category').filter(is_published=True)
    serializer_class = CoffeeProductSerializer
    lookup_field = 'slug'



class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'



from django.shortcuts import get_object_or_404

class AnonymousCartViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        cart = get_object_or_404(AnonymousCart, uuid=pk)
        serializer = AnonymousCartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_cart(self, request):
        cart = AnonymousCart.objects.create()
        return Response({'uuid': str(cart.uuid)}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        cart = get_object_or_404(AnonymousCart, uuid=pk)
        serializer = AnonymousCartItemSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']

            item, created = AnonymousCartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                item.quantity += quantity
            item.save()

            return Response({'detail': 'Item added.'}, status=200)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'])
    def remove_item(self, request, pk=None):
        cart = get_object_or_404(AnonymousCart, uuid=pk)
        product_id = request.data.get('product_id')
        item = AnonymousCartItem.objects.filter(cart=cart, product_id=product_id).first()
        if item:
            item.delete()
        return Response({'detail': 'Item removed.'}, status=200)


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({"message": "User created"}, status=201)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
        })