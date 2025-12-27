// Data Models and Storage Management

class Equipment {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || '';
        this.serialNumber = data.serialNumber || '';
        this.purchaseDate = data.purchaseDate || '';
        this.warranty = data.warranty || '';
        this.location = data.location || '';
        this.department = data.department || '';
        this.employee = data.employee || '';
        this.teamId = data.teamId || '';
        this.technicianId = data.technicianId || '';
        this.category = data.category || '';
        this.company = data.company || '';
        this.description = data.description || '';
        this.assignedDate = data.assignedDate || '';
        this.scrapDate = data.scrapDate || '';
        this.isScrap = data.isScrap || false;
    }
}

class MaintenanceTeam {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || '';
        this.members = data.members || [];
        this.company = data.company || '';
    }
}

class Category {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || '';
        this.responsible = data.responsible || '';
        this.company = data.company || '';
    }
}

class MaintenanceRequest {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.subject = data.subject || '';
        this.equipmentId = data.equipmentId || '';
        this.type = data.type || 'corrective'; // corrective or preventive
        this.stage = data.stage || 'new'; // new, in-progress, repaired, scrap
        this.scheduledDate = data.scheduledDate || '';
        this.duration = data.duration || 0;
        this.priority = data.priority || 1;
        this.technicianId = data.technicianId || '';
        this.teamId = data.teamId || '';
        this.company = data.company || '';
        this.notes = data.notes || '';
        this.instructions = data.instructions || '';
        this.comments = data.comments || []; // Worksheet comments
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
}

// Storage Manager
class StorageManager {
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getEquipment() {
        return this.get('equipment') || [];
    }

    static setEquipment(equipment) {
        this.set('equipment', equipment);
    }

    static getTeams() {
        return this.get('teams') || [];
    }

    static setTeams(teams) {
        this.set('teams', teams);
    }

    static getRequests() {
        return this.get('requests') || [];
    }

    static setRequests(requests) {
        this.set('requests', requests);
    }

    static addEquipment(equipment) {
        const items = this.getEquipment();
        items.push(equipment);
        this.setEquipment(items);
        return equipment;
    }

    static updateEquipment(id, updates) {
        const items = this.getEquipment();
        const index = items.findIndex(e => e.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.setEquipment(items);
            return items[index];
        }
        return null;
    }

    static deleteEquipment(id) {
        const items = this.getEquipment().filter(e => e.id !== id);
        this.setEquipment(items);
    }

    static addTeam(team) {
        const items = this.getTeams();
        items.push(team);
        this.setTeams(items);
        return team;
    }

    static updateTeam(id, updates) {
        const items = this.getTeams();
        const index = items.findIndex(t => t.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.setTeams(items);
            return items[index];
        }
        return null;
    }

    static deleteTeam(id) {
        const items = this.getTeams().filter(t => t.id !== id);
        this.setTeams(items);
    }

    static addRequest(request) {
        const items = this.getRequests();
        items.push(request);
        this.setRequests(items);
        return request;
    }

    static updateRequest(id, updates) {
        const items = this.getRequests();
        const index = items.findIndex(r => r.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
            this.setRequests(items);
            return items[index];
        }
        return null;
    }

    static deleteRequest(id) {
        const items = this.getRequests().filter(r => r.id !== id);
        this.setRequests(items);
    }

    static getCategories() {
        return this.get('categories') || [];
    }

    static setCategories(categories) {
        this.set('categories', categories);
    }

    static addCategory(category) {
        const items = this.getCategories();
        items.push(category);
        this.setCategories(items);
        return category;
    }

    static updateCategory(id, updates) {
        const items = this.getCategories();
        const index = items.findIndex(c => c.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.setCategories(items);
            return items[index];
        }
        return null;
    }

    static deleteCategory(id) {
        const items = this.getCategories().filter(c => c.id !== id);
        this.setCategories(items);
    }
}

// Initialize with sample data if empty
function initializeSampleData() {
    if (StorageManager.getTeams().length === 0) {
        const teams = [
            new MaintenanceTeam({ id: 'team1', name: 'Mechanics', members: ['John Doe', 'Jane Smith', 'Mike Johnson'] }),
            new MaintenanceTeam({ id: 'team2', name: 'Electricians', members: ['Sarah Williams', 'Tom Brown'] }),
            new MaintenanceTeam({ id: 'team3', name: 'IT Support', members: ['Alex Chen', 'Emily Davis', 'Chris Wilson'] })
        ];
        StorageManager.setTeams(teams);
    }

    if (StorageManager.getCategories().length === 0) {
        const categories = [
            new Category({ id: 'cat1', name: 'Manufacturing', responsible: 'John Doe', company: 'GearGuard Inc' }),
            new Category({ id: 'cat2', name: 'Computer', responsible: 'Alex Chen', company: 'GearGuard Inc' }),
            new Category({ id: 'cat3', name: 'Vehicle', responsible: 'Mike Johnson', company: 'GearGuard Inc' }),
            new Category({ id: 'cat4', name: 'Power', responsible: 'Sarah Williams', company: 'GearGuard Inc' }),
            new Category({ id: 'cat5', name: 'Server', responsible: 'Emily Davis', company: 'GearGuard Inc' })
        ];
        StorageManager.setCategories(categories);
    }

    if (StorageManager.getEquipment().length === 0) {
        const equipment = [
            new Equipment({
                id: 'eq1',
                name: 'CNC Machine #1',
                serialNumber: 'CNC-2023-001',
                purchaseDate: '2023-01-15',
                warranty: '2025-01-15',
                location: 'Factory Floor A',
                department: 'Production',
                employee: '',
                teamId: 'team1',
                technicianId: 'John Doe',
                category: 'Manufacturing'
            }),
            new Equipment({
                id: 'eq2',
                name: 'Laptop Dell XPS',
                serialNumber: 'DELL-2024-042',
                purchaseDate: '2024-03-10',
                warranty: '2027-03-10',
                location: 'Office 3rd Floor',
                department: 'IT',
                employee: 'Robert Martinez',
                teamId: 'team3',
                technicianId: 'Alex Chen',
                category: 'Computer'
            }),
            new Equipment({
                id: 'eq3',
                name: 'Generator Backup',
                serialNumber: 'GEN-2022-005',
                purchaseDate: '2022-06-20',
                warranty: '2024-06-20',
                location: 'Basement',
                department: 'Facilities',
                employee: '',
                teamId: 'team2',
                technicianId: 'Sarah Williams',
                category: 'Power'
            }),
            new Equipment({
                id: 'eq4',
                name: 'Forklift #3',
                serialNumber: 'FRK-2021-003',
                purchaseDate: '2021-09-05',
                warranty: '2023-09-05',
                location: 'Warehouse',
                department: 'Logistics',
                employee: '',
                teamId: 'team1',
                technicianId: 'Mike Johnson',
                category: 'Vehicle'
            }),
            new Equipment({
                id: 'eq5',
                name: 'Server Rack #2',
                serialNumber: 'SRV-2023-012',
                purchaseDate: '2023-11-01',
                warranty: '2028-11-01',
                location: 'Data Center',
                department: 'IT',
                employee: '',
                teamId: 'team3',
                technicianId: 'Emily Davis',
                category: 'Server'
            })
        ];
        StorageManager.setEquipment(equipment);
    }

    if (StorageManager.getRequests().length === 0) {
        const requests = [
            new MaintenanceRequest({
                id: 'req1',
                subject: 'Oil Leak Detected',
                equipmentId: 'eq1',
                type: 'corrective',
                stage: 'new',
                scheduledDate: '',
                duration: 0,
                priority: 3,
                technicianId: 'John Doe',
                teamId: 'team1',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new MaintenanceRequest({
                id: 'req2',
                subject: 'Screen Flickering Issue',
                equipmentId: 'eq2',
                type: 'corrective',
                stage: 'in-progress',
                scheduledDate: '',
                duration: 2,
                priority: 2,
                technicianId: 'Alex Chen',
                teamId: 'team3',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new MaintenanceRequest({
                id: 'req3',
                subject: 'Monthly Preventive Check',
                equipmentId: 'eq3',
                type: 'preventive',
                stage: 'new',
                scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                duration: 0,
                priority: 1,
                technicianId: 'Sarah Williams',
                teamId: 'team2'
            }),
            new MaintenanceRequest({
                id: 'req4',
                subject: 'Brake System Repair',
                equipmentId: 'eq4',
                type: 'corrective',
                stage: 'repaired',
                scheduledDate: '',
                duration: 5,
                priority: 3,
                technicianId: 'Mike Johnson',
                teamId: 'team1',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new MaintenanceRequest({
                id: 'req5',
                subject: 'Quarterly Server Maintenance',
                equipmentId: 'eq5',
                type: 'preventive',
                stage: 'new',
                scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                duration: 0,
                priority: 2,
                technicianId: 'Emily Davis',
                teamId: 'team3'
            }),
            new MaintenanceRequest({
                id: 'req6',
                subject: 'Overheating Problem',
                equipmentId: 'eq1',
                type: 'corrective',
                stage: 'new',
                scheduledDate: '',
                duration: 0,
                priority: 3,
                technicianId: 'John Doe',
                teamId: 'team1',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            })
        ];
        StorageManager.setRequests(requests);
    }
}

// Initialize on load
initializeSampleData();
