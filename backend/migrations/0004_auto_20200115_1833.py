# Generated by Django 2.2.9 on 2020-01-15 18:33

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_auto_20200115_1830'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagemodel',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(1, 1, 1, 0, 0, tzinfo=utc)),
        ),
    ]
