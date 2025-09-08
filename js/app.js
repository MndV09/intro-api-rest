const API_URL = "https://68bb0dd484055bce63f1048f.mockapi.io/api/v1/dispositivos_IoT";

// Referencias al DOM
const form = document.getElementById("statusForm");
const recordsTable = document.querySelector("#recordsTable tbody");
const lastStatusEl = document.querySelector("#lastStatus span");

// Obtener IP pública del cliente
async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "0.0.0.0";
  }
}

// Cargar últimos 5 registros
async function loadRecords() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Ordenar manualmente por ID descendente
  data.sort((a, b) => Number(b.id) - Number(a.id));

  // Tomar los 5 más recientes
  const lastFive = data.slice(0, 5);
  recordsTable.innerHTML = "";

  lastFive.forEach(record => {
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

  if (data.length > 0) {
    lastStatusEl.textContent = data[0].status; // el registro con mayor ID
  }
}

// Enviar nuevo registro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const status = document.getElementById("status").value;
  const ip = await getPublicIP();

  const newRecord = {
    name,
    status,
    ip,
    date: new Date().toISOString() // guardamos en ISO por consistencia
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecord)
  });

  form.reset();
  loadRecords();
});

// Inicializar
loadRecords();
