from django.http import HttpResponseServerError
from django.db.models import F
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from fermat_server.fermatapi.models import Symbol

class Symbols(ViewSet):

	def list(self, request):

		symbols = Symbol.objects.all()

		category = self.request.query_params.get("category", None)

		if category is not None:
			symbols = symbols.filter(symbolcategory__symbol_id=F('id')).filter(symbolcategory__category_id=category)

		data = SymbolSerializer(symbols, many=True, context={'request': request}).data

		return Response(data)

	def retrieve(self, request, pk=None):

		symbol = Symbol.objects.get(pk=pk)

		category = self.request.query_params.get("category", None)

		data = SymbolSerializer(symbol, many=False, context={'request': request}).data

		return Response(data)


class SymbolSerializer(serializers.ModelSerializer):

	class Meta():
		model = Symbol
		fields = ['id', 'name', 'entity_code']