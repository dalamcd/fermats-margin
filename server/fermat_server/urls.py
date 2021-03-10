from django.urls import path
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from .fermatapi.views import Symbols

router = routers.DefaultRouter(trailing_slash=False)
router.register('symbols', Symbols, 'symbol')

urlpatterns = [
    url(r'^', include(router.urls)),
]
