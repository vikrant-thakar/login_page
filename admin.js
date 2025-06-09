const secretKey = "my-secret-key";

// One-time setup (only runs if adminUser doesn't exist)
if (!localStorage.getItem("adminUser")) {
  const adminPassword = CryptoJS.AES.encrypt("password", secretKey).toString();

  const admin = {
    email: "example@gmail.com",
    password: adminPassword
  };

  localStorage.setItem("adminUser", JSON.stringify(admin));
}

function setError(field, message) {
  document.getElementById(field + 'Error').textContent = message || '';
}

function validateLoginFields() {
  let valid = true;
  setError('email');
  setError('password');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    setError('email', "Please enter a valid email address.");
    valid = false;
  }
  if (!password) {
    setError('password', "Please enter your password.");
    valid = false;
  }
  return valid;
}

document.querySelector('form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent form submission

  if (!validateLoginFields()) return;

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginAsAdmin = document.getElementById('loginAsAdmin').checked;

  const users = JSON.parse(localStorage.getItem('usersList')) || [];
  const admin = JSON.parse(localStorage.getItem('adminUser')) || {};

  if (loginAsAdmin) {
    // Only check admin login
    if (email === admin.email) {
      const bytes = CryptoJS.AES.decrypt(admin.password, secretKey);
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (password === decryptedPassword) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        await showModal("Admin login successful!", "alert");
        window.location.href = "dashboard.html";
        return;
      }
    }
    await showModal("Invalid admin email or password.", "alert");
    return;
  }

  // User login check
  const user = users.find(u => u.email === email);
  if (user) {
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (password === decryptedPassword) {
      localStorage.setItem('currentUserIndex', users.indexOf(user));
      await showModal("Login successful!", "alert");
      window.location.href = "profile.html";
      return;
    }
  }

  // Admin login check (if not checked, fallback)
  if (email === admin.email) {
    const bytes = CryptoJS.AES.decrypt(admin.password, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (password === decryptedPassword) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      await showModal("Admin login successful!", "alert");
      window.location.href = "dashboard.html";
      return;
    }
  }

  // Invalid
  await showModal("Invalid email or password.", "alert");
});

// Modal helper
function showModal(message, type = "alert") {
  return new Promise((resolve) => {
    const modal = document.getElementById('customModal');
    const msg = document.getElementById('modalMessage');
    const okBtn = document.getElementById('modalOkBtn');
    const yesBtn = document.getElementById('modalYesBtn');
    const noBtn = document.getElementById('modalNoBtn');

    msg.textContent = message;
    okBtn.style.display = "none";
    yesBtn.style.display = "none";
    noBtn.style.display = "none";

    if (type === "alert") {
      okBtn.style.display = "inline-block";
      okBtn.onclick = () => {
        modal.style.display = "none";
        resolve(true);
      };
    } else if (type === "confirm") {
      yesBtn.style.display = "inline-block";
      noBtn.style.display = "inline-block";
      yesBtn.onclick = () => {
        modal.style.display = "none";
        resolve(true);
      };
      noBtn.onclick = () => {
        modal.style.display = "none";
        resolve(false);
      };
    }

    modal.style.display = "flex";
  });
}
