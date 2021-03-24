from django.http import HttpResponseServerError
from django.db.models import F
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from fermat_server.fermatapi.models import EquationText, Symbol, Equation

class EquationSymbols(ViewSet):

	def list(self, request):

		symbols = EquationText.objects.all()

		data = EquationTextSerializer(symbols, many=True, context={'request': request}).data

		return Response(data)

	def retrieve(self, request, pk=None):

		symbol = EquationText.objects.filter(equation=pk)

		data = EquationTextSerializer(symbol, many=True, context={'request': request}).data

		return Response(data)
	
	def create(self, request):

		symbol = EquationText()
		symbol.symbol = Symbol.objects.get(pk=request.data["symbol"])
		symbol.equation = Equation.objects.get(pk=request.data["equation"])
		symbol.x = request.data["x"]
		symbol.y = request.data["y"]
		symbol.size = request.data["size"]

		symbol.save()

		data = EquationTextSerializer(symbol, many=False, context={'request': request}).data

		return Response(data, status=status.HTTP_201_CREATED)

	def update(self, request, pk=None):

		symbol = EquationText.objects.get(pk=pk)
		symbol.x = request.data["x"]
		symbol.y = request.data["y"]
		symbol.size = request.data["size"]

		symbol.save()

		data = EquationTextSerializer(symbol, many=False, context={'request': request}).data

		return Response(data)
	
	def destroy(self, request, pk=None):
		symbol = EquationText.objects.get(pk=pk)

		symbol.delete()

		return Response({}, status=status.HTTP_204_NO_CONTENT)

class EquationTextSerializer(serializers.ModelSerializer):

	class Meta():
		model = EquationText
		fields = ['id', 'content', 'equation', 'x', 'y', 'size']