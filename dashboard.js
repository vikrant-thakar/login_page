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

function deleteUser(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    users.splice(index, 1);
    localStorage.setItem('usersList', JSON.stringify(users));
    renderUsers();
  }
}

function clearAllUsers() {
  if (confirm("This will remove all users. Are you sure?")) {
    localStorage.removeItem('usersList');
    users = [];
    renderUsers();
  }
}

// Initial render
renderUsers();


  function logout() {
    localStorage.removeItem('currentUserIndex');
    localStorage.removeItem('isAdminLoggedIn');
    alert("Logged out successfully.");
    window.location.href = "admin.html";
  }


