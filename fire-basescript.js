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
  const numbersTableBody = document.getElementById("numbersTableBody");

  // ✅ Add Number to Firebase Realtime Database
  addButton.addEventListener("click", () => {
    const number = numberInput.value.trim();
    if (number) {
      const newNumberRef = push(numbersRef); // Generate unique ID
      set(newNumberRef, number) // Store number in Firebase
        .then(() => {
          console.log("Number added successfully!");
          numberInput.value = ""; // Clear input after adding
        })
        .catch((error) => console.error("Error adding number:", error));
    } else {
      alert("Please enter a valid number.");
    }
  });

  // ✅ Listen for Realtime Updates & Display Each Number in a New Row
  onValue(numbersRef, (snapshot) => {
    numbersTableBody.innerHTML = ""; // Clear table before updating

    snapshot.forEach((childSnapshot) => {
      const numberValue = childSnapshot.val();
      const numberKey = childSnapshot.key; // Unique Firebase key

      // ✅ Create Table Row (One Number per Row)
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${numberValue}</td>
        <td><button class="delete-btn btn btn-sm" data-id="${numberKey}" style="background-color: red; color: white;">Delete</button></td>
      `;
      numbersTableBody.appendChild(row);
    });

    // ✅ Attach Delete Event Listeners
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const numberId = event.target.getAttribute("data-id");
        remove(ref(db, `numbers/${numberId}`)) // ✅ Delete from Firebase
          .then(() => console.log("Number deleted successfully!"))
          .catch((error) => console.error("Error deleting number:", error));
      });
    });
  });
});
