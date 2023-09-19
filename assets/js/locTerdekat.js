// Database JSON (sampel diambil dari data spreadsheets)

let kota;

// API NAMA KOTA DAN KOOR

const koorPelangganAPI = "https://sheets.googleapis.com/v4/spreadsheets/17JHm_VIMaJG3D_JADeCYWFTxRUiKe7LTTTXCZjAlhmU/values/PELANGGAN!C2:E7?key=AIzaSyCwOuZAm8MkSet-tEv7sYCrkFUx8HSsAnk&majorDimension=ROWS";

// Fetch data from the API tapi data yg diambil hanya nama dan koor yg dijadikan key dan value
fetch(koorPelangganAPI)
    .then(response => response.json())
    .then(data => {
        // Process the data and create the 'kota' object
        kota = {};

        // Skip the first row (header) and iterate through the rest of the data
        for (let i = 0; i < data.values.length; i++) {
            const [nama, kotaTujuan, koordinat] = data.values[i];
            kota[nama] = koordinat;
        }

        // Now 'kota' contains the desired data
        console.log(kota);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });


// rumus hitung haversine = perhitungan jarak
function rumus_haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius bumi dalam kilometer 
    const rlat1 = lat1 * (Math.PI/180); // Mengubah derajat ke radian
    const rlat2 = lat2 * (Math.PI/180); // Mengubah derajat ke radian
    const difflat = rlat2 - rlat1; // Perbedaan radian (latitudes)
    const difflon = (lon2 - lon1) * (Math.PI/180); // Perbedaan radian (longitudes)
    
    // rumus
    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2) * Math.sin(difflat/2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon/2) * Math.sin(difflon/2)));
    return d;
}



// insert lokasi koordinat otomatis
const button = document.getElementById("getLocation");
button.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;    // latitude dan longitude USER 
        userLatitude = latitude;
        userLongitude = longitude;
        proses(userLatitude, userLongitude);
    });
});
// insert lokasi koordinat manual
const buttonManual = document.getElementById("manualLocBtn");
buttonManual.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(position => {
        let manualLoc = document.getElementById("manualLocInput").value;
        const [userLatitude, userLongitude] = manualLoc.split(',').map(parseFloat);
        proses(userLatitude, userLongitude);
    });
});



function proses(latitude, longitude) {
    const results = [];                                 // array penampung untuk DOM       

    // API CEK ALAMAT
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    fetch(url).then(res => res.json()).then(data => {
        let alamat = data.display_name;
        // console.table(data);
        document.getElementById("view-hasil").innerHTML = "<b>Titik Koordinatmu : </b>" + latitude +", " + longitude + "<br>" + "<b>Alamat Anda : </b>" + alamat;

        // Call initMap with the retrieved latitude and longitude
        initMap(latitude, longitude);
    })

    // parsing data / perularang data JSON diatas
    for (let key in kota) {
        if (kota.hasOwnProperty(key)) {
            const nilai = kota[key];
            const [latTujuan, lonTujuan] = nilai.split(',').map(parseFloat);
            const distance = rumus_haversine(latitude, longitude, latTujuan, lonTujuan);
            // console.log(`Jarak dari lokasi Anda ke ${key}: ${distance.toFixed(2)} km`);
            results.push({ nama: key, jarak: distance });
        }
    }
    // Mengurutkan hasil berdasarkan jarak dari terdekat ke terjauh
    results.sort((a, b) => a.jarak - b.jarak);

    // Menampilkan hasil ke dalam DOM HTML
    const no = results.map((result, index) => {
        return `<p>${index + 1}</p>`;
    }).join('');
    const alamatTujuan = results.map((result, index) => {
        return `<p>${result.nama}</p>`;
    }).join('');
    const jarakTujuan = results.map((result, index) => {
        return `<p>${result.jarak.toFixed(2)} km</p>`;
    }).join('');

    document.getElementById("noTabel").innerHTML = no;
    document.getElementById("alamatTujuanTabel").innerHTML = alamatTujuan;
    document.getElementById("jarakTujuanTabel").innerHTML = jarakTujuan;
}



var map;
function initMap(userLatitude, userLongitude) {
    // The map, centered on user's location
    const center = { lat: userLatitude, lng: userLongitude };
    const options = { zoom: 11, scaleControl: true, center: center };
    const map = new google.maps.Map(document.getElementById('map'), options);
    
    // mengulang data marker di maps
    for (let key in kota) {
        if (kota.hasOwnProperty(key)) {
            const nilai = kota[key];
            const [latTujuan, lonTujuan] = nilai.split(',').map(parseFloat);
            const distance = rumus_haversine(userLatitude, userLongitude, latTujuan, lonTujuan);

            // The markers for the user's location and the destination
            var mk1 = new google.maps.Marker({ position: center, map: map });
            var mk2 = new google.maps.Marker({ position: { lat: latTujuan, lng: lonTujuan }, map: map });

            // Draw a line showing the straight distance between the markers
            var line = new google.maps.Polyline({ path: [center, { lat: latTujuan, lng: lonTujuan }], map: map });
        }
    }
}
