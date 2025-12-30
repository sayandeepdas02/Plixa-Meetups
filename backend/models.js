// backend/models.js
// In-memory user storage (for development - replace with database in production)

const users = [];
let userIdCounter = 1;

const UserModel = {
    // Create a new user
    create: (userData) => {
        const user = {
            id: userIdCounter++,
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: userData.password, // Should be hashed before calling this
            dateOfBirth: userData.dateOfBirth,
            createdAt: new Date().toISOString(),
        };
        users.push(user);
        return user;
    },

    // Find user by email
    findByEmail: (email) => {
        return users.find(u => u.email === email.toLowerCase());
    },

    // Find user by ID
    findById: (id) => {
        return users.find(u => u.id === id);
    },

    // Get all users (for debugging)
    getAll: () => {
        return users;
    },

    // Remove password from user object
    sanitize: (user) => {
        if (!user) return null;
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
};

module.exports = UserModel;
