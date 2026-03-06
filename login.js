const form = document.getElementById("loginForm");
const errorLine = document.getElementById("loginError");

const emailInput = form?.querySelector('input[name="email"]');
const password = document.getElementById("password");

const remember = document.getElementById("remember");
const toggle = document.getElementById("togglePassword");
const eyeSlash = document.getElementById("eyeSlash");

/* Ẩn lỗi */
function hideError() {
    if (!errorLine) return;
    errorLine.classList.add("hidden");
    errorLine.style.display = "none";
}

window.setLoginError = (message = "Email hoặc mật khẩu không chính xác") => {
    if (!errorLine) return;
    errorLine.textContent = message;
    errorLine.classList.remove("hidden");
    errorLine.style.display = "block";
};
window.clearLoginError = hideError;

const AUTH_USERS = [
    { email: "hoangminhngoc304@gmail.com", password: "Due#1234" },
];

/* Show / Hide password */
toggle?.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(isHidden));
    if (isHidden) eyeSlash?.classList.add("hidden");
    else eyeSlash?.classList.remove("hidden");
});

emailInput?.addEventListener("input", hideError);
password?.addEventListener("input", hideError);

/* Submit login */
form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const email = (emailInput?.value || "").trim();
    const pass = (password?.value || "").trim();

    if (!email || !pass) {
        window.setLoginError("Email hoặc mật khẩu không chính xác");
        return;
    }

    try {

        /* ===== SAU NÀY GỌI API ===== */
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: pass
            })
        });

        const data = await response.json();

        if (!response.ok) {
            window.setLoginError(data.message || "Email hoặc mật khẩu không chính xác");
            return;
        }

        /* Login success */

        const storage = remember?.checked ? localStorage : sessionStorage;

        storage.setItem(
            "unimentor_auth",
            JSON.stringify({
                token: data.token || "temp_token",
                email: email,
                loginTime: Date.now()
            })
        );

        window.location.href = "./dashboard.html";

    } 
    catch (error) {
    window.setLoginError("Không thể kết nối tới server");
    }
});