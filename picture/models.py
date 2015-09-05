# -*- coding: utf-8 -*-
from django.db import models

# Create your models here.

class Tag(models.Model):
	name = models.CharField(max_length=100, unique=True)

	def __unicode__(self):
		return self.name

class Album(models.Model):
	name = models.CharField(max_length=100, unique=True, verbose_name='名称')
	artist = models.CharField(max_length=100, verbose_name='创作者')
	release_date = models.DateField(verbose_name='创作日期')
	like = models.IntegerField(default=0, verbose_name='赞')

	def __unicode__(self):
		return self.name

class Pic(models.Model):
	name = models.CharField(max_length=100, verbose_name='名称')
	creation_date = models.DateField(verbose_name='创作日期')
	album = models.ForeignKey(Album, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='画册')
	stars = models.IntegerField(default=4, verbose_name='星级')
	like = models.IntegerField(default=0, verbose_name='赞')
	comment = models.TextField(blank=True, verbose_name='描述')
	tags = models.ManyToManyField(Tag, blank=True, related_name='pictures',  related_query_name='tag', verbose_name='标签')
	url = models.URLField(unique=True, verbose_name='链接')

	def __unicode__(self):
		return self.name
