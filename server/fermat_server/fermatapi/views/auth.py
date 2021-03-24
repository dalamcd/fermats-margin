import json
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


@csrf_exempt
def login_user(request):

	req_body = json.loads(request.body.decode())

	if request.method == "POST":

		auth_user = authenticate(username=req_body['username'], password=req_body['password'])

		if auth_user is not None:
			token = Token.objects.get(user=auth_user)
			data = json.dumps({"valid": True, "token": token.key})
			return HttpResponse(data, content_type='application/json')

		else:
			data = json.dumps({"valid": False})
			return HttpResponse(data, content_type='application/json')

@csrf_exempt
def register(request):

	req_body = json.loads(request.body.decode())

	new_user = User.objects.create_user(
		username=req_body['username'],
		email=req_body['email'],
		password=req_body['password'],
		first_name=req_body['first_name'],
		last_name=req_body['last_name']
	)

	token = Token.objects.create(user=new_user)
	data = json.dumps({"token": token.key})
	return HttpResponse(data, content_type='application/json', status=status.HTTP_201_CREATED)