from django.db import models
from .symbols import Symbol
from .categories import Category

class SymbolCategory(models.Model):

	symbol = models.ForeignKey(Symbol, on_delete=models.DO_NOTHING)
	category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)