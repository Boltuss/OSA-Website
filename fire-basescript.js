// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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
const auth = getAuth();

// DOM Elements
const logoutButton = document.getElementById("logoutButton");
const numberInput = document.getElementById("numberInput");
const addButton = document.getElementById("addButton");
const numbersTableBody = document.getElementById("numberTable");
const errorContainer = document.getElementById("errorContainer");
const itemInput = document.getElementById("lostItemInput");
const insertButton = document.getElementById("insertButton");
const lostAndFoundTableBody = document.getElementById("lostinfound");
const viewCountElement = document.getElementById("view-count");

// Firebase Refs
const numbersRef = ref(db, "numbers");
const lostAndFoundRef = ref(db, "lost_and_found");
const pageViewRef = ref(db, "pageViews/officeOfStudentAffairs");

// Logout
logoutButton?.addEventListener("click", () => {
  signOut(auth).then(() => {
    sessionStorage.setItem("isAuthenticated", "false");
    window.location.href = "login.html";
  }).catch(console.error);
});

// Show error helper
function showError(message) {
  if (errorContainer) errorContainer.textContent = message;
}

// Add number
addButton?.addEventListener("click", () => {
  showError("");
  const number = numberInput.value.trim();
  if (!number) {
    showError("Please enter a value.");
    return;
  }

  onValue(numbersRef, (snapshot) => {
    let exists = false;
    snapshot.forEach((child) => {
      if (child.val().toString() === number) exists = true;
    });

    if (exists) {
      showError("This number already exists. Please enter a unique number.");
    } else {
      const newRef = push(numbersRef);
      set(newRef, number).then(() => numberInput.value = "").catch(e => showError(e.message));
    }
  }, { onlyOnce: true });
});

// Enter key triggers add
numberInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addButton.click();
});

// Display numbers in table
onValue(numbersRef, (snapshot) => {
  let numbers = [];
  snapshot.forEach((child) => {
    numbers.push({ key: child.key, value: child.val() });
  });

  numbers.sort((a, b) => a.value - b.value);

  // Populate table
  numbersTableBody.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("td");
      const index = i * 5 + j;
      const entry = numbers[index];

      if (entry) {
        cell.innerHTML = `
          ${entry.value}
          <button class="delete-btn btn btn-sm btn-danger" data-id="${entry.key}">
            <i class="bi bi-trash"></i>
          </button>
        `;
      }

      row.appendChild(cell);
    }
    numbersTableBody.appendChild(row);
  }
});

// Delete number - delegate event
numbersTableBody?.addEventListener("click", (e) => {
  if (e.target.closest(".delete-btn")) {
    const btn = e.target.closest(".delete-btn");
    const id = btn.getAttribute("data-id");
    remove(ref(db, `numbers/${id}`)).catch(e => showError(e.message));
  }
});

// Lost & Found - insert
insertButton?.addEventListener("click", () => {
  const item = itemInput.value.trim();
  if (!item) return alert("Please enter a valid item.");

  const newItemRef = push(lostAndFoundRef);
  set(newItemRef, item).then(() => itemInput.value = "").catch(e => alert(e.message));
});

// Enter triggers insert
itemInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") insertButton.click();
});

// Display Lost & Found
onValue(lostAndFoundRef, (snapshot) => {
  let items = [];
  snapshot.forEach((child) => {
    items.push({ key: child.key, value: child.val() });
  });

  // Populate table
  lostAndFoundTableBody.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 5; j++) {
      const index = i * 5 + j;
      const cell = document.createElement("td");

      if (items[index]) {
        cell.innerHTML = `
          ${items[index].value}
          <button class="delete-item-btn btn btn-sm btn-danger" data-id="${items[index].key}">
            <i class="bi bi-trash"></i>
          </button>
        `;
      }

      row.appendChild(cell);
    }
    lostAndFoundTableBody.appendChild(row);
  }
});

// Delete Lost & Found item
lostAndFoundTableBody?.addEventListener("click", (e) => {
  if (e.target.closest(".delete-item-btn")) {
    const btn = e.target.closest(".delete-item-btn");
    const id = btn.getAttribute("data-id");
    remove(ref(db, `lost_and_found/${id}`)).catch(e => alert(e.message));
  }
});

// Retrieve and display page views without updating
onValue(pageViewRef, (snapshot) => {
  const count = snapshot.val() || 0;
  if (viewCountElement) {
    viewCountElement.innerText = count;
  }
});
