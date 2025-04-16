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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference for Lost and Found
const lostAndFoundRef = ref(db, "lost_and_found");

// Fetch and Display Lost and Found Data
document.addEventListener("DOMContentLoaded", () => {
  const lostAndFoundTableBody = document.getElementById("lostinfoundd"); // ✅ Make sure this is the correct ID in your HTML

  onValue(lostAndFoundRef, (snapshot) => {
    let items = [];

    // Get all stored items and their Firebase keys
    snapshot.forEach((childSnapshot) => {
      items.push(childSnapshot.val());
    });

    // Fill empty spaces with `null` placeholders to maintain a 3x5 structure
    while (items.length < 15) {
      items.push(null);
    }

    // ✅ Render a Fixed 3x5 Table
    lostAndFoundTableBody.innerHTML = ""; // Clear table before updating

    for (let i = 0; i < 5; i++) { // 5 rows
      const row = document.createElement("tr");

      for (let j = 0; j < 3; j++) { // 3 columns
        const index = i * 3 + j;
        const cell = document.createElement("td");
        cell.style.textAlign = "center"; // Center align text

        if (items[index]) {
          cell.textContent = items[index];
        } else {
          cell.textContent = ""; // Empty placeholder
        }

        row.appendChild(cell);
      }

      lostAndFoundTableBody.appendChild(row);
    }
  });
});
