from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import math


@csrf_exempt
def receive_location(request):
    if request.method == "POST":
        data = json.loads(request.body)
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        doctors = find_nearby_doctors(latitude, longitude)

        return JsonResponse({"nearby_doctors": doctors})

    return JsonResponse({"error": "Invalid request"}, status=400)


def find_nearby_doctors(lat, lon):
    doctors = [
    {"name": "Dr. Amina Bensalah", "address": "Rue Didouche Mourad, Algiers","link": "url", "lat": 36.7642, "lon": 3.0588},
    {"name": "Dr. Khaled Touati", "address": "Avenue de l'ALN, Oran", "lat": 35.6977, "lon": -0.6331},
    {"name": "Dr. Samir Haddad", "address": "Boulevard Emir Abdelkader, Constantine", "lat": 36.3650, "lon": 6.6147},
    {"name": "Dr. Nadia Cherif", "address": "Cité 5 Juillet, Annaba", "lat": 36.9008, "lon": 7.7662},
    {"name": "Dr. Mohamed Benyahia", "address": "Place 1er Novembre, Blida", "lat": 36.4802, "lon": 2.8290},
    {"name": "Dr. Yacine Zitouni", "address": "Boulevard Houari Boumediene, Tizi Ouzou", "lat": 36.7118, "lon": 4.0459},
    {"name": "Dr. Fatiha Mansouri", "address": "Avenue de l'Indépendance, Sétif", "lat": 36.1969, "lon": 5.4151},
    {"name": "Dr. Rachid Belkacem", "address": "Cité Sidi Djillali, Tlemcen", "lat": 34.8783, "lon": -1.3151},
    {"name": "Dr. Leila Medjani", "address": "Centre-Ville, Béjaïa", "lat": 36.7509, "lon": 5.0566},
    {"name": "Dr. Nabil Larbi", "address": "Route de Laghouat, Djelfa", "lat": 34.6746, "lon": 3.2521}
    ]
    doctors = sorted(doctors, key=lambda x: math.sqrt((x["lat"] - lat)**2 + (x["lon"] - lon)**2))[:5]
    return doctors
