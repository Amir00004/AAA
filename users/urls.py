from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    RegisterView, AdminOnlyView, DoctorOnlyView, AdminUploadScanView,
      PatientOnlyView, PatientDetailView,
      DoctorListCreateView, DoctorDetailView,
      PredictView,
      AdminUserListView, AdminUserUpdateView, AdminUserDeleteView, AdminUserDetailView, AdminCreateUserView,
      AvailableSlotCreateView, AvailableSlotListView, AppointmentCreateView, DoctorAllSlotsView, PatientAppointmentListView
      )

urlpatterns = [
    # path('register/', RegisterView.as_view(), name='register'),
    # path('login/', LoginView.as_view(), name='login'),
    path("admin/patients/<int:pk>/upload-scan/", AdminUploadScanView.as_view(), name="admin-upload-scan"),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('doctor-only/', DoctorOnlyView.as_view(), name='doctor-only'),
    path('patient-only/', PatientOnlyView.as_view(), name='patient-only'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path("doctors/", DoctorListCreateView.as_view(), name="doctor-list"),
    path("doctors/<int:pk>/", DoctorDetailView.as_view(), name="doctor-detail"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/users/<int:pk>/update/", AdminUserUpdateView.as_view(), name="admin-user-update"),
    path("admin/users/<int:pk>/delete/", AdminUserDeleteView.as_view(), name="admin-user-delete"),
    path("admin/create-user/", AdminCreateUserView.as_view(), name="admin-create-user"),
    path('slots/create/', AvailableSlotCreateView.as_view(), name='create-slot'),
    path('slots/', AvailableSlotListView.as_view(), name='list-slots'),
    path('appointments/', AppointmentCreateView.as_view(), name='create-appointment'),
    path('slots/all/', DoctorAllSlotsView.as_view(), name='doctor-slots'),
    path("patient/appointments/", PatientAppointmentListView.as_view(), name="patient-appointments"),
    path('predict/', PredictView.as_view(), name='predict'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)