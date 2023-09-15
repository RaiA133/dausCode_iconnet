
function fetchData(region){
    // GOOGLE API Spread Sheets
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/17JHm_VIMaJG3D_JADeCYWFTxRUiKe7LTTTXCZjAlhmU/values/${region}?key=AIzaSyCwOuZAm8MkSet-tEv7sYCrkFUx8HSsAnk`;

// PROSES FETCH //
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("data-table-body");
        const tableHeader = document.querySelector(".table thead tr");

        // mengulang data hasil fetch 
        data.values.forEach((row, index) => {
            if (index === 0) {
                // header tabel berdasarkan index = 0 di JSON atau baris 1 di spreadsheet 
                row.forEach((headerText, headerIndex) => {
                    const newHeader = document.createElement("th");
                    newHeader.textContent = headerText;
                    tableHeader.appendChild(newHeader);
                });
            } else {
                // membuat perulangan isi tabel tabel (baris 2-end) atau index selain 0
                const newRow = document.createElement("tr");
                row.forEach((cellText, cellIndex) => {
                    const newCell = document.createElement(index === 1 && cellIndex === 0 ? "th" : "td");
                    newCell.textContent = cellText;
                    newRow.appendChild(newCell);
                });
                tableBody.appendChild(newRow);
            }
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
