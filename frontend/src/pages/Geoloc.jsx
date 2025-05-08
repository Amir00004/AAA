import { useEffect, useState } from "react";
import L from "leaflet";
import api from "../api";
import "leaflet/dist/leaflet.css";


function Geoloc() {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (!map) {
            const mapContainer = document.getElementById("map");
    
            // Check if Leaflet has already initialized the map
            if (mapContainer && !mapContainer._leaflet_id) {
                const newMap = L.map("map").setView([36.7642, 3.0588], 6);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap contributors",
                }).addTo(newMap);
                setMap(newMap);
            }
        }
    
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map]);
    

    const clearMarkers = () => {
        markers.forEach(marker => marker.remove());
        setMarkers([]);
    };

    const showDoctorOnMap = (lat, lon, name) => {
        if (!map) return;
        clearMarkers();
        const marker = L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${name}</b><br>Closest doctor`).openPopup();
        setMarkers([marker]);
        map.setView([lat, lon], 12);
    };

    const findDoctors = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });

                api.post("/location/receive/", {
                    latitude: latitude,
                    longitude: longitude
                })
                .then(response => {
                    const data = response.data;
                    setDoctors(data.nearby_doctors);
                    if (data.nearby_doctors.length > 0) {
                        const firstDoctor = data.nearby_doctors[0];
                        showDoctorOnMap(firstDoctor.lat, firstDoctor.lon, firstDoctor.name);
                    } else {
                        alert("No doctors found nearby.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Failed to fetch doctors. Please try again later.");
                });
            }, (error) => {
                console.error("Geolocation error:", error);
                alert("Geolocation permission denied or failed.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 mt-10 space-y-6">
  <h1 className="text-4xl font-bold text-center text-blue-600">Find a Doctor Near You</h1>
  
  <div className="flex justify-center">
    <button 
      onClick={findDoctors} 
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-purple-600 transition">
      Find Doctor
    </button>
  </div>
  
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Closest Doctor:</h2>
    <div id="map" className="rounded-xl overflow-hidden border border-gray-200 shadow-md" style={{ height: "400px", width: "100%" }}></div>
  </div>
  
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Top 3 Nearby Doctors:</h2>
    <ul className="space-y-3">
      {doctors.slice(0, 3).map((doctor, index) => (
        <li key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <span className="font-medium text-blue-600">{doctor.name}</span> - <span className="text-gray-600">{doctor.address}</span>
        </li>
      ))}
    </ul>
  </div>
</div>

    );
}

export default Geoloc;
