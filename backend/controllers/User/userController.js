const { User } = require('../../models');
const bcrypt = require('bcryptjs');

// ✅ CREATE user
exports.createUser = async (req, res) => {
    try {
        const { nom, prenom, societe, email, password, role, profile_picture } = req.body;

        if (!nom || !prenom || !email || !password || !role) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ msg: "Email already exists" });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await User.create({
            nom, prenom, societe, email, password: hashedPassword, role, profile_picture
        });

        res.status(201).json({ msg: "User created", user });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};

// ✅ READ all users (optionally filter by role)
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query;

        const where = {};
        if (role) {
            // Supports single role or comma-separated multiple roles (e.g., role=Admin,Stagiaire)
            const roles = role.split(',').map(r => r.trim());
            where.role = roles.length > 1 ? { [require('sequelize').Op.in]: roles } : roles[0];
        }

        const users = await User.findAll({ where });
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};

// ✅ READ one user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};

// ✅ UPDATE user
exports.updateUser = async (req, res) => {
    try {
        const { nom, prenom, societe, email, password, role, profile_picture } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ msg: "User not found" });

        await user.update({
            nom: nom || user.nom,
            prenom: prenom || user.prenom,
            societe: societe || user.societe,
            email: email || user.email,
            role: role || user.role,
            profile_picture: profile_picture || user.profile_picture,
            password: password ? bcrypt.hashSync(password, 10) : user.password
        });

        res.json({ msg: "User updated", user });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};

// ✅ DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        await user.destroy();
        res.json({ msg: "User deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};
