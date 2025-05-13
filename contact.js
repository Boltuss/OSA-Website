// Import Firebase functions from the modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCEf9If3R9r8F_JSXaxmtx0liqrMIODebo",
    authDomain: "office-of-student-affairs.firebaseapp.com",
    databaseURL: "https://office-of-student-affairs-default-rtdb.firebaseio.com/",
    projectId: "office-of-student-affairs",
    storageBucket: "office-of-student-affairs.appspot.com",
    messagingSenderId: "807502412285",
    appId: "1:807502412285:web:9dd217701e71750249c194"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initialize EmailJS
emailjs.init("NO-hCzw8qRiNp_kF7");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const emailInput = document.getElementById("emailInput");
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const otpInput = document.getElementById("otpInput");
    const otpSection = document.getElementById("otpSection");
    const result = document.getElementById("result");
    const statusMessage = document.getElementById("statusMessage");
    const submitBtn = document.getElementById("submitBtn");

    let verified = false;
    let verifiedEmail = "";

    // Send OTP
    sendOtpBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    statusMessage.textContent = "";

    if (!email) {
        statusMessage.textContent = "Please enter a valid email address.";
        statusMessage.style.color = "white";
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const encodedEmail = email.replace(/@/g, "_").replace(/\./g, "_");

    try {
        statusMessage.textContent = "Generating OTP...";
        statusMessage.style.color = "white";

        const otpRef = ref(db, "otp/" + encodedEmail);
        await set(otpRef, { otp: otp });

        statusMessage.textContent = "OTP stored. Sending email...";
        statusMessage.style.color = "orange";

        await emailjs.send("service_c8ml4df", "template_m1jlisw", {
            to_email: email,
            otp_code: otp
        });

        otpSection.classList.remove("d-none");
        statusMessage.textContent = "OTP sent! Please check your email.";
        statusMessage.style.color = "white";

        sendOtpBtn.disabled = true;  // ✅ Disable button only after successful sending

    } catch (err) {
        console.error("Error during OTP process:", err);
        statusMessage.textContent = "Error sending OTP. Please try again.";
        statusMessage.style.color = "white";
    }
});


    // Verify OTP
    verifyOtpBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const enteredOtp = otpInput.value.trim();
        const encodedEmail = email.replace(/@/g, "_").replace(/\./g, "_");

        try {
            const otpRef = ref(db, "otp/" + encodedEmail);
            const snapshot = await get(otpRef);

            if (snapshot.exists() && snapshot.val().otp == enteredOtp) {
                verified = true;
                verifiedEmail = email;
                result.textContent = "Email verified!";
                result.style.color = "white";

                submitBtn.disabled = false;
                emailInput.value = verifiedEmail; // ✅ Ensure input has the verified value
                otpInput.value = "";
                await remove(otpRef);

                otpSection.classList.add("d-none");
            } else {
                result.textContent = "Invalid OTP. Please try again.";
                result.style.color = "white";
                otpInput.value = "";
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            result.textContent = "Error verifying OTP. Please try again.";
            result.style.color = "red";
        }
    });

    // Submit contact form
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!verified) {
            result.textContent = "Please verify your email first.";
            result.style.color = "red";
            return;
        }

        const formData = new FormData(form);
        formData.set("email", verifiedEmail); // Ensure verified email is used

        const name = formData.get("name");
        formData.append("subject", `${name} sent a message from the website`);

        // ✅ Ensure access_key is present
        if (!formData.get("access_key")) {
            formData.set("access_key", "4204f827-538e-410d-9ddc-4854f3fb3928");
        }

        result.textContent = "Sending message...";
        result.style.display = "block";
        result.style.color = "white";

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log("Web3Forms response:", data); // ✅ Debug output

            if (data.success) {
                result.textContent = "Message sent successfully!";
                result.style.color = "white";

                form.reset();
                otpSection.classList.add("d-none");
                statusMessage.textContent = "";
                otpInput.value = "";
                verified = false;
                verifiedEmail = "";
                submitBtn.disabled = true;
            } else {
                console.error("Web3Forms error:", data);
                result.textContent = "Error sending message. Please try again.";
                result.style.color = "white";
            }
        } catch (error) {
            console.error("Fetch error:", error);
            result.textContent = "Something went wrong!";
            result.style.color = "white";
        } finally {
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        }
    });
});
