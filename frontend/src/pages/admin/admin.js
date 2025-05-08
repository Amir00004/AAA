import api from "../../api";


export const getAllUsers = async () => {
    const response = await api.get("/api/users/admin/users/");
    return response.data;
};

export const getUser = async (userId) => {
    const response = await api.get(`/api/users/admin/users/${userId}/`);
    return response.data;
};


export const updateUser = async (userId, userData) => {
    const response = await api.put(`/api/users/admin/users/${userId}/update/`, userData);
    return response.data;
};


export const deleteUser = async (userId) => {
    const response = await api.delete(`/api/users/admin/users/${userId}/delete/`);
    return response.data;
};
