# -*- coding: utf-8 -*-
from django import forms
from django.contrib import admin
import models
import custom_widgets

# Register your models here.

## costomize the admin form
class PicForm(forms.ModelForm):
  url = forms.URLField(
    widget=custom_widgets.CustomImageInput,
    label='图片'
    )
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

class PicChangeListForm(forms.ModelForm):
  stars = forms.ChoiceField(
    widget=custom_widgets.StarSelect( 
     attrs={'class': 'rating', 'radio_class': 'rating-input', 'radio_label_class': 'rating-star'} 
     ),
    choices=(('5',''), ('4',''), ('3',''), ('2',''),('1','')),
    )
  # def is_valid(self):
  #   from django.utils.encoding import force_text
  #   print(force_text(self.errors))
  #   return super(PicChangeListForm, self).is_valid()

  class Meta:
    model = models.Pic
    fields = ['url', 'name', 'creation_date', 'album', 'stars']

class PicAdmin(admin.ModelAdmin):
  fields = ('url', 'name', 'tags', 'stars', 'creation_date', 'album', 'comment')
  list_display = ('my_url_field', 'name', 'creation_date', 'album', 'stars', )
  list_editable = ('name', 'creation_date', 'album', 'stars', )
  list_filter = ('album', 'stars')
  search_fields = ['name', 'album__name', ]
  form=PicForm
  def get_changelist_form(self, request, **kwargs):
    return PicChangeListForm

  def my_url_field(self, obj):
    return '<a href="%s%s"><img src="%s" height="60"></a>' % ('/admin/picture/pic/', obj.id, obj.url + "!small")
  my_url_field.allow_tags = True
  my_url_field.short_description = '图片'

class PicInline(admin.StackedInline):
  fields = ('url', 'name', 'tags', 'stars', 'creation_date', 'album', 'comment')
  extra = 1
  model = models.Pic
  form=PicForm

class AlbumAdmin(admin.ModelAdmin):
  fields = ('name', 'artist', 'release_date', )
  list_display = ('name', 'artist', 'release_date', )
  list_editable = ('artist', 'release_date', )
  list_filter = ('artist', )
  search_fields = ['name', 'artist', ]
  # inlines = [
  #   PicInline,
  # ]

admin.site.register(models.Pic, PicAdmin)
admin.site.register(models.Album, AlbumAdmin)
# admin.site.register(models.Tag)