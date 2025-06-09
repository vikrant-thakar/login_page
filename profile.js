const index = localStorage.getItem('currentUserIndex');
let users = JSON.parse(localStorage.getItem('usersList')) || [];

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

function setError(field, message) {
  document.getElementById(field + 'Error').textContent = message || '';
}

function validateProfileFields() {
  let valid = true;
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
  const usernameRegex = /^\S{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;

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

// Immediately Invoked Function Expression (IIFE) to run the code
(async function() {
  if (index === null || !users[index]) {
    await showModal("No user found. Redirecting to registration.", "alert");
    window.location.href = "user.html";
    return;
  }
  const secretKey = "my-secret-key";
  const user = users[index];

  // Populate form
  document.getElementById('firstName').value = user.firstName;
  document.getElementById('lastName').value = user.lastName;
  document.getElementById('username').value = user.username;
  document.getElementById('email').value = user.email;
  const decryptedPassword = CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8);
  document.getElementById('password').value = decryptedPassword;

  // Save updates
  document.getElementById('profileForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateProfileFields()) return;

    users[index] = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: CryptoJS.AES.encrypt(document.getElementById('password').value, secretKey).toString()
    };

    localStorage.setItem('usersList', JSON.stringify(users));
    await showModal("Profile updated successfully!", "alert");
  });

  // Logout function
  window.logout = async function() {
    localStorage.removeItem('currentUserIndex');
    localStorage.removeItem('isAdminLoggedIn');
    await showModal("Logged out successfully.", "alert");
    window.location.href = "admin.html";
  };

  // Delete profile
  window.deleteProfile = async function() {
    const confirmed = await showModal("Are you sure you want to delete your profile? This action cannot be undone.", "confirm");
    if (confirmed) {
      users.splice(index, 1);
      localStorage.setItem('usersList', JSON.stringify(users));
      localStorage.removeItem('currentUserIndex');
      await showModal("Profile deleted.", "alert");
      window.location.href = "user.html";
    }
  };
})();

if (!localStorage.getItem('currentUserIndex')) {
  window.location.href = "admin.html"; // or user.html if you have a separate user login
}
