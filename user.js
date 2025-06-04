const secretKey = "my-secret-key"; // keep consistent and secret

document.getElementById('registerForm').addEventListener('submit', function (e) {
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
    alert('Email or username already exists!');
    return;
  }

  users.push(userData);
  localStorage.setItem('usersList', JSON.stringify(users));

  localStorage.setItem('currentUserIndex', users.length - 1);

  alert("Registration successful!");
  window.location.href = 'profile.html';
});

function validateUserFields() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const username = document.getElementById('username').value.trim();

  const nameRegex = /^[A-Za-z]+$/;
  const usernameRegex = /^\S{3,}$/; // No spaces, min 3 characters

  if (!firstName || !nameRegex.test(firstName)) {
    alert("Please enter a valid first name (letters only).");
    return false;
  }

  if (!lastName || !nameRegex.test(lastName)) {
    alert("Please enter a valid last name (letters only).");
    return false;
  }

  if (!username || !usernameRegex.test(username)) {
    alert("Username must be at least 3 characters long and contain no spaces.");
    return false;
  }

  return true;
}
