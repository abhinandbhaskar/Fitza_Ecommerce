# Generated by Django 5.1.7 on 2025-05-15 17:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0002_bill_created_by_bill_currency_bill_payment_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wallettransaction',
            name='wallet',
        ),
        migrations.DeleteModel(
            name='Wallet',
        ),
        migrations.DeleteModel(
            name='WalletTransaction',
        ),
    ]
