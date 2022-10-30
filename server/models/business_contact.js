const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
    {
    name: String,
    phone: String,
    email: String
    },
    {
        collection: "contact"
    }
)

module.exports.contactSchema = mongoose.model("Contact", contactSchema);