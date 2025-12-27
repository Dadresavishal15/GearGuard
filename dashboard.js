// Dashboard View Management

function renderDashboard() {
    updateMetrics();
    renderTeamChart();
    renderCategoryChart();
    renderRecentActivity();
}

function updateMetrics() {
    // Technician Load
    const techLoad = utils.getTechnicianLoad();
    document.getElementById('technician-load').textContent = `${techLoad}%`;

    // Open Requests
    const openRequests = utils.getOpenRequestsCount();
    const overdueRequests = utils.getOverdueRequestsCount();
    document.getElementById('open-requests').textContent = openRequests;
    document.getElementById('overdue-requests').textContent = overdueRequests;

    // Critical Equipment
    const criticalEquipment = utils.getCriticalEquipmentCount();
    document.getElementById('critical-equipment').textContent = criticalEquipment;
}

function renderTeamChart() {
    const teamData = utils.getRequestsByTeam();
    const container = document.getElementById('team-chart');

    if (teamData.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No data available</p>';
        return;
    }

    const maxCount = Math.max(...teamData.map(t => t.count), 1);

    container.innerHTML = teamData.map(team => `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 500;">${team.name}</span>
                <span style="color: var(--primary-light); font-weight: 600;">${team.count}</span>
            </div>
            <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="
                    background: linear-gradient(135deg, var(--primary-light), var(--primary));
                    height: 100%;
                    width: ${(team.count / maxCount) * 100}%;
                    transition: width 0.3s ease;
                "></div>
            </div>
        </div>
    `).join('');
}

function renderCategoryChart() {
    const categoryData = utils.getRequestsByCategory();
    const container = document.getElementById('category-chart');

    if (categoryData.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No data available</p>';
        return;
    }

    const maxCount = Math.max(...categoryData.map(c => c.count), 1);

    container.innerHTML = categoryData.map(category => `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 500;">${category.name}</span>
                <span style="color: var(--primary-light); font-weight: 600;">${category.count}</span>
            </div>
            <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    height: 100%;
                    width: ${(category.count / maxCount) * 100}%;
                    transition: width 0.3s ease;
                "></div>
            </div>
        </div>
    `).join('');
}

function renderRecentActivity() {
    const requests = StorageManager.getRequests();
    const equipment = StorageManager.getEquipment();

    // Get recent requests (last 5, sorted by updatedAt)
    const recentRequests = requests
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

    const container = document.getElementById('recent-activity');

    if (recentRequests.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No recent activity</p>';
        return;
    }

    container.innerHTML = recentRequests.map(request => {
        const eq = equipment.find(e => e.id === request.equipmentId);
        const stageText = request.stage.replace('-', ' ').toUpperCase();

        return `
            <div class="activity-item">
                <div style="font-weight: 500; margin-bottom: 0.25rem;">${request.subject}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">
                    ${eq ? eq.name : 'Unknown Equipment'} • ${stageText}
                </div>
                <div class="time">${utils.getRelativeTime(request.updatedAt)}</div>
            </div>
        `;
    }).join('');
}

// Export dashboard functions
window.dashboard = {
    render: renderDashboard,
    updateMetrics
};
