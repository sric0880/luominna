from django.db import models

# Create your models here.

class Tag(models.Model):
	name = models.CharField(max_length=100)

class Album(models.Model):
	name = models.CharField(max_length=100)
	artist = models.CharField(max_length=100)
	release_date = models.DateField()
	like = models.IntegerField()

class Pic(models.Model):
	name = models.CharField(max_length=100)
	creation_date = models.DateField()
	album = models.ForeignKey(Album, null=True, blank=True, on_delete=models.SET_NULL)
	stars = models.IntegerField()
	like = models.IntegerField()
	comment = models.TextField(blank=True)
	tags = models.ManyToManyField(Tag, related_name='pictures',  related_query_name='tag')
	url = models.URLField()
