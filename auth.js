// Authentication check and user management

// Logout function - must be global for onclick handler
window.logout = function () {
    console.log('Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
};

// Check if user is authenticated
function checkAuth() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

// Get current user info
function getCurrentUser() {
    return {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || '',
        token: localStorage.getItem('authToken') || ''
    };
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    // Display user info in the sidebar
    const user = getCurrentUser();
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        const userInfo = document.createElement('div');
        userInfo.style.cssText = `
            padding: 1rem;
            border-top: 1px solid var(--border);
            margin-top: auto;
        `;
        userInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1rem;
                ">${user.name.charAt(0).toUpperCase()}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.email}</div>
                </div>
            </div>
            <button onclick="window.logout()" class="logout-btn" style="
                width: 100%;
                padding: 0.5rem;
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: var(--radius-md);
                color: #fca5a5;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
                font-size: 0.875rem;
            ">
                🚪 Logout
            </button>
        `;

        // Add hover effect
        const logoutBtn = userInfo.querySelector('.logout-btn');
        logoutBtn.addEventListener('mouseenter', function () {
            this.style.background = 'rgba(239, 68, 68, 0.2)';
        });
        logoutBtn.addEventListener('mouseleave', function () {
            this.style.background = 'rgba(239, 68, 68, 0.1)';
        });

        // Add to sidebar
        sidebar.appendChild(userInfo);
    }
});

// Export auth functions
window.auth = {
    checkAuth,
    getCurrentUser,
    logout: window.logout
};
