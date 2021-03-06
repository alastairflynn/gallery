# Generated by Django 2.2.9 on 2020-01-01 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ImageModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('src', models.CharField(max_length=1000)),
                ('thumb', models.CharField(max_length=1000)),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('date', models.DateTimeField()),
                ('lat', models.FloatField(null=True)),
                ('lon', models.FloatField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PathModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=1000)),
            ],
        ),
    ]
