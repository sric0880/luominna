# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import Context, Template, loader
from django.http import HttpResponse, JsonResponse
from models import Tag, Album, Pic
from admin import PicForm
from . import retcode

import copy

# Create your views here.
nav_tabs=[{ 'active':False, 'url':'/albums', 'text':'册子'},
{ 'active':False, 'url':'/stars', 'text':'推荐'},
{ 'active':False, 'url':'/personal', 'text':'关于我'}]

def select_tab(index):
  nav_tabs_cp = copy.deepcopy(nav_tabs)
  nav_tabs_cp[index]['active'] = True
  return nav_tabs_cp

def select_pics(page):
  count_per_page = 12
  total_pics_count = Pic.objects.count()
  start_index = total_pics_count - (int(page)+1) * count_per_page
  end_index = total_pics_count - int(page) * count_per_page
  if end_index < 0 :
    return None
  elif start_index < 0 :
    start_index = 0
  ret = Pic.objects.all()[start_index : end_index : -1] ## -1 stand for reverse
  return ret

def select_pics_greatest(page):
  count_per_page = 12
  greatest_pics = Pic.objects.filter(stars=5)
  total_pics_count = len(greatest_pics)
  start_index = total_pics_count - (int(page)+1) * count_per_page
  end_index = total_pics_count - int(page) * count_per_page
  if end_index < 0 :
    return None
  elif start_index < 0 :
    start_index = 0
  ret = greatest_pics[start_index : end_index]
  ret.reverse()
  return ret

def select_albums(page):
  count_per_page = 4
  return None

def album_more(request, page):
  return JsonResponse({'data', select_albums(page)})

def render_pics_template(pics):
  if pics == None:
    return HttpResponse("")
  template = loader.get_template('picture/pic.html')
  template_gallery = loader.get_template('picture/pic_gallery_demo.html')
  html = []
  html_gallery = []
  for pic in pics:
    html.append(template.render({'pic': pic}))
    html_gallery.append(template_gallery.render({'pic': pic}))
  ret = '\n'.join(html)
  ret += ( '&' + '\n'.join(html_gallery) )
  return HttpResponse(ret, content_type='text/html; charset=utf-8');

def pic_more(request, page):
  pics = select_pics(page)
  return render_pics_template(pics)

def pic_greatest_more(request, page):
  pics = select_pics_greatest(page)
  return render_pics_template(pics)

##首页
def home(request):
  response_data = {
  'nav_tabs' : nav_tabs,
  'pictures' : select_pics(0),
  'more_pic_url' : '/pic_more'
  }
  return render(request, 'picture/home.html', response_data)

## 相册页
def albums(request):
  albums_all = Album.objects.all()[::-1]
  albums_pictures = [ Pic.objects.filter(album__id=album.id) for album in albums_all ]
  albums_data = zip(albums_all, albums_pictures)
  response_data = {
  'nav_tabs' : select_tab(0),
  'albums' : albums_data }
  return render(request, 'picture/albums.html', response_data);

## 推荐页
def stars(request):
  response_data = {
  'nav_tabs' : select_tab(1), 
  'pictures' : select_pics_greatest(0),
  'more_pic_url' : '/stars/pic_more'
  }
  return render(request, 'picture/home.html', response_data);

def personal(request):
  response_data = { 'nav_tabs' : select_tab(2) }
  return render(request, 'picture/personal.html', response_data);

## Return all tags in the database
def get_all_tags(request):
  list_tags = [ tag.name for tag in Tag.objects.all() ]
  response_data = {'data':list_tags}
  return JsonResponse(response_data)

## Add a tag
def add_tag(request):
  text = request.GET.get('tag')
  tags = Tag.objects.filter(name=text)
  if len(tags) == 0:
    tag = Tag.objects.create(name=text)
  else:
    tag = tags[0]
  retcode.SuccessInfo['msg'] = tag.id
  return JsonResponse(retcode.SuccessInfo)
