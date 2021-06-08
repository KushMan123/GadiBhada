# Generated by Django 3.2 on 2021-05-20 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authenticate', '0002_rename_destination_person'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='email',
            field=models.EmailField(default='abc@gmail.com', max_length=100),
        ),
        migrations.AddField(
            model_name='person',
            name='name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='person',
            name='passs',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='person',
            name='repass',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='person',
            name='username',
            field=models.CharField(default='', max_length=50),
        ),
    ]
