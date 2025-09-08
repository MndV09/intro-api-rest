const API_URL = "https://68bb0dd484055bce63f1048f.mockapi.io/api/v1/dispositivos_IoT";

// Referencias al DOM
const recordsTable = document.querySelector("#recordsTable tbody");
const lastStatusBox = document.getElementById("lastStatus");
const lastStatusEl = document.querySelector("#lastStatus span");

// Función para aplicar color según el status
function getStatusClass(status) {
  status = status.toLowerCase();
  if (status.includes("detener")) return "alert-danger";
  if (status.includes("adelante")) return "alert-success";
  if (status.includes("atrás")) return "alert-warning";
  if (status.includes("giro")) return "alert-info";
  return "alert-secondary"; // default
}

// Función para cargar registros
async function loadRecords() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" }); // evita cache
    const data = await res.json();

    // Ordenar por ID descendente
    data.sort((a, b) => Number(b.id) - Number(a.id));

    // Tomar los 10 más recientes
    const lastTen = data.slice(0, 10);
    recordsTable.innerHTML = "";

    lastTen.forEach(record => {
      const row = `
        <tr>
          <td>${record.id}</td>
          <td>${record.name}</td>
          <td>${record.status}</td>
          <td>${record.ip}</td>
          <td>${new Date(record.date).toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}</td>
        </tr>
      `;
      recordsTable.innerHTML += row;
    });

    // Mostrar último status aparte
    if (data.length > 0) {
      const latestStatus = data[0].status;
      lastStatusEl.textContent = latestStatus;

      // Resetear clases de Bootstrap y aplicar según status
      lastStatusBox.className = "alert " + getStatusClass(latestStatus);
    }
  } catch (error) {
    console.error("Error cargando registros:", error);
  }
}

// Polling cada 2 segundos
setInterval(loadRecords, 2000);

// Cargar al inicio
loadRecords();
