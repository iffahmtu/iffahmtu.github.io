const PASSWORD_HASH = "aa5feb063ab3c232c673a104ddf90e13104bd70f0a87c069d1834bca358028e3";
const ACCESS_DURATION = 60 * 60 * 1000;
const ACCESS_KEY = "portfolio_access_time";

async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function hasValidAccess() {
    const accessTime = Number(sessionStorage.getItem(ACCESS_KEY));

    if (!accessTime) return false;

    const elapsed = Date.now() - accessTime;

    if (elapsed >= ACCESS_DURATION) {
        sessionStorage.removeItem(ACCESS_KEY);
        return false;
    }

    return true;
}

function grantAccess() {
    sessionStorage.setItem(ACCESS_KEY, Date.now().toString());
}

function logout() {
    sessionStorage.removeItem(ACCESS_KEY);
    window.location.href = "login.html";
}

async function checkPassword(password) {
    const hash = await hashPassword(password);
    return hash === PASSWORD_HASH;
}

function startAccessTimer() {
    const accessTime = Number(sessionStorage.getItem(ACCESS_KEY));

    if (!accessTime) return;

    const remaining = ACCESS_DURATION - (Date.now() - accessTime);

    if (remaining <= 0) {
        logout();
        return;
    }

    setTimeout(() => {
        sessionStorage.removeItem(ACCESS_KEY);

        alert("Your access has expired. Please enter the password again.");

        window.location.href = "login.html?expired=1";
    }, remaining);
}