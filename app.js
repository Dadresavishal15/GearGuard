// Main Application Controller

let currentView = 'dashboard';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeModal();
    initializeAddButton();
    switchView('dashboard');
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch view
            switchView(view);
        });
    });
}

// View switching
function switchView(view) {
    currentView = view;

    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Show selected view
    const viewElement = document.getElementById(`${view}-view`);
    if (viewElement) {
        viewElement.classList.add('active');
    }

    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'equipment': 'Equipment',
        'requests': 'Maintenance Requests',
        'teams': 'Teams',
        'categories': 'Equipment Categories',
        'calendar': 'Calendar'
    };
    document.getElementById('view-title').textContent = titles[view] || view;

    // Render view content
    renderCurrentView();
}

function renderCurrentView() {
    switch (currentView) {
        case 'dashboard':
            dashboard.render();
            break;
        case 'equipment':
            equipment.render();
            break;
        case 'requests':
            requests.render();
            break;
        case 'teams':
            teams.render();
            break;
        case 'categories':
            categories.render();
            break;
        case 'calendar':
            calendar.render();
            break;
    }
}

// Modal management
function initializeModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('modal-close');

    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// Add button
function initializeAddButton() {
    const addBtn = document.getElementById('add-new-btn');

    addBtn.addEventListener('click', () => {
        switch (currentView) {
            case 'equipment':
                equipment.edit('');
                break;
            case 'requests':
                requests.edit('');
                break;
            case 'teams':
                teams.edit('');
                break;
            case 'categories':
                categories.edit('');
                break;
            case 'calendar':
                // Open today's date
                const today = new Date().toISOString().split('T')[0];
                handleDateClick(today);
                break;
            default:
                // Default to creating a request
                requests.edit('');
        }
    });
}

// Make functions globally available
window.closeModal = closeModal;
window.switchView = switchView;
window.renderCurrentView = renderCurrentView;

// Refresh data periodically (every 30 seconds)
setInterval(() => {
    if (currentView === 'dashboard') {
        dashboard.updateMetrics();
    }
}, 30000);
