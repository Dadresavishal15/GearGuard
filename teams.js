// Teams View Management

function renderTeams() {
    const teams = StorageManager.getTeams();
    const container = document.getElementById('teams-list');

    if (teams.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No teams found</p>';
        return;
    }

    container.innerHTML = teams.map(team => createTeamCard(team)).join('');
}

function createTeamCard(team) {
    const requests = StorageManager.getRequests().filter(r => r.teamId === team.id);

    return `
        <div class="team-card" onclick="editTeam('${team.id}')">
            <div class="team-name">${team.name}</div>
            
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    ${team.members.length} Members • ${requests.length} Requests
                </div>
            </div>
            
            <div class="team-members">
                ${team.members.map(member => `
                    <div class="member-tag">${member}</div>
                `).join('')}
            </div>
        </div>
    `;
}

function editTeam(teamId) {
    const team = StorageManager.getTeams().find(t => t.id === teamId);

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = teamId ? 'Edit Team' : 'New Team';

    modalBody.innerHTML = `
        <form id="team-form" onsubmit="saveTeam(event, '${teamId || ''}')">
            <div class="form-group">
                <label class="form-label">Team Name *</label>
                <input type="text" class="form-input" name="name" value="${team?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input" name="company" value="${team?.company || ''}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Team Members</label>
                <div style="margin-bottom: 0.5rem;">
                    <small style="color: var(--text-muted);">Enter one member per line</small>
                </div>
                <textarea class="form-textarea" name="members" rows="6">${team?.members?.join('\n') || ''}</textarea>
            </div>
            
            <div class="form-actions">
                ${teamId ? `<button type="button" class="btn btn-danger" onclick="deleteTeam('${teamId}')">Delete</button>` : ''}
                <button type="submit" class="btn btn-primary">Save Team</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

function saveTeam(event, teamId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        members: formData.get('members')
            .split('\n')
            .map(m => m.trim())
            .filter(m => m.length > 0)
    };

    if (teamId) {
        StorageManager.updateTeam(teamId, data);
    } else {
        const newTeam = new MaintenanceTeam(data);
        StorageManager.addTeam(newTeam);
    }

    closeModal();
    renderTeams();
}

function deleteTeam(teamId) {
    if (confirm('Are you sure you want to delete this team?')) {
        StorageManager.deleteTeam(teamId);
        closeModal();
        renderTeams();
    }
}

// Export teams functions
window.teams = {
    render: renderTeams,
    edit: editTeam
};
