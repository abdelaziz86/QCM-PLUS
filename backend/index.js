const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // <-- THIS connects to the DB

const app = express();
app.use(cors());
app.use(express.json());

// Your routes here...
const authRoutes = require('./routes/User/authRoutes');
const userRoutes = require('./routes/User/userRoutes');
const questionnaireRoutes = require('./routes/Questionnaire/questionnaireRoutes');
const questionRoutes = require('./routes/Questionnaire/questionRoutes');
const historiqueRoutes = require('./routes/Historique/historique');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/historique', historiqueRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
