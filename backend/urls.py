from django.contrib import admin
from django.urls import path, include
from users.views import RegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/users/register/', RegisterView.as_view(), name='register'),
    path("api/token", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("location/", include("geolocapp.urls")),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
