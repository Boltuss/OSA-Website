import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEf9If3R9r8F_JSXaxmtx0liqrMIODebo",
  authDomain: "office-of-student-affairs.firebaseapp.com",
  databaseURL: "https://office-of-student-affairs-default-rtdb.firebaseio.com/",
  projectId: "office-of-student-affairs",
  storageBucket: "office-of-student-affairs.appspot.com",
  messagingSenderId: "807502412285",
  appId: "1:807502412285:web:9dd217701e71750249c194",
  measurementId: "G-BZ02GD7C2Y"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const foundRef = ref(db, "found_items");
const lostRef = ref(db, "lost_items");

function renderTable(tableBodyId, dataObj) {
  const tableBody = document.getElementById(tableBodyId);
  if (!tableBody) {
    console.error(`Table body with id '${tableBodyId}' not found`);
    return;
  }

  tableBody.innerHTML = "";

  const items = dataObj ? Object.values(dataObj) : [];

  // Fill array up to 15 items (3 columns * 5 rows)
  while (items.length < 15) {
    items.push("");
  }

  for (let row = 0; row < 5; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 3; col++) {
      const td = document.createElement("td");
      td.textContent = items[row * 3 + col];
      td.style.textAlign = "center";
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  onValue(foundRef, (snapshot) => {
    renderTable("found", snapshot.val());
  }, (error) => {
    console.error("Error fetching found items:", error);
  });

  onValue(lostRef, (snapshot) => {
    renderTable("lost", snapshot.val());
  }, (error) => {
    console.error("Error fetching lost items:", error);
  });
});
