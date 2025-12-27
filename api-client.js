// API Client for GearGuard Backend
// This file provides an abstraction layer for API calls

const API_URL = 'http://localhost:5000/api';

// Generic API call function
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Equipment API
const EquipmentAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/equipment${queryString ? '?' + queryString : ''}`);
    },

    getById: (id) => apiCall(`/equipment/${id}`),

    getRequests: (id) => apiCall(`/equipment/${id}/requests`),

    create: (data) => apiCall('/equipment', 'POST', data),

    update: (id, data) => apiCall(`/equipment/${id}`, 'PUT', data),

    delete: (id) => apiCall(`/equipment/${id}`, 'DELETE')
};

// Team API
const TeamAPI = {
    getAll: () => apiCall('/teams'),

    getById: (id) => apiCall(`/teams/${id}`),

    create: (data) => apiCall('/teams', 'POST', data),

    update: (id, data) => apiCall(`/teams/${id}`, 'PUT', data),

    delete: (id) => apiCall(`/teams/${id}`, 'DELETE')
};

// Request API
const RequestAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/requests${queryString ? '?' + queryString : ''}`);
    },

    getById: (id) => apiCall(`/requests/${id}`),

    getAnalytics: () => apiCall('/requests/analytics/dashboard'),

    create: (data) => apiCall('/requests', 'POST', data),

    update: (id, data) => apiCall(`/requests/${id}`, 'PUT', data),

    delete: (id) => apiCall(`/requests/${id}`, 'DELETE')
};

// Export API client
window.API = {
    Equipment: EquipmentAPI,
    Team: TeamAPI,
    Request: RequestAPI
};

// Example usage:
// const equipment = await API.Equipment.getAll();
// const team = await API.Team.create({ name: 'New Team', members: ['John'] });
// const analytics = await API.Request.getAnalytics();
