from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .serializers import AvailableSlotSerializer, AppointmentSerializer, UserSerializer, PatientSerializer, DoctorSerializer, UserCreateSerializer, UserUpdateSerializer, AdminUploadScanSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, permissions
from .permissions import IsAdmin, IsDoctor, IsPatient
from .models import CustomUser, Patient, Doctor, AvailableSlot, Appointment, ScanImage
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from keras.models import load_model
from PIL import Image
import numpy as np
import io

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.first_name if user.first_name.strip() else "test"
        token['role'] = user.role 
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if not user.is_active:
            raise print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        print("User Info:", user.first_name, user.last_name, user.email)
        data.update({
            'name': user.get_full_name() if user.get_full_name() else "test",
            'role': user.role,
            'id': user.id,
        })

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] 

    def get_object(self):
        return self.request.user
    
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class AdminUserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    lookup_field = "pk"
    permission_classes = [IsAuthenticated, IsAdmin]
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        email = request.data.get("email", None)

        if email and CustomUser.objects.exclude(id=user.id).filter(email=email).exists():
            return Response({"email": "This email is already taken."}, status=status.HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)

class AdminUserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class AdminUserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class AdminCreateUserView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

class DoctorOnlyView(generics.RetrieveAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_object(self):
        return self.request.user.doctor

class PatientOnlyView(generics.RetrieveAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_object(self):
        return self.request.user.patient_profile
    
class PatientDetailView(generics.RetrieveAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AdminUploadScanView(generics.CreateAPIView):
    serializer_class = AdminUploadScanSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def create(self, request, *args, **kwargs):
        patient_id = self.kwargs.get('patient_id')
        patient = get_object_or_404(Patient, id=patient_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        scan_image = serializer.save(patient=patient)
            
        return Response({"message": "Scan uploaded successfully"}, status=status.HTTP_201_CREATED)

class AvailableSlotCreateView(generics.CreateAPIView):
    queryset = AvailableSlot.objects.all()
    serializer_class = AvailableSlotSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class AvailableSlotListView(generics.ListAPIView):
    serializer_class = AvailableSlotSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_queryset(self):
        return AvailableSlot.objects.filter(is_booked=False).order_by("date", "start_time")

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def create(self, request, *args, **kwargs):
        slot_id = request.data.get("slot")
        if not slot_id:
            return Response({"error": "Slot ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            slot = AvailableSlot.objects.get(id=slot_id, is_booked=False)
        except AvailableSlot.DoesNotExist:
            return Response({"error": "Slot not available."}, status=status.HTTP_404_NOT_FOUND)

        slot.is_booked = True
        slot.save()

        appointment = Appointment.objects.create(
            patient=request.user,
            slot=slot,
            reason=request.data.get("reason", "")
        )
        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DoctorAllSlotsView(generics.ListAPIView):
    serializer_class = AvailableSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != 'doctor':
            return AvailableSlot.objects.none()  
        return AvailableSlot.objects.filter(doctor=user).order_by("date", "start_time")
    
class PatientAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)
    
class PredictView(APIView):
    parser_classes = [MultiPartParser]
    model = load_model('users/models/prrr.keras')

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('scan')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image = Image.open(file).convert('L')
            image = image.resize((224, 224)) 
            img_array = np.array(image) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            prediction = self.model.predict(img_array)
            result = prediction.tolist() 
            print(request)
            print("Prediction result:", result)
            normal = result[0][1]
            lungop = result[0][0]
            pneumonia = result[0][2]
            return Response({
                'normal': normal,
                'lungop' : lungop,
                'pneumonia' : pneumonia,
            })
        except Exception as e:
            print("Prediction error:", e)
            return Response({'error': 'Prediction failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)