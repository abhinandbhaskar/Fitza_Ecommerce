# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment, Bill

@receiver(post_save, sender=Payment)
def generate_bill_on_payment_save(sender, instance, created, **kwargs):
    if instance.status == 'completed':  # Only generate bill for completed payments
        shop_order = instance.order
        if not hasattr(shop_order, 'bill'):  # Prevent duplicate bills
            Bill.objects.create(
                order=shop_order,
                total_amount=shop_order.final_total,
                tax=shop_order.tax_amount,
                discount=shop_order.discount_amount,
                billing_address=shop_order.user.addresses.filter(address_type='billing').first(),
                payment_status='paid',
                invoice_number=f"INV-{instance.transaction_id}",
                payment=instance,
                created_by=shop_order.user,
            )
