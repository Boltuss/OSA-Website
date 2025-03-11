// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Firebase Configuration
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
const numbersRef = ref(db, "numbers"); // Reference to "numbers" in Firebase

document.addEventListener("DOMContentLoaded", () => {
  const numberInput = document.getElementById("numberInput");
  const addButton = document.getElementById("addButton");
  const numbersTableBody = document.getElementById("numberTable");
  const errorContainer = document.getElementById("errorContainer"); // ✅ Error message container

  // ✅ Function to display error message
  function showError(message) {
    errorContainer.textContent = message;
  }

  // ✅ Add Number to Firebase (Prevent Duplicates)
  addButton.addEventListener("click", () => {
    errorContainer.textContent = ""; // Clear previous error

    const number = numberInput.value.trim();
    if (!number) {
      showError("Please enter a valid number.");
      return;
    }

    // Check if the number already exists before adding
    onValue(numbersRef, (snapshot) => {
      let numberExists = false;

      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().toString() === number) {
          numberExists = true;
        }
      });

      if (numberExists) {
        showError("This number already exists. Please enter a unique number.");
      } else {
        const newNumberRef = push(numbersRef); // Generate unique ID
        set(newNumberRef, number) // Store number in Firebase
          .then(() => {
            console.log("Number added successfully!");
            numberInput.value = ""; // Clear input after adding
          })
          .catch((error) => showError("Error adding number: " + error.message));
      }
    }, { onlyOnce: true }); // Ensures the function runs only once
  });

  // ✅ Listen for Realtime Updates & Display a Fixed 5x7 Table
  onValue(numbersRef, (snapshot) => {
    let numbers = [];

    // Get all stored numbers and their Firebase keys
    snapshot.forEach((childSnapshot) => {
      numbers.push({ key: childSnapshot.key, value: childSnapshot.val() });
    });

    // Sort numbers based on order of entry
    numbers.sort((a, b) => a.value - b.value);

    // Fill empty spaces with `null` placeholders to maintain a 5x7 structure
    while (numbers.length < 35) {
      numbers.push(null);
    }

    // ✅ Render a Fixed 5x7 Table
    numbersTableBody.innerHTML = ""; // Clear table before updating

    for (let i = 0; i < 7; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        const cell = document.createElement("td");

        if (numbers[index]) {
          cell.innerHTML = `
            ${numbers[index].value}
            <button class="delete-btn btn btn-sm btn-danger" data-id="${numbers[index].key}">
              <i class="bi bi-trash"></i>
            </button>
          `;
        } else {
          cell.textContent = "-"; // Empty placeholder
        }

        row.appendChild(cell);
      }

      numbersTableBody.appendChild(row);
    }

    // ✅ Attach Delete Event Listeners
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const numberId = event.target.getAttribute("data-id");
        remove(ref(db, `numbers/${numberId}`)) // ✅ Delete from Firebase
          .then(() => console.log("Number deleted successfully!"))
          .catch((error) => showError("Error deleting number: " + error.message));
      });
    });
  });
});
