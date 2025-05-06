
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
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Reference for page views
  const pageViewRef = db.ref("pageViews/officeOfStudentAffairs");
  
  // Increment the view count
  pageViewRef.transaction(currentViews => {
    return (currentViews || 0) + 1;
  });
  
  // Display view count on the page
  pageViewRef.on("value", snapshot => {
    const count = snapshot.val() || 0;
    const viewCountElement = document.getElementById("view-count");
    if (viewCountElement) {
      viewCountElement.innerText = count;
    }
  });
  