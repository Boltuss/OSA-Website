import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
