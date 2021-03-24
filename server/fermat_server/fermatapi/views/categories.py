from django.http import HttpResponseServerError
from django.db.models import F
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from fermat_server.fermatapi.models import Category


class Categories(ViewSet):

	def list(self, request):

		categories = Category.objects.all()

		data = CategorySerializer(categories, many=True, context={'request': request}).data

		return Response(data)

	def retrieve(self, request, pk=None):

		category = Category.objects.get(pk=pk)

		data = CategorySerializer(category, many=False, context={'request': request}).data

		return Response(data)

class CategorySerializer(serializers.ModelSerializer):

	class Meta():
		model = Category
		fields = ['id', 'name']