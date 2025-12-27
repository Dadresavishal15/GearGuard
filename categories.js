// Equipment Categories Management

function renderCategories() {
    const categories = StorageManager.getCategories();
    const container = document.getElementById('categories-list');

    if (categories.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                <h3>No Categories Yet</h3>
                <p>Create your first equipment category to get started</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="categories-grid">
            ${categories.map(cat => `
                <div class="category-card" onclick="editCategory('${cat.id}')">
                    <div class="category-header">
                        <h3>${cat.name}</h3>
                        <span class="category-badge">${getEquipmentCountByCategory(cat.name)} items</span>
                    </div>
                    <div class="category-info">
                        <div class="info-row">
                            <span class="info-label">Responsible:</span>
                            <span>${cat.responsible || 'Unassigned'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Company:</span>
                            <span>${cat.company || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getEquipmentCountByCategory(categoryName) {
    const equipment = StorageManager.getEquipment();
    return equipment.filter(eq => eq.category === categoryName).length;
}

function editCategory(categoryId) {
    const category = StorageManager.getCategories().find(c => c.id === categoryId);

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = categoryId ? 'Edit Category' : 'New Category';

    modalBody.innerHTML = `
        <form id="category-form" onsubmit="saveCategory(event, '${categoryId || ''}')">
            <div class="form-group">
                <label class="form-label">Category Name *</label>
                <input type="text" class="form-input" name="name" value="${category?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Responsible Person</label>
                <input type="text" class="form-input" name="responsible" value="${category?.responsible || ''}" placeholder="Person in charge of this category">
            </div>
            
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input" name="company" value="${category?.company || ''}">
            </div>
            
            <div class="form-actions">
                ${categoryId ? `<button type="button" class="btn btn-danger" onclick="deleteCategory('${categoryId}')">Delete</button>` : ''}
                <button type="submit" class="btn btn-primary">Save Category</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

function saveCategory(event, categoryId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (categoryId) {
        StorageManager.updateCategory(categoryId, data);
    } else {
        const newCategory = new Category(data);
        StorageManager.addCategory(newCategory);
    }

    closeModal();
    renderCategories();
}

function deleteCategory(categoryId) {
    const category = StorageManager.getCategories().find(c => c.id === categoryId);
    const equipmentCount = getEquipmentCountByCategory(category.name);

    if (equipmentCount > 0) {
        if (!confirm(`This category has ${equipmentCount} equipment items. Are you sure you want to delete it? Equipment will be uncategorized.`)) {
            return;
        }
    } else {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }
    }

    StorageManager.deleteCategory(categoryId);
    closeModal();
    renderCategories();
}

// Export categories functions
window.categories = {
    render: renderCategories,
    edit: editCategory
};
