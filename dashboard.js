const userListDiv = document.getElementById('userList');
let users = JSON.parse(localStorage.getItem('usersList')) || [];

function renderUsers() {
  userListDiv.innerHTML = '';
  if (users.length === 0) {
    userListDiv.innerHTML = '<p style="text-align:center;">No users registered yet.</p>';
    return;
  }

  users.forEach((user, index) => {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    userCard.innerHTML = `
      <h3>User ${index + 1}</h3>
      <p><strong>First Name:</strong> ${user.firstName}</p>
      <p><strong>Last Name:</strong> ${user.lastName}</p>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Password:</strong> ******</p>
      <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
    `;

    userListDiv.appendChild(userCard);
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


