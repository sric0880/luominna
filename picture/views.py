from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from models import Tag, Album, Pic
from admin import PicForm
from . import retcode

# Create your views here.
def index(request):
  return HttpResponse("Hello world");

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
