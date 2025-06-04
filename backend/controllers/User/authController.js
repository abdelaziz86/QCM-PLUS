const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

exports.register = async (req, res) => {
    const { nom, prenom, societe, email, password, role, profile_picture } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
        return res.status(400).json({ msg: "Missing fields" });
    }

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ msg: "Email already exists" });

        const hashedPassword = bcrypt.hashSync(password, 10);
        await User.create({ nom, prenom, societe, email, password: hashedPassword, role, profile_picture });

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ msg: "Invalid credentials" });

        const match = bcrypt.compareSync(password, user.password);
        if (!match) return res.status(401).json({ msg: "Incorrect password" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                societe: user.societe,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};
