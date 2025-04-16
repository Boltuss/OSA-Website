import { auth } from "./firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (!loginForm) {
        return;
    }

    eyeIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.classList.remove("bi-eye");
            eyeIcon.classList.add("bi-eye-slash");
        } else {
            passwordInput.type = "password";
            eyeIcon.classList.remove("bi-eye-slash");
            eyeIcon.classList.add("bi-eye");
        }
    });

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("username").value;
        const message = document.getElementById("loginMessage");

        console.log("", email, passwordInput.value);

        message.textContent = "Logging in...";
        message.style.color = "white";

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, passwordInput.value);
            console.log("", userCredential.user);
            sessionStorage.setItem("isAuthenticated", "true");
            message.textContent = "Login successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "adminrelease.html"; 
            }, 1000);
        } catch (error) {
            console.error("", error.code, error.message);
            message.textContent = "Invalid email or password.";
            message.style.color = "white";
        }
    });
});
