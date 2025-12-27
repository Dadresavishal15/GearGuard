// Requests View Management (Kanban Board)

let draggedRequest = null;

function renderRequests() {
    const requests = StorageManager.getRequests();
    const stages = ['new', 'in-progress', 'repaired', 'scrap'];

    stages.forEach(stage => {
        const stageRequests = requests.filter(r => r.stage === stage);
        const container = document.getElementById(`column-${stage}`);
        const countElement = document.getElementById(`count-${stage}`);

        countElement.textContent = stageRequests.length;

        if (stageRequests.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No requests</p>';
        } else {
            container.innerHTML = stageRequests.map(req => createRequestCard(req)).join('');
        }
    });

    // Setup drag and drop
    setupDragAndDrop();
}

function createRequestCard(request) {
    const equipment = StorageManager.getEquipment().find(e => e.id === request.equipmentId);
    const overdue = utils.isOverdue(request);

    return `
        <div class="request-card ${overdue ? 'overdue' : ''}" 
             draggable="true" 
             data-id="${request.id}"
             onclick="editRequest('${request.id}')">
            <div class="request-header">
                <div>
                    <div class="request-subject">${request.subject}</div>
                    <span class="request-type ${request.type}">${request.type.toUpperCase()}</span>
                </div>
            </div>
            
            <div class="request-info">
                ${equipment ? equipment.name : 'Unknown Equipment'}
                ${request.scheduledDate ? `<br>📅 ${utils.formatDate(request.scheduledDate)}` : ''}
                ${request.duration > 0 ? `<br>⏱️ ${request.duration}h` : ''}
            </div>
            
            <div class="request-footer">
                <div class="technician-avatar" title="${request.technicianId}">
                    ${utils.getInitials(request.technicianId)}
                </div>
                <div class="priority-stars">
                    ${utils.getPriorityStars(request.priority)}
                </div>
            </div>
        </div>
    `;
}

function setupDragAndDrop() {
    const cards = document.querySelectorAll('.request-card');
    const columns = document.querySelectorAll('.column-content');

    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedRequest = e.target.dataset.id;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.column-content').forEach(col => {
        col.style.background = '';
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
}

function handleDragLeave(e) {
    e.currentTarget.style.background = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';

    const newStage = e.currentTarget.parentElement.dataset.stage;

    if (draggedRequest && newStage) {
        // Confirm before scrapping
        if (newStage === 'scrap') {
            const request = StorageManager.getRequests().find(r => r.id === draggedRequest);
            const equipment = StorageManager.getEquipment().find(eq => eq.id === request?.equipmentId);

            const confirmScrap = confirm(
                `⚠️ WARNING: Moving to SCRAP will permanently mark "${equipment?.name || 'this equipment'}" as scrapped.\n\n` +
                `This action will:\n` +
                `• Mark the equipment as non-operational\n` +
                `• Remove it from active equipment lists\n\n` +
                `Are you sure you want to continue?`
            );

            if (!confirmScrap) {
                return; // Cancel the drop
            }
        }

        const updates = { stage: newStage };

        // If moving to scrap, mark equipment as scrap
        if (newStage === 'scrap') {
            const request = StorageManager.getRequests().find(r => r.id === draggedRequest);
            if (request && request.equipmentId) {
                StorageManager.updateEquipment(request.equipmentId, {
                    isScrap: true,
                    scrapDate: new Date().toISOString().split('T')[0]
                });
            }
        }

        StorageManager.updateRequest(draggedRequest, updates);
        renderRequests();
        dashboard.updateMetrics();
    }
}

function editRequest(requestId) {
    const request = StorageManager.getRequests().find(r => r.id === requestId);
    const equipment = StorageManager.getEquipment();
    const teams = StorageManager.getTeams();

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = requestId ? 'Edit Request' : 'New Request';

    modalBody.innerHTML = `
        <form id="request-form" onsubmit="saveRequest(event, '${requestId || ''}')">
            <div class="form-group">
                <label class="form-label">Subject *</label>
                <input type="text" class="form-input" name="subject" value="${request?.subject || ''}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Equipment *</label>
                <select class="form-select" name="equipmentId" id="equipment-select" onchange="handleEquipmentChange()" required>
                    <option value="">Select Equipment</option>
                    ${equipment.map(eq => `
                        <option value="${eq.id}" 
                                data-team="${eq.teamId}" 
                                data-category="${eq.category}"
                                data-technician="${eq.technicianId}"
                                ${request?.equipmentId === eq.id ? 'selected' : ''}>
                            ${eq.name} (${eq.serialNumber})
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-select" name="type">
                        <option value="corrective" ${request?.type === 'corrective' ? 'selected' : ''}>Corrective</option>
                        <option value="preventive" ${request?.type === 'preventive' ? 'selected' : ''}>Preventive</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Stage</label>
                    <select class="form-select" name="stage">
                        <option value="new" ${request?.stage === 'new' ? 'selected' : ''}>New</option>
                        <option value="in-progress" ${request?.stage === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="repaired" ${request?.stage === 'repaired' ? 'selected' : ''}>Repaired</option>
                        <option value="scrap" ${request?.stage === 'scrap' ? 'selected' : ''}>Scrap</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Team</label>
                <select class="form-select" name="teamId" id="team-select">
                    <option value="">Select Team</option>
                    ${teams.map(team => `
                        <option value="${team.id}" ${request?.teamId === team.id ? 'selected' : ''}>${team.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Technician</label>
                <input type="text" class="form-input" name="technicianId" id="technician-input" value="${request?.technicianId || ''}">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Scheduled Date</label>
                    <input type="date" class="form-input" name="scheduledDate" value="${request?.scheduledDate || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Duration (hours)</label>
                    <input type="number" class="form-input" name="duration" value="${request?.duration || 0}" min="0" step="0.5">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-select" name="priority">
                    <option value="1" ${request?.priority === 1 ? 'selected' : ''}>⭐ Low</option>
                    <option value="2" ${request?.priority === 2 ? 'selected' : ''}>⭐⭐ Medium</option>
                    <option value="3" ${request?.priority === 3 ? 'selected' : ''}>⭐⭐⭐ High</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input" name="company" value="${request?.company || ''}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea class="form-input" name="notes" rows="2" placeholder="Internal notes...">${request?.notes || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Instructions</label>
                <textarea class="form-input" name="instructions" rows="2" placeholder="Work instructions for technician...">${request?.instructions || ''}</textarea>
            </div>
            
            ${requestId ? `
                <div class="form-group">
                    <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); openWorksheet('${requestId}')" style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        📋 Worksheet & Comments (${request?.comments?.length || 0})
                    </button>
                </div>
            ` : ''}
            
            <div class="form-actions">
                ${requestId ? `<button type="button" class="btn btn-danger" onclick="deleteRequest('${requestId}')">Delete</button>` : ''}
                <button type="submit" class="btn btn-primary">Save Request</button>
            </div>
        </form>
    `;

    modal.classList.add('active');

    // Trigger auto-fill if editing existing request
    if (request?.equipmentId) {
        setTimeout(() => handleEquipmentChange(), 100);
    }
}

function handleEquipmentChange() {
    const select = document.getElementById('equipment-select');
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption && selectedOption.value) {
        const teamId = selectedOption.dataset.team;
        const technician = selectedOption.dataset.technician;

        // Auto-fill team
        if (teamId) {
            document.getElementById('team-select').value = teamId;
        }

        // Auto-fill technician
        if (technician) {
            document.getElementById('technician-input').value = technician;
        }
    }
}

function saveRequest(event, requestId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Convert priority to number
    data.priority = parseInt(data.priority);
    data.duration = parseFloat(data.duration);

    if (requestId) {
        StorageManager.updateRequest(requestId, data);
    } else {
        const newRequest = new MaintenanceRequest(data);
        StorageManager.addRequest(newRequest);
    }

    closeModal();
    renderRequests();
    dashboard.updateMetrics();
}

function deleteRequest(requestId) {
    if (confirm('Are you sure you want to delete this request?')) {
        StorageManager.deleteRequest(requestId);
        closeModal();
        renderRequests();
        dashboard.updateMetrics();
    }
}

// Worksheet & Comments Functions
function openWorksheet(requestId) {
    const request = StorageManager.getRequests().find(r => r.id === requestId);
    const equipment = StorageManager.getEquipment().find(e => e.id === request?.equipmentId);
    const userName = localStorage.getItem('userName') || 'Technician';

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = '📋 Worksheet & Comments';

    const comments = request?.comments || [];

    modalBody.innerHTML = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">${request.subject}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">Equipment: ${equipment?.name || 'Unknown'}</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Add Comment</label>
            <textarea id="comment-input" class="form-input" rows="3" placeholder="Enter work notes, observations, or updates..."></textarea>
        </div>
        
        <button type="button" class="btn btn-primary" onclick="addComment('${requestId}')" style="width: 100%; margin-bottom: 1.5rem;">
            ➕ Add Comment
        </button>
        
        <div style="border-top: 2px solid var(--border-color); padding-top: 1rem;">
            <h4 style="margin-bottom: 1rem; font-size: 1rem; color: var(--text-muted);">Comment History (${comments.length})</h4>
            <div id="comments-list" style="max-height: 300px; overflow-y: auto;">
                ${comments.length === 0 ?
            '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No comments yet. Add the first one!</p>' :
            comments.map((comment, index) => `
                        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border-left: 3px solid var(--primary-color);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600; color: var(--primary-color);">${comment.author}</span>
                                <span style="color: var(--text-muted); font-size: 0.85rem;">${utils.formatDateTime(comment.timestamp)}</span>
                            </div>
                            <div style="color: var(--text-color); white-space: pre-wrap;">${comment.text}</div>
                        </div>
                    `).reverse().join('')
        }
            </div>
        </div>
        
        <div class="form-actions" style="margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;

    modal.classList.add('active');
}

function addComment(requestId) {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('Please enter a comment');
        return;
    }

    const request = StorageManager.getRequests().find(r => r.id === requestId);
    const userName = localStorage.getItem('userName') || 'Technician';

    const newComment = {
        id: Date.now().toString(),
        author: userName,
        text: commentText,
        timestamp: new Date().toISOString()
    };

    const updatedComments = [...(request.comments || []), newComment];
    StorageManager.updateRequest(requestId, { comments: updatedComments });

    // Refresh the worksheet modal
    openWorksheet(requestId);
}

// Export requests functions
window.requests = {
    render: renderRequests,
    edit: editRequest
};
