from .symbols import Symbols
from .equation_symbols import EquationSymbols

from django.http import HttpResponseServerError
from django.db.models import F
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from fermat_server.fermatapi.models import Equation, EquationSymbol
from rest_framework.authtoken.models import Token


class Equations(ViewSet):

	def list(self, request):

		equations = Equation.objects.all()

		data = EquationSerializer(equations, many=True, context={'request': request}).data

		return Response(data)

	def retrieve(self, request, pk=None):

		equation = Equation.objects.get(pk=pk)

		data = EquationSerializer(equation, many=False, context={'request': request}).data

		return Response(data)
	
	def create(self, request):

		equation = Equation()
		equation.user = Token.objects.get(pk=request.data["user"])
		equation.name = request.data["name"]

		equation.save()

		data = EquationSerializer(equation, many=False, context={'request': request}).data

		return Response(data, status=status.HTTP_201_CREATED)

	def destroy(self, request, pk=None):

		symbols = EquationSymbol.objects.filter(equation=pk)

		symbols.delete()

		equation = Equation.objects.get(pk=pk)

		equation.delete()

		return Response({}, status=status.HTTP_204_NO_CONTENT)

class EquationSerializer(serializers.ModelSerializer):

	class Meta():
		model = Equation
		fields = ['id', 'user', 'name']