/**
 * Shuffles an array in place and returns a new shuffled array.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new array with elements shuffled.
 */
export function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}