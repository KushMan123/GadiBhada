from django.http import JsonResponse, response
from neomodel import db
from neomodel.exceptions import ConstraintValidationFailed
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from api.models import Route
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status, views, viewsets

# Create your views here.
from django.db import models
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, serializers, status
from .serializers import ProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class GetProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        print(self.request.headers)
        print(self.request.user)
        # print(request.headers.Authorization)
        uid = request.GET.get('uid', '')
        print(uid)

        profile_data = Profile.objects.filter(user=uid)
        for data in profile_data:
            pname = data.name
            pemail = data.email
            pimage = data.image.path

        try:
            response = []
            obj = {
                'name': pname,
                'email': pemail,
                'image': pimage
            }
            response.append(obj)
            print(response)
            return Response(response, status=status.HTTP_200_OK)
        except:
            response = {"error": "Error occured"}
            return JsonResponse(response, status=status.HTTP_400_BAD_REQUEST)


class CreateProfileView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        # print(request.data.email)
        print(request.data)
        model = get_object_or_404(Profile, email=request.data.get('email'))
        print(model.name)
        data = {"name": request.data.get(
            'name'), "image": request.data.get('image')}
        serializer = ProfileSerializer(model, data=data, partial=True)
        print(serializer.is_valid())
        print(serializer.errors)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserRoutesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # print(self.request.headers)
        # print(self.request.user)
        # # print(request.headers.Authorization)
        uid = request.GET.get('uid', '')
        print(uid)

        route_data = Route.objects.filter(usid=uid)
        res = []
        for data in route_data:
            res.append(data.rname)

        print(res)

        try:
            response = []
            obj = {
                'route_names': res,
            }
            response.append(obj)
            print(response)
            return Response(response, status=status.HTTP_200_OK)
        except:
            response = {"error": "Error occured"}
            return JsonResponse(response, status=status.HTTP_400_BAD_REQUEST)
