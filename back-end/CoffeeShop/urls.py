from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CoffeeProductViewSet, AnonymousCartViewSet, RegisterView, UserProfileView


router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='coffee-categories')
router.register('products', CoffeeProductViewSet, basename='coffee-products')

cart_view = AnonymousCartViewSet.as_view({
    'get': 'retrieve',
})



urlpatterns = [
    path('', include(router.urls)),
    path('anonymous-cart/<uuid:pk>/', cart_view, name='anonymous-cart-detail'),
    path('anonymous-cart/create/', AnonymousCartViewSet.as_view({'post': 'create_cart'})),
    path('anonymous-cart/<uuid:pk>/add-item/', AnonymousCartViewSet.as_view({'post': 'add_item'})),
    path('anonymous-cart/<uuid:pk>/remove-item/', AnonymousCartViewSet.as_view({'post': 'remove_item'})),

]




urlpatterns += [
    path("api/auth/register/", RegisterView.as_view(), name="register"),
]
urlpatterns += [
    path("api/auth/profile/", UserProfileView.as_view(), name="profile"),
]
