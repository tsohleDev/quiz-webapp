/**
 * Retrieves a cookie by name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} The cookie value or null if not found.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Sets a cookie.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [days] - Number of days until the cookie expires. If not provided, it's a session cookie.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Added SameSite=Lax for better security defaults.
    // Path=/ makes the cookie available to the entire site.
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

/**
 * Generates a UUID. Uses crypto.randomUUID() if available, otherwise a fallback.
 * @returns {string} A UUID string.
 */
function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    } else {
        // Fallback for environments where crypto.randomUUID is not available
        console.warn("crypto.randomUUID not available, using fallback UUID generator. This is not cryptographically secure.");
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

/**
 * Retrieves the UID from a cookie named 'uid'.
 * If the cookie doesn't exist or is empty, it generates a new UUID,
 * stores it in the 'uid' cookie (expires in 365 days), and then returns the new UID.
 * @returns {string} The user's UID.
 */
function getUid() {
    const cookieName = 'uid';
    let uid = getCookie(cookieName);

    if (uid && uid.trim() !== '') {
        console.log(`Retrieved UID from cookie '${cookieName}': ${uid}`);
        return uid;
    } else {
        uid = generateUUID();
        console.log(`Generated new UID: ${uid}`);
        // Store the new UID in a cookie, set to expire in 1 year.
        setCookie(cookieName, uid, 365);
        console.log(`Stored new UID in cookie '${cookieName}'.`);
        return uid;
    }
}

export { getUid };