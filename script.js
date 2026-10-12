const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const agreement = document.getElementById("agreement");
const agreementError = document.getElementById("agreementError");

const fields = [
    document.getElementById("studentId"),
    document.getElementById("fullName"),
    document.getElementById("email"),
    document.getElementById("phone"),
    document.getElementById("dob"),
    document.getElementById("gender"),
    document.getElementById("program"),
    document.getElementById("yearLevel"),
    password,
    confirmPassword,
    document.getElementById("address")
];

// Set today's date as the latest allowed date of birth.
document.getElementById("dob").setAttribute(
    "max",
    new Date().toISOString().split("T")[0]
);

// Show or hide both password fields.
// classList.toggle() also toggles a visual state class.
togglePassword.addEventListener("click", function () {
    const showing = password.type === "password";
    const newType = showing ? "text" : "password";

    password.setAttribute("type", newType);
    confirmPassword.setAttribute("type", newType);
    togglePassword.textContent = showing ? "Hide passwords" : "Show passwords";
    togglePassword.setAttribute("aria-pressed", String(showing));
    togglePassword.classList.toggle("password-visible", showing);
});

// Display an error for a particular field.
function showError(field, message) {
    field.classList.add("error");

    const errorElement = field.parentElement.querySelector(".error-message");
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Remove a field's error when corrected.
function clearError(field) {
    field.classList.remove("error");

    const errorElement = field.parentElement.querySelector(".error-message");
    if (errorElement) {
        errorElement.textContent = "";
    }
}

// Validate one field and return true when valid.
function validateField(field) {
    const value = field.value.trim();
    field.value = value;

    const label = field.dataset.label;
    let message = "";

    if (!value) {
        message = `${label} is required.`;
    } else if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            message = "Please enter a valid email address.";
        }
    } else if (field.id === "phone") {
        // Accepts Philippine mobile numbers such as 09123456789,
        // +639123456789, or 639123456789.
        const phonePattern = /^(09\d{9}|\+639\d{9}|639\d{9})$/;
        if (!phonePattern.test(value)) {
            message = "Use a valid Philippine mobile number (e.g. 09123456789).";
        }
    } else if (field.id === "fullName") {
        if (value.length < 2) {
            message = "Full name must contain at least 2 characters.";
        }
    } else if (field.id === "dob") {
        if (value > new Date().toISOString().split("T")[0]) {
            message = "Date of birth cannot be in the future.";
        }
    } else if (field.id === "password") {
        if (value.length < 8) {
            message = "Password must be at least 8 characters long.";
        }
    } else if (field.id === "confirmPassword") {
        if (value !== password.value) {
            message = "Passwords do not match.";
        }
    }

    if (message) {
        showError(field, message);
        return false;
    }

    clearError(field);
    return true;
}

// Validate fields as the user edits them.
fields.forEach(function (field) {
    field.addEventListener("input", function () {
        validateField(field);

        // If the original password changes, recheck confirmation.
        if (field === password && confirmPassword.value.trim() !== "") {
            validateField(confirmPassword);
        }

        successMessage.classList.remove("show");
        successMessage.textContent = "";
    });

    field.addEventListener("change", function () {
        if (field.value.trim() !== "") {
            validateField(field);
        }
    });
});

// Validate the complete form on submission.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let formIsValid = true;

    fields.forEach(function (field) {
        if (!validateField(field)) {
            formIsValid = false;
        }
    });

    if (!agreement.checked) {
        agreementError.textContent = "You must agree before registering.";
        document.querySelector(".agreement").classList.add("agreement-error");
        formIsValid = false;
    } else {
        agreementError.textContent = "";
        document.querySelector(".agreement").classList.remove("agreement-error");
    }

    if (!formIsValid) {
        successMessage.classList.remove("show");
        successMessage.textContent = "";

        const firstInvalid = form.querySelector(".error");
        if (firstInvalid) {
            firstInvalid.focus();
        }
        return;
    }

    // This is a front-end demonstration; no information is sent to a server.
    successMessage.textContent =
        `Registration successful! Welcome, ${document.getElementById("fullName").value}. ` +
        "Your information passed validation.";
    successMessage.classList.add("show");

    // Clear any leftover field errors after successful validation.
    fields.forEach(clearError);
    agreementError.textContent = "";
    document.querySelector(".agreement").classList.remove("agreement-error");

    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Restore the original form state when Reset is clicked.
form.addEventListener("reset", function () {
    // Run after the browser has reset the form controls.
    setTimeout(function () {
        fields.forEach(clearError);

        agreementError.textContent = "";
        document.querySelector(".agreement").classList.remove("agreement-error");

        successMessage.textContent = "";
        successMessage.classList.remove("show");

        password.setAttribute("type", "password");
        confirmPassword.setAttribute("type", "password");
        togglePassword.textContent = "Show passwords";
        togglePassword.setAttribute("aria-pressed", "false");
        togglePassword.classList.remove("password-visible");
    }, 0);
});
