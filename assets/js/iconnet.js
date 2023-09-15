
function clearTableData() {
    const tableBody = document.getElementById("data-table-body");
    const tableHeader = document.querySelector(".table thead tr");
    tableBody.innerHTML = "";
    tableHeader.innerHTML = "";
}

// URL Google Sheets API
function fetchData(region){
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/17JHm_VIMaJG3D_JADeCYWFTxRUiKe7LTTTXCZjAlhmU/values/${region}?key=AIzaSyCwOuZAm8MkSet-tEv7sYCrkFUx8HSsAnk`;

// Fetch data from Google Sheets API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("data-table-body");
        const tableHeader = document.querySelector(".table thead tr");

        // Loop through the data and populate the table
        data.values.forEach((row, index) => {
            if (index === 0) {
                // Create table headers from the first row of data
                row.forEach((headerText, headerIndex) => {
                    const newHeader = document.createElement("th");
                    newHeader.textContent = headerText;
                    tableHeader.appendChild(newHeader);
                });
            } else {
                // Create a new row in the table
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

// Add event listener to select element
const regionSelect = document.getElementById("regionSelect");
regionSelect.addEventListener("change", function () {
    const selectedRegion = this.value;
    fetchData(selectedRegion);
    const tableBody = document.getElementById("data-table-body");
    const tableHeader = document.querySelector(".table thead tr");
    tableBody.innerHTML = "";
    tableHeader.innerHTML = "";
});

// Initialize with default selection
fetchData(regionSelect.value);