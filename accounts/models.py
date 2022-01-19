from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.dispatch import receiver
from django.db.models.signals import post_delete, post_save
from neomodel import StructuredNode, StringProperty, FloatProperty, IntegerProperty, EmailProperty, UniqueIdProperty, Relationship, RelationshipTo, StructuredRel
from django.utils.translation import gettext_lazy as _


def upload_to(instance, filename):
    return 'profile/{filename}'.format(filename=filename)


class UserAccountManager(BaseUserManager):

    def create_superuser(self, email, name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')

        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')

        return self.create_user(email, name, password, **other_fields)

    def create_user(self, email, name, password=None, **other_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **other_fields)

        user.set_password(password)
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_busowner = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'is_busowner']

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    def __str__(self):
        return self.email


class Profile(models.Model):
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE)
    uid = models.CharField(max_length=255, unique=True, default=0)
    name = models.CharField(max_length=255, null=True)
    email = models.EmailField(max_length=255, unique=True)
    image = models.ImageField(
        _("Image"), upload_to=upload_to, default='profile/default.jpg'
    )

    def __str__(self):
        return f'{self.user}'


class User(StructuredNode):
    uid = StringProperty(unique_index=True)
    email = EmailProperty(required=True, unique_index=True)
    name = StringProperty(required=True)


@receiver(post_save, sender=UserAccount)
def update_profile_signal(sender, instance, created, **kwargs):
    if created:
        user_info = Profile.objects.create(
            user=instance, uid=instance.id, name=instance.name, email=instance.email)
    instance.profile.save()


@receiver(post_save, sender=Profile)
def update_neoUser_signal(sender, instance, created, **kwargs):
    if created:
        User(uid=instance.uid, name=instance.name, email=instance.email).save()


@receiver(post_delete, sender=UserAccount)
def delete_neoUser_signal(sender, instance, **kwargs):
    neo_user = User.nodes.get(email=instance)
    neo_user.delete()
