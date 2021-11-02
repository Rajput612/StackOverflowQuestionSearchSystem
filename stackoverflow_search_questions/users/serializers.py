
# This work nicely, but serializer will reamain as it is, like

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'password','username', ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = get_user_model()(**validated_data)

        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user=user)
        email_subject = "Activate Your Account with The MyOneSollution"
        email_body = 'http://127.0.0.1:8000/confirm-email/' + uidb64 +'/' + token+'/'
        # message="Click On the below link to activate your account" +default_token_generator.make_token(user=user)
        send_mail(email_subject, email_body, 'from@example.com',
                  [user.email], fail_silently=False, )
        # Send an email to the user with the token:


        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','email','username', ]
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email','password', ]

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email','username' ]
        extra_kwargs = {
            'password': {'read_only': True}
        }

