from rest_framework_simplejwt.tokens import RefreshToken
from common.models import CustomUser
from django.shortcuts import redirect
from datetime import timedelta
from django.utils.timezone import now


def save_user_profile(backend, user, response, *args, **kwargs):
    if backend.name == 'google-oauth2':
        profile_data = {
            'email': response.get('email', ''),
            'name': response.get('name', 'Unknown User'),
            'picture': response.get('picture', 'user_photos/default.jpg'),
        }

        obj, created = CustomUser.objects.get_or_create(email=profile_data['email'])
        obj.first_name = profile_data['name'].split()[0] if ' ' in profile_data['name'] else profile_data['name']
        obj.last_name = profile_data['name'].split()[-1] if ' ' in profile_data['name'] else ''
        obj.userphoto = profile_data['picture']
        obj.save()

        # Generate tokens
        refresh = RefreshToken.for_user(obj)
        access_token = str(refresh.access_token)
        request = kwargs.get('request')
        if request:
            request.session['token_data'] = {
                "access_token": access_token,
                "refresh_token": str(refresh),
                "user_id": obj.id,
                "email": obj.email,
                "username": obj.username,
            }

    return None  # Let the pipeline continue to redirection



from social_core.exceptions import AuthAlreadyAssociated

from django.urls import reverse

def check_existing_user(backend, uid, user=None, *args, **kwargs):
    """
    Prevent re-associating a social account that's already linked to a user.
    """
    if user:
        return  # User is already authenticated

    social = backend.strategy.storage.user.get_social_auth(backend.name, uid)

    if social and social.user:
        # Handle the already-associated account
        raise AuthAlreadyAssociated(backend)


from social_core.exceptions import AuthAlreadyAssociated
from django.shortcuts import redirect
from django.urls import reverse

def custom_social_user(strategy, backend, uid, user=None, *args, **kwargs):
    try:
        return {'social': backend.strategy.storage.user.get_social_auth(backend.name, uid)}
    except AuthAlreadyAssociated:
        return redirect(reverse('dashboard'))  



from social_django.models import UserSocialAuth
from django.utils.timezone import now

def save_social_auth_details(strategy, details, response, user=None, *args, **kwargs):
    """
    Custom function to save social authentication details in social_auth_usersocialauth.
    Ensures no duplicate entries and updates existing records.
    """
    if user:
        provider = kwargs.get("backend").name
        uid = kwargs.get("uid")
        
        # Check if an entry already exists
        social_auth, created = UserSocialAuth.objects.get_or_create(
            user=user,
            provider=provider,
            uid=uid,
            defaults={
                "extra_data": response,
                "created": now(),
                "modified": now(),
            },
        )

        # If the record already exists, update extra_data & modified timestamp
        if not created:
            social_auth.extra_data = response
            social_auth.modified = now()
            social_auth.save()
