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
const numbersRef = ref(db, "numbers");

document.addEventListener("DOMContentLoaded", () => {
  const numbersTableBody = document.getElementById("numberTable");

  onValue(numbersRef, (snapshot) => {
    let numbers = [];

    snapshot.forEach((childSnapshot) => {
      numbers.push(childSnapshot.val());
    });

    // Sort numbers
    numbers.sort((a, b) => a - b);

    // Fill empty spaces for a 10x3 table (30 slots)
    while (numbers.length < 30) {
      numbers.push(null);
    }

    // Render a 10x3 table
    numbersTableBody.innerHTML = ""; // Clear existing table

    for (let i = 0; i < 10; i++) { // 10 rows
      const row = document.createElement("tr");

      for (let j = 0; j < 3; j++) { // 3 columns
        const index = i * 3 + j;
        const cell = document.createElement("td");
        cell.style.textAlign = "center";

        if (numbers[index]) {
          cell.textContent = numbers[index];
        } else {
          cell.textContent = "";
        }

        row.appendChild(cell);
      }

      numbersTableBody.appendChild(row);
    }
  });
});
