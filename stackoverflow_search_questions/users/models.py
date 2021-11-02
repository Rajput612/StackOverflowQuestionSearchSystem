from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from model_utils.models import TimeStampedModel
from model_utils import Choices
from model_utils.fields import StatusField
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from .managers import CustomUserManager
from django.core.mail import send_mail
import datetime
from backend import settings

class MyAccountManager(BaseUserManager):
    def create_user(self, email, password):
        """
        Create and save a user with the given email and password.

        Overrides the function from BaseUserManager
        """
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
        )
        user.is_admin = True
        user.is_active=True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

class Users(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True, blank=True, null=True, default=None)
    username= models.CharField(max_length=30, blank=True, null=True)
    # slug = models.CharField(max_length=30,unique=True, blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    objects = MyAccountManager()

    class Meta:
        db_table = "tbl_users"

    def __str__(self):
        return str(self.email)



    def has_perm(self, perm, obj=None): return self.is_superuser

    def has_module_perms(self, app_label): return self.is_superuser

    # def save(self, *args, **kwargs):
    #     self.slug = slugify(self.username)
    #     super(Users, self).save(*args, **kwargs)

