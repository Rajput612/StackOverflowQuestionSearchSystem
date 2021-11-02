from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
# from .tokens import account_activation_token
from django.contrib.auth.tokens import default_token_generator
from . import  serializers
from .models import Users
from rest_framework.decorators import action,throttle_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from .throttles import UserMinThrottle,UserDayThrottle,AnonymousMinThrottle,AnonymouseDayThrottle
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from backend import  settings
from rest_framework.pagination import PageNumberPagination
import redis
import requests

import json
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                  port=settings.REDIS_PORT, db=0)

class SignupViewSet(viewsets.GenericViewSet, mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.CreateModelMixin, mixins.DestroyModelMixin):
    permission_classes = [AllowAny]
    serializer_class = serializers.SignupSerializer
    queryset = Users.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return serializers.SignupSerializer
        if self.request.method in [ 'PUT']:
            return serializers.UserUpdateSerializer
        return serializers.UserListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def update(self, request, pk=None):
        if int(request.user.id)==int(pk):
            user=Users.objects.get(id=pk)
            user.username=request.data.get("username",None)
            user.email=request.data.get("email",None)
            user.save()
            return Response({"status": "User updated successfull!!"})
        return Response({"status": "Unexpected Error Occured!!!"})

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = Users.objects.get(email=email)
        if user is not None and user.check_password(password):
            if user.is_active:
                # login(request, user)
                token = Token.objects.get(user=user)
                return Response({"status":status.HTTP_200_OK,"token":token.key})
            return Response({"status":"User is inactive"})
        return Response({"status":"User is invalid"})



@api_view(['GET'])
@permission_classes([AllowAny])
def activate_user(request,uid,token):
    try:
        uid = force_text(urlsafe_base64_decode(uid))
        user = Users.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, Users.DoesNotExist):
        user = None
    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({"response":"success"})
    return Response({"response":"Activation Link is invalid"})


@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([UserMinThrottle,UserDayThrottle,AnonymousMinThrottle,AnonymouseDayThrottle])
# @method_decorator(cache_page(60*60*2))
# @method_decorator(vary_on_cookie)
def test(request, format=None):
    if request.method == 'GET':
        items = {}
        count = 0
        query_filters = request.query_params.dict()
        page_no=int(query_filters.get('page_no',1))
        page_size=3
        time_to_expire_s=settings.CACHE_TTL
        data ={
            "q": query_filters.get("q",""),
            # "q": "Cannot find module 'babel-plugin-transform-decorators-legacy'",
            "accepted": query_filters.get("accepted",""),
            "answers": query_filters.get("answers",""),
            "body": query_filters.get("body",""),
            "closed": query_filters.get("closed",""),
            "migrated": query_filters.get("migrated",""),
            "notice": query_filters.get("notice",""),
            "nottagged": query_filters.get("nottagged",""),
            "tagged": query_filters.get("tagged",""),
            "title": query_filters.get("title",""),
            "user": query_filters.get("user",""),
            "url": query_filters.get("url",""),
            "views": query_filters.get("views",""),
            "wiki": query_filters.get("wiki",""),
            "fromdate": query_filters.get("fromdate",""),
            "todate": query_filters.get("todate",""),
            "page": query_filters.get("page",""),
            "pagesize": query_filters.get("pagesize",""),
            "order": query_filters.get("order","desc"),
            "sort": query_filters.get("sort","activity"),
            "min": query_filters.get("min",""),
            "max": query_filters.get("max",""),
            "site":"stackoverflow"
        }
        # print("data:-",data)
        paginator = PageNumberPagination()
        paginator.page_size = 10
        for key in redis_instance.keys('*'):
            if redis_instance.ttl(key) == -1:
                redis_instance.expire(key, 60 * 60 * 24 * 7)
        if  redis_instance.get(request.META['QUERY_STRING'])==None:
            output = requests.get(
                "https://api.stackexchange.com/2.3/search/advanced",
                params=data
            )
            redis_instance.set(request.META['QUERY_STRING'], output.text, ex=time_to_expire_s)
            page_no=1
            eval_out=eval(output.text.replace('false','False').replace('true','True').replace('null','None'))['items']
            final_out=json.dumps(
                            eval_out
                           )

            return Response(json.loads(
                final_out), status=200)
        else:
            response=redis_instance.get(request.META['QUERY_STRING'])
            return Response(json.loads(response)['items'], status=200)
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def test(request, format=None):
#     if request.method == 'GET':
#         return Response({"wll":"it works"})