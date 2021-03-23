from django.http import HttpResponseServerError
from django.db.models import F
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from fermat_server.fermatapi.models import EquationSymbol, Symbol, Equation

class EquationSymbols(ViewSet):

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
		symbol.symbol = Symbol.objects.get(pk=request.data["symbol"])
		symbol.equation = Equation.objects.get(pk=request.data["equation"])
		symbol.x = request.data["x"]
		symbol.y = request.data["y"]
		symbol.size = request.data["size"]

		symbol.save()

		data = EquationSymbolSerializer(symbol, many=False, context={'request': request}).data

		return Response(data, status=status.HTTP_201_CREATED)

	def update(self, request, pk=None):

		symbol = EquationSymbol.objects.get(pk=pk)
		symbol.x = request.data["x"]
		symbol.y = request.data["y"]
		symbol.size = request.data["size"]

		symbol.save()

		data = EquationSymbolSerializer(symbol, many=False, context={'request': request}).data

		return Response(data)
	
	def destory(self, request, pk=None):
		symbol = EquationSymbol.object.get(pk=pk)

		symbol.delete()

		return Response({}, status=status.HTTP_204_NO_CONTENT)

class EquationSymbolSerializer(serializers.ModelSerializer):

	class Meta():
		model = EquationSymbol
		fields = ['id', 'symbol', 'equation', 'x', 'y', 'size']