# Generated by Django 5.1.7 on 2025-05-15 17:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sellerapp', '0003_notification_expires_at_notification_priority'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='group',
            field=models.CharField(blank=True, choices=[('all_users', 'All Users'), ('all_sellers', 'All Sellers'), ('all_admins', 'All Admins')], help_text='Specify a group for this notification (if applicable).', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='sender',
            field=models.ForeignKey(blank=True, help_text='The sender of the notification.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sent_notifications', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(blank=True, help_text='Specify the individual user for this notification.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL),
        ),
    ]
