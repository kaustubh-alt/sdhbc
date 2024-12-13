# Generated by Django 5.1.3 on 2024-12-12 11:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eatright', '0003_remove_useraction_unique_user_dish'),
    ]

    operations = [
        migrations.CreateModel(
            name='userfavoritedishes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dishname', models.CharField(max_length=100)),
                ('time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddConstraint(
            model_name='useraction',
            constraint=models.UniqueConstraint(fields=('userid', 'dishname'), name='unique_user_dish'),
        ),
        migrations.AddField(
            model_name='userfavoritedishes',
            name='userid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='eatright.userdb'),
        ),
    ]