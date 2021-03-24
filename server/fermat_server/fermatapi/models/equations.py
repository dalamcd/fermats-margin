from django.db import models
from rest_framework.authtoken.models import Token

class Equation(models.Model):

	name = models.CharField(max_length=255)
	user = models.ForeignKey(Token, on_delete=models.DO_NOTHING)
