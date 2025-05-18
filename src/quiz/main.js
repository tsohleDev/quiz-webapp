import { shuffleArray } from './utils.js'
import { getUid } from '../data/authentication.js'
import { getQuestions } from '../data/database-client.js'

const categoryButtons = document.querySelectorAll('.category-btn')

categoryButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const category = button.innerHTML
        const uid = getUid()
        console.log(category);

        const questions = await getQuestions(uid, category)
        console.log(questions);

    });
});

