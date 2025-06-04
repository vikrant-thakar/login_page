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

document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

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
        alert("Admin login successful!");
        window.location.href = "dashboard.html";
        return;
      }
    }
    alert("Invalid admin email or password.");
    return;
  }

  // User login check
  const user = users.find(u => u.email === email);
  if (user) {
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (password === decryptedPassword) {
      localStorage.setItem('currentUserIndex', users.indexOf(user));
      alert("Login successful!");
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
      alert("Admin login successful!");
      window.location.href = "dashboard.html";
      return;
    }
  }

  // Invalid
  alert("Invalid email or password.");
});
