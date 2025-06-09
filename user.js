const secretKey = "my-secret-key"; // keep consistent and secret

document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateUserFields()) return;

  const userData = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: CryptoJS.AES.encrypt(document.getElementById('password').value, secretKey).toString()
  };

  let users = JSON.parse(localStorage.getItem('usersList')) || [];

  const duplicate = users.find(u => u.email === userData.email || u.username === userData.username);
  if (duplicate) {
    await showModal('Email or username already exists!', "alert");
    return;
  }

  users.push(userData);
  localStorage.setItem('usersList', JSON.stringify(users));

  localStorage.setItem('currentUserIndex', users.length - 1);

  await showModal("Registration successful!", "alert");
  window.location.href = 'profile.html';
});

function setError(field, message) {
  document.getElementById(field + 'Error').textContent = message || '';
}

function validateUserFields() {
  let valid = true;
  // Clear all errors
  setError('firstName');
  setError('lastName');
  setError('username');
  setError('email');
  setError('password');

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const nameRegex = /^[A-Za-z]+$/;
  const usernameRegex = /^\S{3,}$/; // No spaces, min 3 characters
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/; // At least 6 chars

  if (!firstName || !nameRegex.test(firstName)) {
    setError('firstName', "Please enter a valid first name (letters only).");
    valid = false;
  }
  if (!lastName || !nameRegex.test(lastName)) {
    setError('lastName', "Please enter a valid last name (letters only).");
    valid = false;
  }
  if (!username || !usernameRegex.test(username)) {
    setError('username', "Username must be at least 3 characters long and contain no spaces.");
    valid = false;
  }
  if (!email || !emailRegex.test(email)) {
    setError('email', "Please enter a valid email address.");
    valid = false;
  }
  if (!password || !passwordRegex.test(password)) {
    setError('password', "Password must be at least 6 characters.");
    valid = false;
  }
  return valid;
}

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

document.getElementById('deleteProfileBtn').addEventListener('click', async function () {
  const confirmed = await showModal("Are you sure you want to delete your profile? This action cannot be undone.", "confirm");
  if (confirmed) {
    // delete logic...
  }
});
