const userTableBody = document.getElementById('userTableBody');
let users = JSON.parse(localStorage.getItem('usersList')) || [];

function renderUsers() {
  userTableBody.innerHTML = '';
  if (users.length === 0) {
    userTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No users registered yet.</td></tr>`;
    return;
  }

  // Sort users by username (case-insensitive)
  const sortedUsers = [...users].sort((a, b) =>
    a.username.toLowerCase().localeCompare(b.username.toLowerCase())
  );

  sortedUsers.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>******</td>
      <td>
        <button class="delete-btn" onclick="deleteUser(${users.indexOf(user)})">Delete</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

async function deleteUser(index) {
  const confirmed = await showModal("Are you sure you want to delete this user?", "confirm");
  if (confirmed) {
    users.splice(index, 1);
    localStorage.setItem('usersList', JSON.stringify(users));
    renderUsers();
    showModal("User deleted successfully.", "alert");
  }
}

async function clearAllUsers() {
  const confirmed = await showModal("This will remove all users. Are you sure?", "confirm");
  if (confirmed) {
    localStorage.removeItem('usersList');
    users = [];
    renderUsers();
    showModal("All users have been removed.", "alert");
  }
}

async function logout() {
  const confirmed = await showModal("Are you sure you want to logout?", "confirm");
  if (confirmed) {
    localStorage.removeItem('currentUserIndex');
    localStorage.removeItem('isAdminLoggedIn');
    await showModal("Logged out successfully.", "alert");
    window.location.href = "admin.html";
  }
}

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

// Check admin login status
if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
  window.location.href = "admin.html";
}

// Initial render
renderUsers();


