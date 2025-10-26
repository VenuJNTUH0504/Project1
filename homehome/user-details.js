// This file retrieves and displays detailed performance data for a selected user.

document.addEventListener('DOMContentLoaded', function() {
    const userId = new URLSearchParams(window.location.search).get('id');
    const userDetailsContainer = document.getElementById('user-details');

    if (userId) {
        fetchUserDetails(userId);
    } else {
        userDetailsContainer.innerHTML = '<p>No user selected.</p>';
    }

    function fetchUserDetails(userId) {
        // Simulating a fetch request to get user details
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);

        if (user) {
            displayUserDetails(user);
        } else {
            userDetailsContainer.innerHTML = '<p>User not found.</p>';
        }
    }

    function displayUserDetails(user) {
        userDetailsContainer.innerHTML = `
            <h2>${user.fullname || user.username}'s Performance</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Learning Path:</strong> ${user.learning_path || 'N/A'}</p>
            <h3>Quiz Performance</h3>
            <table>
                <thead>
                    <tr>
                        <th>Quiz Title</th>
                        <th>Score</th>
                        <th>Date Taken</th>
                    </tr>
                </thead>
                <tbody>
                    ${user.quizPerformance.map(performance => `
                        <tr>
                            <td>${performance.title}</td>
                            <td>${performance.score}</td>
                            <td>${new Date(performance.date).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
});