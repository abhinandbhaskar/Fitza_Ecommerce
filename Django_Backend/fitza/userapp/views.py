from rest_framework.views import APIView
from .serializers import PasswordSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer,ProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django_email_verification import send_email
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
# Create your views here.


#register function
class RegisterAPI(APIView):
    def post(self,request):
        _data=request.data
        serializer=RegisterSerializer(data=_data)
        if not serializer.is_valid():
            return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message":"Registration Successful! Please verify your email."},status=status.HTTP_201_CREATED)


#login related function
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer 

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        
        response.set_cookie(
            key="refresh_token",
            value=serializer.validated_data["refresh"],
            httponly=True,
            secure=False,  # Set to True in production
            samesite="None",
            path="/",
            max_age=60 * 60 * 24 * 7
        )

        response.data.pop("refresh", None)

        return response



from rest_framework_simplejwt.tokens import RefreshToken, TokenError

class CookieTokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        print("BOOOO",refresh_token)

        if refresh_token is None:
            return Response({"detail": "Refresh token missing in cookie."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)

        except TokenError as e:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


#profile related function
class ProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        serializer=ProfileSerializer(user)
        return Response(serializer.data)


from django.http import JsonResponse

#in the case of google authentication handle redirect page will call this

def get_tokens(request):
    access_token = request.COOKIES.get('access_token')
    refresh_token = request.COOKIES.get('refresh_token')
    user_id = request.COOKIES.get('user_id')

    if not access_token or not refresh_token:
        return JsonResponse({'error': 'Token not found in cookies'}, status=401)

    return JsonResponse({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_id':user_id,
    })



from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def clear_session(request):
    if request.method == 'POST':
        request.session.flush()
        return JsonResponse({'message': 'Session cleared successfully!'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)


from social_core.exceptions import AuthAlreadyAssociated
from django.urls import reverse
from social_django.views import do_complete

def custom_complete_view(request, *args, **kwargs):
    try:
        return do_complete(request.backend, *args, **kwargs)
    except AuthAlreadyAssociated:
        return redirect(reverse('/'))  # Replace 'dashboard' with your target page

def custom_login_view(request):
    return redirect('http://localhost:5173/authredirect')  # Redirects to React frontend


# SOCIAL aUTH USING THIS LINK https://www.horilla.com/blogs/how-to-implement-social-login-in-django/


#User Logout function
class UserLogout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=200)
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")

        return response


from django.http import HttpResponseRedirect

#google authentication time after pipe line save_userprofile then call this 

def oauth_redirect_handler(request):
    token_data = request.session.pop('token_data', None)  
    print("DADA",token_data)

    response = HttpResponseRedirect("http://localhost:5173/authredirect")

    if token_data:
        response.set_cookie(
            key="access_token",
            value=token_data['access_token'],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=3600,
        )
        response.set_cookie(
            key="refresh_token",
            value=token_data['refresh_token'],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=86400,
        )
        response.set_cookie(
            key="user_id",
            value=token_data['user_id'],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=86400,     
        )

    return response



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import PasswordSerializer


class PasswordChange(APIView):
    # IsAuthenticated handles token validation before entering the method.
    permission_classes=[IsAuthenticated]
    # self : Refers to the class instance
    # request: Carries the data from the frontend.  
    def post(self,request):
        serializer=PasswordSerializer(data=request.data,context={'request':request})
        # data=request.data: This is the JSON body you sent from React — currentPassword, newPassword, confirmpassword
        # context={'request': request}: You're passing the full request object as extra context, so that the serializer can access request.user.
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Password changed successfully"},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)