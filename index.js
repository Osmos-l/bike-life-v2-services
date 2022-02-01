const express = require('express');
const cors = require('cors');
const app = express();

const run = async () => {
    require('dotenv').config();

    await require('./database').run();

    app.use(cors());
    app.use(express.json());

    const authRoutes = require('./routes/auth.route');
    app.use('/api/auth', authRoutes);

    app.listen(process.env.PORT)
    console.log(`Server is running on port ${process.env.PORT}`);
}


try {
    run();
} catch (e) {
    console.error(e);
}
