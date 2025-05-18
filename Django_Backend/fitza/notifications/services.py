from django.utils import timezone
from sellerapp.models import Notification


class NotificationService:
    def __init__(self,user=None, group=None, sender=None):
        self.user=user
        self.group=group
        self.sender=sender
        self.defaults = {
            'type':'info',
            'priority':'medium',
            'expires_in':None
        }

    def send(self,message,**kwargs):

        params = {**self.defaults,**kwargs}

        expires_at = None

        if params['expires_in']:
            expires_at = timezone.now() + timezone.timedelta(hours=params['expires_in'])
        
        return Notification.objects.create(
            user=self.user,
            group=self.group if 'group' not in kwargs else kwargs['group'],
            sender=self.sender,
            message=message,
            type=params['type'],
            priority=params['priority'],
            redirect_url=params.get('redirect_url'),
            expires_at=expires_at
        )
    
    def marks_as_read(self, notification_id=None):
        if notification_id:
            Notification.objects.filter(id=notification_id).update(is_read=True)
        else:
            Notification.objects.filter(user=self.user, is_read=False).update(is_read=True)