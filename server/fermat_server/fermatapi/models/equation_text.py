from django.db import models
from .equations import Equation

class EquationText(models.Model):

	equation = models.ForeignKey(Equation, on_delete=models.DO_NOTHING)
	content = models.CharField(max_length=65535)
	x = models.IntegerField()
	y = models.IntegerField()
	size = models.FloatField()