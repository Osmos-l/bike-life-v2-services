const mongoose = require('mongoose');

exports.run = () => {
    let options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    let uri = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.lwcjw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    return mongoose.connect(uri, options);
}
