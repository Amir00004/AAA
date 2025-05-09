# Generated by Django 5.1.7 on 2025-03-25 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_customuser_managers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctor',
            name='experience_years',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='license_number',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='specialization',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
