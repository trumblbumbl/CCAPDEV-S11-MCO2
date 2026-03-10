const bcrypt = require("bcrypt");
require("./config/db"); // connect to MongoDB
const User = require("./models/User");
const Comment = require("./models/Comment");

async function seedUsers() {
    try {
        console.log("Seeding users...");

        await User.deleteMany({});
        await Comment.deleteMany({});

        const password123 = await bcrypt.hash("password123", 10);
        const admin123 = await bcrypt.hash("admin123", 10);

        const users = [
            {
                email: "juan.delacruz@dlsu.edu.ph",
                password: password123,
                userType: "student",
                firstName: "Juan",
                lastName: "Dela Cruz",
                studentId: "12345678",
                college: "College of Computer Studies",
                profileImage: "/assets/default-profile.png"
            },
            {
                email: "maria.santos@dlsu.edu.ph",
                password: password123,
                userType: "student",
                firstName: "Maria",
                lastName: "Santos",
                studentId: "87654321",
                college: "College of Computer Studies",
                profileImage: "/assets/default-profile.png"
            },
            {
                email: "john.lim@dlsu.edu.ph",
                password: password123,
                userType: "student",
                firstName: "John",
                lastName: "Lim",
                studentId: "11223344",
                college: "College of Computer Studies",
                profileImage: "/assets/default-profile.png"
            },
            {
                email: "au@dlsu.edu.ph",
                password: password123,
                userType: "organization",
                orgName: "Archers for UNICEF",
                description: "Student volunteer organization",
                tagline: "Always for the women and children",
                president: "Cherubim Citco",
                orgType: "Volunteer Organization",
                logo: "/assets/au_logo1.png"
            },
            {
                email: "admin@orgspace.dlsu.edu.ph",
                password: admin123,
                userType: "admin"
            }
        ];

        await User.insertMany(users);

        const seededUsers = await User.find();

        const juan  = seededUsers.find(u => u.email === "juan.delacruz@dlsu.edu.ph");
        const maria = seededUsers.find(u => u.email === "maria.santos@dlsu.edu.ph");
        const john  = seededUsers.find(u => u.email === "john.lim@dlsu.edu.ph");
        const au    = seededUsers.find(u => u.email === "au@dlsu.edu.ph");

        await Comment.insertMany([
            // POST 1 (3 comments)
            { text: "I joined one of your outreach events last term and it was really fulfilling.", user: juan._id, page: "org1", post: "post1" },
            { text: "Love the mission of this org! Hoping to volunteer soon.", user: maria._id, page: "org1", post: "post1" },
            { text: "Thanks to everyone who participated in our last project! 💚", user: au._id, page: "org1", post: "post1" },

            // POST 2 (2 comments)
            { text: "The workshops organized here are actually really helpful.", user: john._id, page: "org1", post: "post2" },
            { text: "Glad to see more students getting involved in volunteer work.", user: au._id, page: "org1", post: "post2" },

            // POST 3 (2 comments)
            { text: "Looking forward to the next event announcement!", user: maria._id, page: "org1", post: "post3" },
            { text: "This org has such a great community.", user: juan._id, page: "org1", post: "post3" }
        ]);

        console.log("Users and comments seeded successfully.");
        process.exit();

    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
}

seedUsers();
