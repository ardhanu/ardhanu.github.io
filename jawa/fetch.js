document.addEventListener("DOMContentLoaded", function () {
	// Fetch data when "AMBIL DATA" button is clicked
	document.getElementById("fetchData").addEventListener("click", function () {
			const selectedDataType = document.getElementById("select-table").value;
			fetchDataAndPopulateTable(selectedDataType);
	});

	// Print data when "CETAK DATA" button is clicked
	document.getElementById("cetakData").addEventListener("click", function () {
			const selectedDataType = document.getElementById("select-table").value;
			printData(selectedDataType);
	});
});
function fetchDataAndPopulateTable(dataType, callback) {
    const apiUrl = getApiUrlForDataType(dataType);
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            populateTable(data, dataType);
            // Call the callback after populating the table
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch((error) => console.error("Error:", error));
}


function populateTable(data, dataType) {
    const table = document.createElement("table");
    table.setAttribute("id", "dynamic-table");
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = ""; // Clear previous table
    tableContainer.appendChild(table);

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);

    const headers = getHeadersForDataType(dataType);
    const headerRow = document.createElement("tr");
    headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

data.forEach((item, index) => {
    const row = document.createElement("tr");
    headers.forEach((header) => {
        const td = document.createElement("td");
        // Check if it's "Data Pelanggan" and the header is "No"
        if (dataType === "Data Pelanggan" && header === "No") {
            td.textContent = index + 1; // Use index + 1 for "No"
        } else {
            const key = getKeyFromHeader(header, dataType);
            td.textContent = item[key] === null ? "N/A" : item[key];
        }
        row.appendChild(td);
    });
    tbody.appendChild(row);
});
}

function getApiUrlForDataType(dataType) {
	// Map the dataType to your API endpoints
	const apiUrlMap = {
		"Data Pelanggan": "https://58vpq4m8-3000.asse.devtunnels.ms/pelanggan",
		"Data Kerusakan": "https://58vpq4m8-3000.asse.devtunnels.ms/kerusakan",
		"Data Gejala": "https://58vpq4m8-3000.asse.devtunnels.ms/gejala",
		"Hasil Diagnosa": "https://58vpq4m8-3000.asse.devtunnels.ms/hasil-diagnosa",
		"Detail Diagnosa": "https://58vpq4m8-3000.asse.devtunnels.ms/hasil-diagnosa/detail",
		//http://localhost:3000
	};
	return apiUrlMap[dataType];
}

function getHeadersForDataType(dataType) {
	switch (dataType) {
		case "Data Pelanggan":
			return ["No", "Tanggal Dibuat", "Nama Pelanggan", "Alamat", "No Telepon"];
		case "Data Kerusakan":
			return ["ID Kerusakan", "Nama Kerusakan", "Solusi", "Penjelasan"];
		case "Data Gejala":
			return ["ID Gejala", "Nama Gejala"];
		case "Hasil Diagnosa":
			return ["Tanggal", "Nama Pelanggan", "Kerusakan 1", "Kerusakan 2", "Kerusakan 3"];
		case "Detail Diagnosa":
			return [
				"ID Detail",
				"Nama Pelanggan",
				"Tanggal",
				"Kerusakan 1",
				"Kerusakan 2",
				"Kerusakan 3",
				"Solusi 1",
				"Solusi 2",
				"Solusi 3",
				"Penjelasan 1",
				"Penjelasan 2",
				"Penjelasan 3",
			];
		default:
			return [];
	}
}

function getKeyFromHeader(header, dataType) {
	const mapping = {
		"Data Pelanggan": {
			"No": "id_pelanggan",
			"Tanggal Dibuat": "createdAt",
			"Nama Pelanggan": "nama_pelanggan",
			"Alamat": "alamat",
			"No Telepon": "no_telp",
		},
		"Data Kerusakan": {
			"ID Kerusakan": "id_kerusakan",
			"Nama Kerusakan": "nama_kerusakan",
			"Solusi": "solusi",
			"Penjelasan": "penjelasan",
		},
		"Data Gejala": {
			"ID Gejala": "id_gejala",
			"Nama Gejala": "nama_gejala",
			"ID Kerusakan": "id_kerusakan",
		},
		"Hasil Diagnosa": {
			"Tanggal": "tanggal",
			"Nama Pelanggan": "nama_pelanggan",
			"Kerusakan 1": "kerusakan_1",
			"Kerusakan 2": "kerusakan_2",
			"Kerusakan 3": "kerusakan_3",
		},
		"Detail Diagnosa": {
			"ID Detail": "id_detail",
			"Nama Pelanggan": "nama_pelanggan",
			"Tanggal": "tanggal",
			"Kerusakan 1": "kerusakan_1",
			"Kerusakan 2": "kerusakan_2",
			"Kerusakan 3": "kerusakan_3",
			"Solusi 1": "solusi_1",
			"Solusi 2": "solusi_2",
			"Solusi 3": "solusi_3",
			"Penjelasan 1": "penjelasan_1",
			"Penjelasan 2": "penjelasan_2",
			"Penjelasan 3": "penjelasan_3",
		},
	};

	return mapping[dataType][header];
}

function printData(title) {
    const isAndroid = /Android/.test(navigator.userAgent);
    let divToPrint = document.getElementById("table-container").innerHTML;
    let iframe;

    if (iframe) {
        iframe.parentNode.removeChild(iframe);
    }

    iframe = document.createElement("iframe");
    iframe.style.cssText =
        "width: 1px; height: 1px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0";
    document.body.appendChild(iframe);

    const printContent = () => {
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Print</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                    /* Additional styles */
                </style>
            </head>
            <body>
                ${divToPrint}
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }, 1000);
    };

    if (isAndroid) {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
            newWindow.document.write(divToPrint);
            // You might need to adjust the styles and content for the new window
        }
    } else {
        printContent();
    }
}
