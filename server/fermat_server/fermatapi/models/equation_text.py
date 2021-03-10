from django.db import models
from .equations import Equation

class EquationSymbol(models.Model):

	equation = models.ForeignKey(Equation, on_delete=models.DO_NOTHING)
	content = models.CharField(max_length=65535)
	x = models.FloatField()
	y = models.FloatField()
	size = models.FloatField()