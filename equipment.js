// Equipment View Management

let currentFilter = 'all';
let currentSearch = '';

function renderEquipment() {
    const equipment = StorageManager.getEquipment();
    const container = document.getElementById('equipment-list');

    // Apply search
    let filtered = utils.searchItems(equipment, currentSearch, ['name', 'serialNumber', 'department', 'employee']);

    // Apply grouping
    if (currentFilter === 'department') {
        renderGroupedEquipment(filtered, 'department', container);
    } else if (currentFilter === 'employee') {
        renderGroupedEquipment(filtered, 'employee', container);
    } else {
        renderEquipmentGrid(filtered, container);
    }
}

function renderEquipmentGrid(equipment, container) {
    if (equipment.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No equipment found</p>';
        return;
    }

    container.innerHTML = equipment.map(eq => createEquipmentCard(eq)).join('');
}

function renderGroupedEquipment(equipment, groupKey, container) {
    const grouped = utils.groupBy(equipment, groupKey);

    container.innerHTML = Object.entries(grouped).map(([groupName, items]) => `
        <div style="grid-column: 1/-1; margin-top: 1.5rem;">
            <h3 style="color: var(--primary-light); margin-bottom: 1rem; font-size: 1.25rem;">
                ${groupName} (${items.length})
            </h3>
            <div class="equipment-grid">
                ${items.map(eq => createEquipmentCard(eq)).join('')}
            </div>
        </div>
    `).join('');
}

function createEquipmentCard(eq) {
    const openRequests = utils.getOpenRequestsForEquipment(eq.id);
    const teams = StorageManager.getTeams();
    const team = teams.find(t => t.id === eq.teamId);

    return `
        <div class="equipment-card" data-id="${eq.id}">
            <div class="equipment-header">
                <div>
                    <div class="equipment-name">${eq.name}</div>
                    <div class="equipment-serial">${eq.serialNumber}</div>
                </div>
                ${eq.isScrap ? '<span class="equipment-badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5;">SCRAP</span>' : ''}
            </div>
            
            <div class="equipment-info">
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span>${eq.category || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Department:</span>
                    <span>${eq.department || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span>${eq.location || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Team:</span>
                    <span>${team ? team.name : 'Unassigned'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Technician:</span>
                    <span>${eq.technicianId || 'Unassigned'}</span>
                </div>
            </div>
            
            <div class="equipment-actions">
                <button class="smart-button" onclick="viewEquipmentRequests('${eq.id}')">
                    📋 Maintenance
                    ${openRequests.length > 0 ? `<span class="badge">${openRequests.length}</span>` : ''}
                </button>
                <button class="btn btn-secondary" style="flex: 0;" onclick="editEquipment('${eq.id}')">✏️</button>
            </div>
        </div>
    `;
}

function viewEquipmentRequests(equipmentId) {
    const requests = utils.getRequestsForEquipment(equipmentId);
    const equipment = StorageManager.getEquipment().find(e => e.id === equipmentId);

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = `Maintenance History - ${equipment.name}`;

    if (requests.length === 0) {
        modalBody.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No maintenance requests found</p>';
    } else {
        modalBody.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${requests.map(req => `
                    <div style="
                        padding: 1rem;
                        background: var(--bg-tertiary);
                        border-radius: var(--radius-md);
                        border-left: 3px solid ${utils.getStatusColor(req.stage)};
                    ">
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${req.subject}</div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            Type: ${req.type} | Stage: ${req.stage} | Priority: ${utils.getPriorityStars(req.priority)}
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">
                            Created: ${utils.formatDate(req.createdAt)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    modal.classList.add('active');
}

function editEquipment(equipmentId) {
    const equipment = StorageManager.getEquipment().find(e => e.id === equipmentId);
    const teams = StorageManager.getTeams();

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = equipmentId ? 'Edit Equipment' : 'Add Equipment';

    modalBody.innerHTML = `
        <form id="equipment-form" onsubmit="saveEquipment(event, '${equipmentId || ''}')">
            <div class="form-group">
                <label class="form-label">Equipment Name *</label>
                <input type="text" class="form-input" name="name" value="${equipment?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Serial Number *</label>
                <input type="text" class="form-input" name="serialNumber" value="${equipment?.serialNumber || ''}" required>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Purchase Date</label>
                    <input type="date" class="form-input" name="purchaseDate" value="${equipment?.purchaseDate || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Warranty Until</label>
                    <input type="date" class="form-input" name="warranty" value="${equipment?.warranty || ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" name="category">
                    <option value="">Select Category</option>
                    <option value="Manufacturing" ${equipment?.category === 'Manufacturing' ? 'selected' : ''}>Manufacturing</option>
                    <option value="Computer" ${equipment?.category === 'Computer' ? 'selected' : ''}>Computer</option>
                    <option value="Vehicle" ${equipment?.category === 'Vehicle' ? 'selected' : ''}>Vehicle</option>
                    <option value="Power" ${equipment?.category === 'Power' ? 'selected' : ''}>Power</option>
                    <option value="Server" ${equipment?.category === 'Server' ? 'selected' : ''}>Server</option>
                    <option value="Other" ${equipment?.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Location</label>
                <input type="text" class="form-input" name="location" value="${equipment?.location || ''}">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Department</label>
                    <input type="text" class="form-input" name="department" value="${equipment?.department || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Assigned Employee</label>
                    <input type="text" class="form-input" name="employee" value="${equipment?.employee || ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Maintenance Team</label>
                <select class="form-select" name="teamId">
                    <option value="">Select Team</option>
                    ${teams.map(team => `
                        <option value="${team.id}" ${equipment?.teamId === team.id ? 'selected' : ''}>${team.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input" name="company" value="${equipment?.company || ''}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-input" name="description" rows="2" placeholder="Equipment description or notes...">${equipment?.description || ''}</textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Assigned Date</label>
                    <input type="date" class="form-input" name="assignedDate" value="${equipment?.assignedDate || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Default Technician</label>
                    <input type="text" class="form-input" name="technicianId" value="${equipment?.technicianId || ''}">
                </div>
            </div>
            
            <div class="form-actions">
                ${equipmentId ? `<button type="button" class="btn btn-danger" onclick="deleteEquipment('${equipmentId}')">Delete</button>` : ''}
                <button type="submit" class="btn btn-primary">Save Equipment</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

function saveEquipment(event, equipmentId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (equipmentId) {
        StorageManager.updateEquipment(equipmentId, data);
    } else {
        const newEquipment = new Equipment(data);
        StorageManager.addEquipment(newEquipment);
    }

    closeModal();
    renderEquipment();
}

function deleteEquipment(equipmentId) {
    if (confirm('Are you sure you want to delete this equipment?')) {
        StorageManager.deleteEquipment(equipmentId);
        closeModal();
        renderEquipment();
    }
}

// Event listeners
document.getElementById('equipment-search')?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderEquipment();
});

document.getElementById('equipment-filter')?.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderEquipment();
});

// Export equipment functions
window.equipment = {
    render: renderEquipment,
    edit: editEquipment,
    viewRequests: viewEquipmentRequests
};
