const express = require('express');
const cors = require('cors');
const app = express();

const run = async () => {
    require('dotenv').config();

    await require('./database').run();

    app.use(cors({credentials: true, origin: 'http://localhost:3000'}));



    app.use(function(req, res, next) {
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.header('Access-Control-Allow-Credentials', true);
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    });

    app.use(express.json());

    const authRoutes = require('./routes/auth.route');
    app.use('/api/auth', authRoutes);

    const bikeRoutes = require('./routes/bike.route');
    app.use('/api/bike', bikeRoutes);

    app.listen(process.env.PORT);
    console.log(`Server is running on port ${process.env.PORT}`);
}


try {
    run();
} catch (e) {
    console.error(e);
}
