from django.urls import path
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from .fermatapi.views import Symbols, EquationSymbols, Equations, Categories, register, login_user

router = routers.DefaultRouter(trailing_slash=False)
router.register('symbols', Symbols, 'symbol')
router.register('equations', Equations, 'equation')
router.register('equationsymbols', EquationSymbols, 'equationsymbol')
router.register('categories', Categories, 'category')

urlpatterns = [
    url(r'^', include(router.urls)),
    path('register', register),
    path('login', login_user),
    path('api-auth', include('rest_framework.urls', namespace='rest_framework')),
]
