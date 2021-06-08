# Generated by Django 3.2 on 2021-06-07 09:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authenticate', '0003_auto_20210520_1049'),
    ]

    operations = [
        migrations.RenameField(
            model_name='person',
            old_name='passs',
            new_name='password',
        ),
        migrations.RemoveField(
            model_name='person',
            name='repass',
        ),
        migrations.AddField(
            model_name='person',
            name='user',
            field=models.OneToOneField(default='', on_delete=django.db.models.deletion.CASCADE, to='auth.user'),
            preserve_default=False,
        ),
    ]