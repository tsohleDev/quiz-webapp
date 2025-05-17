document.addEventListener('DOMContentLoaded', () => {
    const categoryButtonsContainer = document.getElementById('category-buttons-container');

    if (!quizData || quizData.length === 0) {
        categoryButtonsContainer.innerHTML = '<p>No quiz categories available at the moment. Please check back later.</p>';
        return;
    }

    quizData.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-btn');
        button.textContent = category.category;
        button.addEventListener('click', () => {
            const encodedCategory = encodeURIComponent(category.category);
            // Redirect to login.html, passing the category
            window.location.href = `login.html?category=${encodedCategory}`;
        });
        categoryButtonsContainer.appendChild(button);
    });
});