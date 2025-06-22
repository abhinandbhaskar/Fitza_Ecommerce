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




# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from common.models import Interaction
# from userapp.ai_recommendations import AIRecommender

# @receiver(post_save, sender=Interaction)
# def on_new_interaction(sender, instance, created, **kwargs):
#     """Retrain model after every 50 new interactions"""
#     if created and Interaction.objects.count() % 50 == 0:
#         AIRecommender.train_model()


from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from django.core.cache import cache
from common.models import Interaction
from userapp.ai_recommendations import AIRecommender
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Track last training time to avoid too frequent retraining
LAST_TRAINING_TIME = None

@receiver(post_save, sender=Interaction)
@receiver(post_delete, sender=Interaction)
def schedule_model_retraining(sender, instance, **kwargs):
    """Schedule model retraining after significant changes"""
    global LAST_TRAINING_TIME
    
    # Don't retrain too frequently (minimum 1 hour between trainings)
    if LAST_TRAINING_TIME and (datetime.now() - LAST_TRAINING_TIME) < timedelta(hours=1):
        return
    
    # Count only recent interactions
    recent_interactions = Interaction.objects.filter(
        timestamp__gte=datetime.now() - timedelta(days=30)
    ).select_related('user', 'product')
    
    # Train after every 100 new interactions or 20% change
    total_interactions = recent_interactions.count()
    if total_interactions < 100:
        return
    
    # Get cache data to check when last trained
    cache_data = cache.get('ai_recommender')
    if cache_data and (datetime.now() - datetime.fromisoformat(cache_data['last_trained'])) < timedelta(days=1):
        return
    
    logger.info("Scheduling model retraining due to interaction changes")
    
    # Use transaction.on_commit to avoid training during HTTP request
    transaction.on_commit(
        lambda: perform_retraining(total_interactions)
    )

def perform_retraining(total_interactions):
    """Perform the actual retraining"""
    global LAST_TRAINING_TIME
    
    try:
        logger.info(f"Starting model retraining with {total_interactions} interactions")
        success = AIRecommender.train_model()
        LAST_TRAINING_TIME = datetime.now()
        if success:
            logger.info("Model retraining completed successfully")
        else:
            logger.warning("Model retraining didn't execute (not enough data)")
    except Exception as e:
        logger.error(f"Model retraining failed: {str(e)}", exc_info=True)