# from django.core.management.base import BaseCommand
# from userapp.ai_recommendations import AIRecommender

# class Command(BaseCommand):
#     help = 'Train the AI recommendation model'

#     def handle(self, *args, **options):
#         self.stdout.write("Training AI recommendation model...")
#         success = AIRecommender.train_model()
#         if success:
#             self.stdout.write(self.style.SUCCESS("AI model trained successfully!"))
#         else:
#             self.stdout.write(self.style.WARNING("No data available to train the model"))


from django.core.management.base import BaseCommand
from userapp.ai_recommendations import AIRecommender
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Train the AI recommendation model'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force training even with minimal data'
        )

    def handle(self, *args, **options):
        self.stdout.write("Training AI recommendation model...")
        
        # Temporarily modify MIN_INTERACTIONS if force flag is set
        original_min = AIRecommender.MIN_INTERACTIONS
        if options['force']:
            AIRecommender.MIN_INTERACTIONS = 1
            self.stdout.write(self.style.WARNING("Forcing training with minimal data"))
        
        try:
            success = AIRecommender.train_model()
            if success:
                self.stdout.write(self.style.SUCCESS("AI model trained successfully!"))
            else:
                self.stdout.write(self.style.WARNING(
                    f"Not enough data to train the model (minimum {original_min} interactions needed)"
                ))
        except Exception as e:
            logger.error(f"Training failed: {str(e)}", exc_info=True)
            self.stdout.write(self.style.ERROR(f"Training failed: {str(e)}"))
        finally:
            # Restore original value
            AIRecommender.MIN_INTERACTIONS = original_min