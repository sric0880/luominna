from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

def index(HttpRequest):
  return HttpResponse("hello")