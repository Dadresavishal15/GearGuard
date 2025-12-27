// Utility Functions

// Date formatting
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
}

// Check if request is overdue
function isOverdue(request) {
    if (request.stage === 'repaired' || request.stage === 'scrap') return false;
    if (!request.scheduledDate) {
        // For corrective requests without scheduled date, check if created more than 3 days ago
        const createdDate = new Date(request.createdAt);
        const daysSinceCreated = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
        return daysSinceCreated > 3;
    }
    return new Date(request.scheduledDate) < new Date();
}

// Get status color
function getStatusColor(stage) {
    const colors = {
        'new': '#3b82f6',
        'in-progress': '#f59e0b',
        'repaired': '#10b981',
        'scrap': '#ef4444'
    };
    return colors[stage] || '#6366f1';
}

// Get priority stars
function getPriorityStars(priority) {
    return '⭐'.repeat(priority);
}

// Get initials from name
function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Search and filter helpers
function searchItems(items, searchTerm, fields) {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
        fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(term);
        })
    );
}

function groupBy(items, key) {
    return items.reduce((groups, item) => {
        const value = item[key] || 'Unassigned';
        if (!groups[value]) groups[value] = [];
        groups[value].push(item);
        return groups;
    }, {});
}

// Data aggregation for analytics
function getRequestsByStage() {
    const requests = StorageManager.getRequests();
    return {
        new: requests.filter(r => r.stage === 'new').length,
        'in-progress': requests.filter(r => r.stage === 'in-progress').length,
        repaired: requests.filter(r => r.stage === 'repaired').length,
        scrap: requests.filter(r => r.stage === 'scrap').length
    };
}

function getRequestsByTeam() {
    const requests = StorageManager.getRequests();
    const teams = StorageManager.getTeams();

    return teams.map(team => ({
        name: team.name,
        count: requests.filter(r => r.teamId === team.id).length
    }));
}

function getRequestsByCategory() {
    const requests = StorageManager.getRequests();
    const equipment = StorageManager.getEquipment();

    // Group requests by equipment category
    const categoryMap = {};

    requests.forEach(request => {
        const eq = equipment.find(e => e.id === request.equipmentId);
        const category = eq?.category || 'Uncategorized';

        if (!categoryMap[category]) {
            categoryMap[category] = 0;
        }
        categoryMap[category]++;
    });

    return Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
}

function getOpenRequestsCount() {
    const requests = StorageManager.getRequests();
    return requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap').length;
}

function getOverdueRequestsCount() {
    const requests = StorageManager.getRequests();
    return requests.filter(r => isOverdue(r)).length;
}

function getCriticalEquipmentCount() {
    const equipment = StorageManager.getEquipment();
    const requests = StorageManager.getRequests();

    // Equipment is critical if it has 3+ open requests or is marked as scrap
    return equipment.filter(eq => {
        if (eq.isScrap) return true;
        const openRequests = requests.filter(r =>
            r.equipmentId === eq.id &&
            r.stage !== 'repaired' &&
            r.stage !== 'scrap'
        );
        return openRequests.length >= 3;
    }).length;
}

function getTechnicianLoad() {
    const requests = StorageManager.getRequests();
    const activeRequests = requests.filter(r => r.stage === 'in-progress').length;
    const totalRequests = requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap').length;

    if (totalRequests === 0) return 0;
    return Math.round((activeRequests / totalRequests) * 100);
}

function getRequestsForEquipment(equipmentId) {
    const requests = StorageManager.getRequests();
    return requests.filter(r => r.equipmentId === equipmentId);
}

function getOpenRequestsForEquipment(equipmentId) {
    const requests = getRequestsForEquipment(equipmentId);
    return requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap');
}

// Calendar helpers
function getMonthData(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return {
        year,
        month,
        daysInMonth,
        startingDayOfWeek,
        firstDay,
        lastDay
    };
}

function getRequestsForDate(date) {
    const requests = StorageManager.getRequests();
    const dateStr = date.toISOString().split('T')[0];
    return requests.filter(r => r.scheduledDate === dateStr && r.type === 'preventive');
}

// Export utilities
window.utils = {
    formatDate,
    formatDateTime,
    getRelativeTime,
    isOverdue,
    getStatusColor,
    getPriorityStars,
    getInitials,
    searchItems,
    groupBy,
    getRequestsByStage,
    getRequestsByTeam,
    getRequestsByCategory,
    getOpenRequestsCount,
    getOverdueRequestsCount,
    getCriticalEquipmentCount,
    getTechnicianLoad,
    getRequestsForEquipment,
    getOpenRequestsForEquipment,
    getMonthData,
    getRequestsForDate
};
