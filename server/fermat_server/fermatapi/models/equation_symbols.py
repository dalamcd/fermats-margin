from django.db import models
from .symbols import Symbol
from .equations import Equation

class EquationSymbol(models.Model):

	symbol = models.ForeignKey(Symbol, on_delete=models.DO_NOTHING)
	equation = models.ForeignKey(Equation, on_delete=models.DO_NOTHING)
	x = models.IntegerField()
	y = models.IntegerField()
	size = models.FloatField()