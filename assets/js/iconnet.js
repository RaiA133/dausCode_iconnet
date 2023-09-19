
function fetchData(region){
    // GOOGLE API Spread Sheets //
    // const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/17JHm_VIMaJG3D_JADeCYWFTxRUiKe7LTTTXCZjAlhmU/values/${region}?key=AIzaSyCwOuZAm8MkSet-tEv7sYCrkFUx8HSsAnk`;

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/17JHm_VIMaJG3D_JADeCYWFTxRUiKe7LTTTXCZjAlhmU/values/${region}!A1:AA20?key=AIzaSyCwOuZAm8MkSet-tEv7sYCrkFUx8HSsAnk&majorDimension=ROWS`;

// PROSES FETCH //
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const detailList = document.querySelector(".detail");

        // Mengambil header dari data (baris pertama)
        const headerRow = data.values[0];

        // Mengambil data dari baris kedua (index 1)
        const dataRow = data.values[1];

        // Mengisi elemen .detail dengan header dan data secara vertikal
        headerRow.forEach((headerText, headerIndex) => {
            const listItem = document.createElement("li");
            listItem.textContent = headerText + " : ";
            listItem.className = "list-group-item fw-bold";
            
            
            const dataValue = document.createElement("span");
            dataValue.className = "fw-normal";
            dataValue.textContent = dataRow[headerIndex];
            listItem.appendChild(dataValue);

            detailList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}   
// end PROSES FETCH //


// GANTI REGION //
const regionSelect = document.getElementById("regionSelect");
regionSelect.addEventListener("change", function () {
    const selectedRegion = this.value;
    fetchData(selectedRegion);

    // menghapus data sebelumnya ketika ganti region, jadi tidak perlu reload
    const tableBody = document.getElementById("data-table-body");
    const tableHeader = document.querySelector(".table thead tr");
    tableBody.innerHTML = "";
    tableHeader.innerHTML = "";
});

// inisialisasi data default, agar tidak kosong ketika reload
fetchData(regionSelect.value);
// end GANTI REGION //



// FUNGSI SERCING DATA //
function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const tableBody = document.getElementById("data-table-body");
    const tableRows = tableBody.querySelectorAll("tr");

    tableRows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.toLowerCase());

        if (rowData.some(cellText => cellText.includes(searchInput))) {
            row.style.display = ""; // menampilkan baris yang sesuai dengan data
        } else {
            row.style.display = "none"; // menghilangkan baris yang tidak sesuai dengan data
        }
    });
}
// Search Button
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", performSearch);

// end FUNGSI SERCING DATA //
