const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/orgspace");

connect.then(() => {
    console.log("Database connected.");
}).catch(() => {
    console.error("Database connection error:");
});

const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["student", "organization", "admin"],
        required: true
    },
    firstName: {
        type: String,
        required: function () {
            return this.userType === "student";
        }
    },
    lastName: {
        type: String,
        required: function () {
            return this.userType === "student";
        }
    },
    studentId: {
        type: String,
        required: function () {
            return this.userType === "student";
        }
    },
    college: {
        type: String,
        required: function () {
            return this.userType === "student";
        }
    },
    orgName: {
        type: String,
        required: function () {
            return this.userType === "organization";
        }
    },
    description: {
        type: String,
        required: function () {
            return this.userType === "organization";
        }
    }
});

const collection = new mongoose.model("users", loginSchema);

module.exports = collection;