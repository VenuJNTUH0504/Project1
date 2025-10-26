// File: /project/project/src/js/users.js

document.addEventListener('DOMContentLoaded', function() {
    const usersTableBody = document.getElementById('users-table-body');

    // Fetch user data from the server or local storage
    function fetchUsers() {
        // This is a placeholder for the actual fetch call
        // Replace with your API endpoint or data source
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Populate the users table
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.fullname}</td>
                <td>${user.username}</td>
                <td>${user.performanceScore}</td>
                <td><a href="user-details.html?id=${user.id}" class="view-details">View Details</a></td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    // Initialize the users table
    fetchUsers();
});