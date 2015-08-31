# -*- coding: utf-8 -*-
from django import forms
from django.contrib import admin
import models
import custom_widgets

# Register your models here.

## costomize the admin form
class PicForm(forms.ModelForm):
  tags = forms.ModelMultipleChoiceField(
    widget=custom_widgets.TagSelect,
    queryset=models.Tag.objects.all(),
    label='标签',
    required=False
    )
  stars = forms.ChoiceField(
    widget=custom_widgets.StarSelect( 
       attrs={'class': 'rating', 'radio_class': 'rating-input', 'radio_label_class': 'rating-star'} 
      ),
    choices=(('5',''), ('4',''), ('3',''), ('2',''),('1','')),
    label='星级'
    )

  class Meta:
    model = models.Pic
    fields = '__all__'
    exclude = ['like', ]

class PicAdmin(admin.ModelAdmin):
  fields = ('url', ('name', 'tags'), 'stars', 'creation_date', 'album', 'comment')
  list_display = ('name', 'creation_date', 'album', 'stars', )
  list_editable = ('name', 'creation_date', 'album', 'stars', )
  list_filter = ('album', 'stars')
  search_fields = ['name', 'album__name', ]
  form=PicForm

admin.site.register(models.Pic, PicAdmin)
admin.site.register(models.Album)
# admin.site.register(models.Tag)