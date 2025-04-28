// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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

// Get Firebase Auth instance
const auth = getAuth();

// Logout functionality
document.getElementById("logoutButton").addEventListener("click", () => {
  signOut(auth).then(() => {
    // Successfully signed out
    console.log("User signed out.");
    // Clear session to redirect to login
    sessionStorage.setItem("isAuthenticated", "false");
    // Redirect to login page
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
});

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
  numberInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addButton.click(); // Simulate clicking the Add button when Enter is pressed
    }
  });

  // Add click event listener for the Add button
  addButton.addEventListener("click", () => {
    errorContainer.textContent = ""; // Clear previous error

    const number = numberInput.value.trim();
    if (!number) {
      showError("Please enter a value.");
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

  // ✅ Listen for Realtime Updates & Display a Fixed 5x3 Table
  onValue(numbersRef, (snapshot) => {
    let numbers = [];

    // Get all stored numbers and their Firebase keys
    snapshot.forEach((childSnapshot) => {
      numbers.push({ key: childSnapshot.key, value: childSnapshot.val() });
    });

    // Sort numbers based on order of entry
    numbers.sort((a, b) => a.value - b.value);

    // Fill empty spaces with `null` placeholders to maintain a 5x3 structure (15 slots)
    while (numbers.length < 15) {
      numbers.push(null);
    }

    // ✅ Render a Fixed 5x3 Table
    numbersTableBody.innerHTML = ""; // Clear table before updating

    for (let i = 0; i < 6; i++) { // 6 rows
      const row = document.createElement("tr");

      for (let j = 0; j < 5; j++) { // 5 columns
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
          cell.textContent = ""; // Empty placeholder
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

// ------------------ Lost and Found Table Logic ------------------ //
const itemInput = document.getElementById("lostItemInput");
const insertButton = document.getElementById("insertButton");
const lostAndFoundTableBody = document.getElementById("lostinfound");
const lostAndFoundRef = ref(db, "lost_and_found"); // Reference for Lost and Found

insertButton.addEventListener("click", () => {
  const item = itemInput.value.trim();
  if (!item) {
    alert("Please enter a valid item.");
    return;
  }

  const newItemRef = push(lostAndFoundRef);
  set(newItemRef, item)
    .then(() => itemInput.value = "") // Clear input after adding
    .catch((error) => alert("Error adding item: " + error.message));
});

// Listen for Enter key to trigger Insert button click
itemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    insertButton.click(); // Simulate clicking the Insert button
  }
});

// Display Lost and Found Items in a 5x3 Grid
onValue(lostAndFoundRef, (snapshot) => {
    let items = [];

    // Get all stored items and their Firebase keys
    snapshot.forEach((childSnapshot) => {
        items.push({ key: childSnapshot.key, value: childSnapshot.val() });
    });

    // Fill empty spaces with `null` placeholders to maintain a 5x3 structure (15 slots)
    while (items.length < 15) {
        items.push(null);
    }

    // Render a Fixed 5x3 Table
    lostAndFoundTableBody.innerHTML = ""; // Clear table before updating

    for (let i = 0; i < 3; i++) { // 3 rows
        const row = document.createElement("tr");

        for (let j = 0; j < 5; j++) { // 5 columns
            const index = i * 5 + j;
            const cell = document.createElement("td");

            if (items[index]) {
                cell.innerHTML = `
                    ${items[index].value}
                    <button class="delete-item-btn delete-btn btn btn-sm btn-danger" data-id="${items[index].key}">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
            } else {
                cell.textContent = ""; // Empty placeholder
            }

            row.appendChild(cell);
        }

        lostAndFoundTableBody.appendChild(row);
    }

    // Attach Delete Event Listeners
    document.querySelectorAll(".delete-item-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const itemId = event.target.getAttribute("data-id");
            remove(ref(db, `lost_and_found/${itemId}`)) // ✅ Delete from Firebase
                .then(() => console.log("Item deleted successfully!"))
                .catch((error) => alert("Error deleting item: " + error.message));
        });
    });
});
