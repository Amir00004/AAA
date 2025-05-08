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
        <div>
            <h1>Find a Doctor Near You</h1>
            <button onClick={findDoctors}>Find Doctor</button>
            <h2>Closest Doctor:</h2>
            <div id="map" style={{ height: "400px", width: "100%" }}></div>
            <h2>Top 3 Nearby Doctors:</h2>
            <ul>
                {doctors.slice(0, 3).map((doctor, index) => (
                    <li key={index}>{doctor.name} - {doctor.address}</li>
                ))}
            </ul>
        </div>
    );
}

export default Geoloc;
