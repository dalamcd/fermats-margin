from django.db import models

class Symbol(models.Model):

	name = models.CharField(max_length=255)
	entity_code = models.IntegerField()