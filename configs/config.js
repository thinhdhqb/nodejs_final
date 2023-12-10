require('dotenv').config()

module.exports = {
    mongo_db: process.env.MONGO_DB,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}