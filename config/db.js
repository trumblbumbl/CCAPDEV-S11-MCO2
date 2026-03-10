const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/orgspace")
    .then(() => {
        console.log("Database connected.");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });
