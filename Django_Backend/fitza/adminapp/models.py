from django.db import models

# Create your models here.

from common.models import CustomUser


#Admin 

class AdminProfile(models.Model):
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='admin_profile')
    department=models.CharField(max_length=255,blank=True,null=True)
    permissions=models.JSONField(default=dict)
    joining_date=models.DateField(auto_now_add=True)
    profile_image=models.ImageField(upload_to='admin_profile/',blank=True,null=True)

    def __str__(self):
        return f"Admin Profile - {self.user.username}"


class Complaint(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=255, help_text="Brief title for the complaint")
    description = models.TextField(help_text="Detailed description of the complaint")
    response = models.TextField(null=True, blank=True, help_text="Admin's reply to the complaint")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved = models.BooleanField(default=False, help_text="Has the complaint been resolved?")

    def __str__(self):
        return f"Complaint by {self.seller.username} - {self.title[:30]}"



from django.db import models
from django.conf import settings

class ComplaintMessage(models.Model):
    complaint = models.ForeignKey(
        'Complaint',  # Reference the existing Complaint model
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        CustomUser,  # Directly reference the CustomUser model
        on_delete=models.CASCADE,
        help_text="The user who sent the message (seller or admin)"
    )
    message = models.TextField(help_text="The content of the message")
    timestamp = models.DateTimeField(auto_now_add=True, help_text="When the message was sent")

    def __str__(self):
        return f"Message by {self.sender.username} on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"



