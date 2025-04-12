"""
Django settings for fitza project.

Generated by 'django-admin startproject' using Django 5.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')


# SECURE_SSL_CERT_PATH = "C:/Users/abhin/OneDrive/Desktop/Fitza_Ecommerce/Django_Backend/fitza/certs/localhost.crt"
# SECURE_SSL_KEY_PATH = "C:/Users/abhin/OneDrive/Desktop/Fitza_Ecommerce/Django_Backend/fitza/certs/localhost.key"


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'userapp',
    'adminapp',
    'sellerapp',
    'common',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_email_verification',
    'social_django',
    'rest_framework_simplejwt.token_blacklist',
    'django_extensions',
]


from datetime import timedelta

from userapp.utils import email_verified_callback

EMAIL_MAIL_CALLBACK = email_verified_callback


# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True


# django-email-verification settings
EMAIL_FROM_ADDRESS = 'noreply@yourdomain.com'
EMAIL_PAGE_DOMAIN = 'https://127.0.0.1:8000/'  # Replace with your domain
EMAIL_MAIL_CALLBACK = email_verified_callback
EMAIL_MAIL_TOKEN_LIFE = timedelta(hours=1).total_seconds()  # Link valid for 1 hour
EMAIL_MAIL_SUBJECT = 'Confirm your email {{ user.username }}'
EMAIL_MAIL_HTML = 'mail_body.html'
EMAIL_MAIL_PLAIN = 'mail_body.txt'
EMAIL_MAIL_PAGE_TEMPLATE = 'email_success_template.html'

EMAIL_MAIL_TOKEN_LIFE = 3600  # Token life in seconds (1 hour)
PASSWORD_RESET_TIMEOUT = 3600


REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}

REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',)

}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Place CORS middleware before SessionMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
#     'corsheaders.middleware.CorsMiddleware',
# ]

# settings.py

SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 3600  # Enable HTTP Strict Transport Security
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True


CSRF_COOKIE_SECURE = True

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

SESSION_COOKIE_AGE = 1209600  # Two weeks, in seconds

SESSION_SAVE_EVERY_REQUEST = True  # Extends session expiry on each request

 # Allow cross-site cookies

CORS_ALLOW_ALL_ORIGINS=True

CORS_ALLOWED_ORIGINS = [
    "https://127.0.0.1:3000",
    "https://localhost:3000",  # Add this if you might access React on localhost
]

CSRF_TRUSTED_ORIGINS = [
    "https://127.0.0.1:3000",
    "https://localhost:3000",  # Add this to trust localhost for CSRF
]

SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = True


CORS_ALLOW_CREDENTIALS = True


AUTH_USER_MODEL = 'common.CustomUser'
SOCIAL_AUTH_USER_MODEL = 'common.CustomUser'

ROOT_URLCONF = 'fitza.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR,'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fitza.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'dbfitza',
        'USER': 'postgres',
        'PASSWORD': 'Kanhangad_123',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),  # Set access token validity (e.g., 1 hour)
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Set refresh token validity (e.g., 7 days)
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')

SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI = 'https://localhost:8000/social/complete/google-oauth2/'

SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['email', 'profile']



#Best One Given below

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'userapp.pipeline.custom_social_user',  
    'social_core.pipeline.user.get_username',
    'userapp.pipeline.save_user_profile',  # Prevents duplicate user creation
    'userapp.pipeline.save_social_auth_details',  # Saves social auth details
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
)



# LOGIN_REDIRECT_URL = 'http://localhost:5173/authredirect'

LOGIN_REDIRECT_URL = '/set-cookie-after-login/'


CORS_ALLOW_CREDENTIALS = True



CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True


CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "x-requested-with",
    "accept",
    "origin",
    "x-csrftoken",
]
