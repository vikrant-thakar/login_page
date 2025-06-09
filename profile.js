const index = localStorage.getItem('currentUserIndex');
let users = JSON.parse(localStorage.getItem('usersList')) || [];

if (index === null || !users[index]) {
  alert("No user found. Redirecting to registration.");
  window.location.href = "user.html";
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
document.getElementById('profileForm').addEventListener('submit', function (e) {
  e.preventDefault();

  users[index] = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: CryptoJS.AES.encrypt(document.getElementById('password').value, secretKey).toString()
  };

  localStorage.setItem('usersList', JSON.stringify(users));
  alert("Profile updated successfully!");
});

// Logout function
function logout() {
  localStorage.removeItem('currentUserIndex');
  localStorage.removeItem('isAdminLoggedIn');
  alert("Logged out successfully.");
  window.location.href = "admin.html";
}

// Delete profile
function deleteProfile() {
  if (confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
    users.splice(index, 1);
    localStorage.setItem('usersList', JSON.stringify(users));
    localStorage.removeItem('currentUserIndex');
    alert("Profile deleted.");
    window.location.href = "user.html";
  }
}
