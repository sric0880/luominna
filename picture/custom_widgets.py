# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from itertools import chain

from django import forms
from django.forms.widgets import ChoiceFieldRenderer, RadioChoiceInput, TextInput
from django.forms.utils import flatatt
from django.utils.encoding import force_unicode, force_text
from django.utils.safestring import mark_safe
from django.utils.html import conditional_escape, format_html, html_safe



## Star style 
class CustomRadioInput(RadioChoiceInput):

	def render(self, name=None, value=None, attrs=None, choices=()):
		if self.id_for_label:
			label_for = format_html(' for="{}"', self.id_for_label)
		else:
			label_for = ''
		name = name or self.name
		value = value or self.value
		attrs = dict(self.attrs, **attrs) if attrs else self.attrs
		radio_class_ = self.attrs.get('radio_class', None)
		radio_label_class_ = self.attrs.get('radio_label_class', None)
		radio_label_class = format_html(' class="{}"', radio_label_class_) if radio_label_class_ else ''
		if radio_label_class_:
			del attrs['radio_label_class'] 
		if radio_class_:
			del attrs['radio_class']
		attrs['class'] = radio_class_ if radio_class_ else ''
		return format_html( '{}\n<label{}{}>{}</label>', self.tag(attrs), label_for, radio_label_class, self.choice_label )

class CustomRadioFieldRenderer(ChoiceFieldRenderer):
	choice_input_class = CustomRadioInput
	outer_html = '<span{class_attr}>{content}</span>'

	def render(self):
		class_ = self.attrs.get('class', None)
		return  format_html( self.outer_html, 
			class_attr=format_html(' class="{}"', class_) if class_ else '', 
			content=mark_safe('\n'.join([ force_unicode(radio) for radio in self ])))

class StarSelect(forms.RadioSelect):
	renderer = CustomRadioFieldRenderer

	class Media:
		css = {
		'all' : ('/static/css/stars.css',)
		}


# Tag style
class TagSelect(forms.SelectMultiple):
	inner_html = '<li{}>{label}</li>'
	outer_html = '<ul{}>{}</ul>'

	def render_options(self, choices, selected_choices):
		output = []
		for option_value, option_label in chain(self.choices, choices):
			if option_value in selected_choices:
				value = format_html(' value={}', option_value)
				output.append(format_html(self.inner_html, value, label=force_unicode(option_label)))
		return '\n'.join(output)

	def render(self, name, value, attrs=None, choices=()):
		if value is None:
			value = []
		final_attrs = self.build_attrs(attrs, name=name)
		content = self.render_options(choices, value)
		content = format_html(content)
		return mark_safe(format_html(self.outer_html, flatatt(final_attrs), content))

	class Media:
		css = {
		'all' : (
			'css/jquery.tagit.css', 
			'css/jquery-ui.min.css')
		}
		js = (
			'js/jquery-1.11.3.min.js', 
			'js/jquery-ui.min.js', 
			'js/tag-it.min.js', 
			'js/mytag-it.js')

# Image Selector
class CustomImageInput(TextInput):
	html = '''
	<dev id="fileupload">
    <div class="fileupload-buttonbar">
        <div class="fileupload-buttons">
            <span class="fileinput-button">
                <span>更换图片...</span>
                <input type="file" name="file">
            </span>
            <!-- <button class="start">开始上传</button> -->
            <!-- <button class="cancel">取消上传</button> -->
            <span class="fileupload-process"></span>
        </div>
       <!-- <div class="fileupload-progress fade" style="display:none">
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-extended">&nbsp;</div>
        </div> -->
    </div>
    <table role="presentation"><tbody class="files"></tbody></table>
  </dev>
  '''

	class Media:
		css = {
		'all' : (
			'css/jquery-ui.min.css',
			'css/jquery.fileupload.css', 
			'css/jquery.fileupload-ui.css')
		}
		js = (
			'js/jquery-1.11.3.min.js', 
			'js/jquery-ui.min.js',
			'js/load-image.all.min.js',
      'js/jquery.fileupload.js', 
			'js/jquery.fileupload-process.js',
			'js/jquery.fileupload-image.js',
			'js/jquery.fileupload-validate.js',
      'js/myfileupload.js',
			'js/jquery.fileupload-ui.js',
			'js/jquery.fileupload-jquery-ui.js',
      'js/spark-md5.min.js',
			)

	def render(self, name, value, attrs=None):
		if value is None:
			value = ''
		final_attrs = self.build_attrs(attrs, type='hidden', name=name)
		final_attrs['value'] = force_text(value)
		if final_attrs['value'] is '':
			return format_html('<input{} />\n{}\n', flatatt(final_attrs), format_html(self.html))
		else:
			return format_html('<input{} />\n{}\n<br><img id="id_img" src="{}"/>', flatatt(final_attrs), format_html(self.html), final_attrs['value']+"!preview")
