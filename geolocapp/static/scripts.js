let map;  
let markers = []; 

function initMap() {
    if (!map) {
        map = L.map('map').setView([36.7642, 3.0588], 6); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
}

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];  
}

function showDoctorOnMap(lat, lon, name) {
    initMap();  
    clearMarkers();  

    let marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${name}</b><br>Closest doctor`).openPopup();
    markers.push(marker);

    map.setView([lat, lon], 12);  
}

document.getElementById("get-location").addEventListener("click", function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            console.log("User Location:", lat, lon);

            fetch("/location/receive/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude: lat, longitude: lon })
            })
            .then(response => response.json())
            .then(data => {
                let doctorList = document.getElementById("doctor-list");
                doctorList.innerHTML = ""; 

                if (data.nearby_doctors.length > 0) {
                    let firstDoctor = data.nearby_doctors[0]; 

                    showDoctorOnMap(firstDoctor.lat, firstDoctor.lon, firstDoctor.name);

                    data.nearby_doctors.forEach(doctor => {
                        let li = document.createElement("li");
                        li.textContent = `${doctor.name} - ${doctor.address}`;
                        doctorList.appendChild(li);
                    });
                } else {
                    alert("No doctors found nearby.");
                }
            })
            .catch(error => console.error("Error:", error));
        });
    } else {
        console.error("Geolocation not supported.");
    }
});
