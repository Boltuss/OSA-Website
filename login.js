document.getElementById('eyeIcon').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.classList.remove('bi-eye');
        this.classList.add('bi-eye-slash');
    } else {
        passwordField.type = 'password';
        this.classList.remove('bi-eye-slash');
        this.classList.add('bi-eye');
    }
});

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    message.textContent = "Logging in...";
    message.style.color = "white";

    setTimeout(() => {
        const correctUsername = "Admin";
        const correctPassword = "AdminOSA123";

        if (username === correctUsername && password === correctPassword) {
            sessionStorage.setItem("isAuthenticated", "true"); 
            message.textContent = "Login successful! Redirecting...";
            message.style.color = "white";
            setTimeout(() => {
                window.location.href = "adminrelease.html"; 
            }, 1000);
        } else {
            message.textContent = "The Username or Password you have Entered is Invalid.";
            message.style.color = "white";
        }
    }, 1000); 
});
