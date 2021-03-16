from django.http import HttpResponseServerError
from django.db.models import F
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from fermat_server.fermatapi.models import EquationSymbol

class Symbols(ViewSet):

	def list(self, request):

		symbols = EquationSymbol.objects.all()

		data = EquationSymbolSerializer(symbols, many=True, context={'request': request}).data

		return Response(data)

	def retrieve(self, request, pk=None):

		symbol = EquationSymbol.objects.get(pk=pk)

		data = EquationSymbolSerializer(symbol, many=False, context={'request': request}).data

		return Response(data)
	
	def create(self, request):

		symbol = EquationSymbol()
		symbol.symbol = request.data["symbol"]
		symbol.equation = request.data["equation"]
		symbol.x = request.data["x"]
		symbol.y = request.data["y"]
		symbol.size = request.data["size"]

		symbol.save()

		data = EquationSymbolSerializer(symbol, many=False, context={'request': request}).data

		return Response(data, status=status.HTTP_201_CREATED)



class EquationSymbolSerializer(serializers.ModelSerializer):

	class Meta():
		model = EquationSymbol
		fields = ['id', 'symbol', 'equation', 'x', 'y', 'size']