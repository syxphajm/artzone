// src/services/authService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth"; 

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Đăng ký thất bại");

        return data;
    } catch (error) {
        throw new Error(error.message || "Lỗi khi đăng ký");
    }
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại");

        localStorage.setItem("token", data.token);
        return data;
    } catch (error) {
        throw new Error(error.message || "Lỗi khi đăng nhập");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
};
