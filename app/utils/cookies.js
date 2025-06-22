// Utility functions for cookie management

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setCookie(name, value, options = {}) {
    if (typeof document === 'undefined') return; // Server-side check
    
    const {
        expires = 3600, // Default 1 hour
        path = '/',
        sameSite = 'Strict'
    } = options;
    
    let cookieString = `${name}=${value}; Path=${path}; SameSite=${sameSite}`;
    
    if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 1000));
        cookieString += `; Expires=${date.toUTCString()}`;
    }
    
    document.cookie = cookieString;
}
