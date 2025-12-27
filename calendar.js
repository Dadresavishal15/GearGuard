// Calendar View Management

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    updateCalendarHeader();
    renderCalendarGrid();
}

function updateCalendarHeader() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calendar-month-year').textContent =
        `${monthNames[currentMonth]} ${currentYear}`;
}

function renderCalendarGrid() {
    const container = document.getElementById('calendar-grid');
    const monthData = utils.getMonthData(currentYear, currentMonth);

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = dayHeaders.map(day =>
        `<div class="calendar-day-header">${day}</div>`
    ).join('');

    // Previous month days
    const prevMonthData = utils.getMonthData(currentYear, currentMonth - 1);
    const prevMonthDays = prevMonthData.daysInMonth;

    for (let i = monthData.startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const date = new Date(currentYear, currentMonth - 1, day);
        html += createCalendarDay(day, date, true);
    }

    // Current month days
    for (let day = 1; day <= monthData.daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        html += createCalendarDay(day, date, false);
    }

    // Next month days
    const totalCells = monthData.startingDayOfWeek + monthData.daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days

    for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(currentYear, currentMonth + 1, day);
        html += createCalendarDay(day, date, true);
    }

    container.innerHTML = html;
}

function createCalendarDay(day, date, isOtherMonth) {
    const requests = utils.getRequestsForDate(date);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    return `
        <div class="calendar-day ${isOtherMonth ? 'other-month' : ''}" 
             onclick="handleDateClick('${date.toISOString().split('T')[0]}')"
             style="${isToday ? 'border: 2px solid var(--primary);' : ''}">
            <div class="day-number" style="${isToday ? 'color: var(--primary-light); font-weight: 700;' : ''}">${day}</div>
            <div class="calendar-events">
                ${requests.map(req => {
        const equipment = StorageManager.getEquipment().find(e => e.id === req.equipmentId);
        return `
                        <div class="calendar-event" title="${req.subject} - ${equipment?.name || 'Unknown'}">
                            ${req.subject}
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
}

function handleDateClick(dateStr) {
    // Open new request form with pre-filled date
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const equipment = StorageManager.getEquipment();
    const teams = StorageManager.getTeams();

    modalTitle.textContent = 'Schedule Preventive Maintenance';

    modalBody.innerHTML = `
        <form id="request-form" onsubmit="saveRequest(event, '')">
            <div class="form-group">
                <label class="form-label">Subject *</label>
                <input type="text" class="form-input" name="subject" placeholder="e.g., Monthly Preventive Check" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Equipment *</label>
                <select class="form-select" name="equipmentId" id="equipment-select" onchange="handleEquipmentChange()" required>
                    <option value="">Select Equipment</option>
                    ${equipment.map(eq => `
                        <option value="${eq.id}" 
                                data-team="${eq.teamId}" 
                                data-category="${eq.category}"
                                data-technician="${eq.technicianId}">
                            ${eq.name} (${eq.serialNumber})
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <input type="hidden" name="type" value="preventive">
            <input type="hidden" name="stage" value="new">
            
            <div class="form-group">
                <label class="form-label">Team</label>
                <select class="form-select" name="teamId" id="team-select">
                    <option value="">Select Team</option>
                    ${teams.map(team => `
                        <option value="${team.id}">${team.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Technician</label>
                <input type="text" class="form-input" name="technicianId" id="technician-input">
            </div>
            
            <div class="form-group">
                <label class="form-label">Scheduled Date *</label>
                <input type="date" class="form-input" name="scheduledDate" value="${dateStr}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-select" name="priority">
                    <option value="1">⭐ Low</option>
                    <option value="2" selected>⭐⭐ Medium</option>
                    <option value="3">⭐⭐⭐ High</option>
                </select>
            </div>
            
            <input type="hidden" name="duration" value="0">
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Schedule Maintenance</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Event listeners
document.getElementById('prev-month')?.addEventListener('click', previousMonth);
document.getElementById('next-month')?.addEventListener('click', nextMonth);

// Export calendar functions
window.calendar = {
    render: renderCalendar
};
