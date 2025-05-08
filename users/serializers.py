from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Patient, Doctor, CustomUser, AvailableSlot, Appointment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role  # Add role to the token
        token["name"] = user.get_full_name() 
        return token
    

class NullableIntegerField(serializers.IntegerField):
    def to_internal_value(self, data):
        if data == "":  # Convert empty string to None
            return None
        return super().to_internal_value(data)
    
class UserCreateSerializer(serializers.ModelSerializer):
    gender = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    medical_history = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)

    # Optional fields for doctors
    specialization = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    experience_years = NullableIntegerField(required=False, allow_null=True, default=None)
    license_number = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)

    class Meta:
        model = CustomUser
        fields = [
            "email", "password", "first_name", "last_name", "date_of_birth", 
            "address", "phone_number", "role", "gender", "medical_history", 
            "specialization", "experience_years", "license_number", "bio"
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        role = validated_data.get("role")

        # Extract fields that belong to related models
        gender = validated_data.pop("gender", None)
        medical_history = validated_data.pop("medical_history", None)

        specialization = validated_data.pop("specialization", None)
        experience_years = validated_data.pop("experience_years", None)
        license_number = validated_data.pop("license_number", None)
        bio = validated_data.pop("bio", None)

        user = CustomUser.objects.create_user(**validated_data)

        if role == "patient":
            Patient.objects.create(user=user, gender=gender, medical_history=medical_history)
        elif role == "doctor":
            Doctor.objects.create(
                user=user,
                specialization=specialization,
                experience_years=experience_years,
                license_number=license_number,
                bio=bio
            )

        return user
    
class UserUpdateSerializer(serializers.ModelSerializer):
    gender = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    medical_history = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)

    specialization = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    experience_years = NullableIntegerField(required=False, allow_null=True, default=None)
    license_number = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)

    class Meta:
        model = CustomUser
        fields = [
            "email", "first_name", "last_name", "date_of_birth", 
            "address", "phone_number", "role", "gender", "medical_history", 
            "specialization", "experience_years", "license_number", "bio"
        ]
        extra_kwargs = {
            "email": {"read_only": True},  
            "role": {"read_only": True} 
        }

    def update(self, instance, validated_data):
        role = instance.role  # Keep the original role

        # Update base user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related models based on role
        if role == "patient":
            patient, _ = Patient.objects.get_or_create(user=instance)
            patient.gender = validated_data.get("gender", patient.gender)
            patient.medical_history = validated_data.get("medical_history", patient.medical_history)
            patient.save()

        elif role == "doctor":
            doctor, _ = Doctor.objects.get_or_create(user=instance)
            doctor.specialization = validated_data.get("specialization", doctor.specialization)
            doctor.experience_years = validated_data.get("experience_years", doctor.experience_years)
            doctor.license_number = validated_data.get("license_number", doctor.license_number)
            doctor.bio = validated_data.get("bio", doctor.bio)
            doctor.save()

        return instance

class PatientSerializer(serializers.ModelSerializer):
    scan_image = serializers.SerializerMethodField()
    class Meta:
        model = Patient
        fields = ["id", "gender", "medical_history", "scan_image"]

    def get_scan_image(self, obj):
        request = self.context.get("request")
        if obj.scan_image and hasattr(obj.scan_image, 'url'):
            return request.build_absolute_uri(obj.scan_image.url)
        return None

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["specialization", "experience_years", "license_number", "bio"]

class AdminUploadScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["scan_image"]

class UserSerializer(serializers.ModelSerializer):
    patient = serializers.SerializerMethodField()
    doctor = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id", "email", "first_name", "last_name", "date_of_birth",
            "address", "phone_number", "role", "patient", "doctor"
        ]

    def get_patient(self, obj):
        if hasattr(obj, "patient_profile"):
            return {
                "id": obj.patient_profile.id,
                "gender": obj.patient_profile.gender,
                "medical_history": obj.patient_profile.medical_history,
                "scan_image": obj.patient_profile.scan_image.url if obj.patient_profile.scan_image else None,
            }
        return None

    def get_doctor(self, obj):
        if hasattr(obj, "doctor_profile"): 
            return {
                "specialization": obj.doctor_profile.specialization,
                "experience_years": obj.doctor_profile.experience_years,
                "license_number": obj.doctor_profile.license_number,
                "bio": obj.doctor_profile.bio,
            }
        return None

class AvailableSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)

    class Meta:
        model = AvailableSlot
        fields = ['id', 'doctor', 'doctor_name', 'date', 'start_time', 'end_time', 'is_booked']
        read_only_fields = ['is_booked']


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_first_name = serializers.CharField(source='slot.doctor.first_name', read_only=True)  
    doctor_last_name = serializers.CharField(source='slot.doctor.last_name', read_only=True)
    appointment_date = serializers.DateField(source='slot.date', read_only=True)  # Fetch appointment date
    appointment_time = serializers.TimeField(source='slot.start_time', read_only=True)  # Fetch appointment time

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'slot', 'reason', 'created_at', 'doctor_first_name','doctor_last_name', 'appointment_date', 'appointment_time']
        read_only_fields = ['created_at']