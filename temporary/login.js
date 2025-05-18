document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorElem = document.getElementById('login-error');

    if (sessionStorage.getItem('isLoggedInQuizApp') === 'true') {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            window.location.href = `quiz.html?category=${category}`;
        } else {
            window.location.href = 'landing.html'; 
        }
        return; 
    }


    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if ((username === "user" && password === "pass") || (username !== "" && password !== "")) {
            sessionStorage.setItem('isLoggedInQuizApp', 'true');
            loginErrorElem.style.display = 'none';
            
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');

             if (category) {
                window.location.href = 'landing.html';
            } else {
            
                window.location.href = 'landing.html';
            }
        } else {
            loginErrorElem.textContent = "Invalid username or password.";
            loginErrorElem.style.display = 'block';
        }
    });
});