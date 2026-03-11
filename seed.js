const bcrypt = require("bcrypt");
require("./config/db"); // connect to MongoDB
const User = require("./models/User");
const Comment = require("./models/Comment");
const Review = require("./models/Review");
const Post = require("./models/Post");

async function seedData() {
    try {
        console.log("Seeding users, comments and reviews...");

        await User.deleteMany({});
        await Comment.deleteMany({});
        await Review.deleteMany({});
        await Post.deleteMany({});

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
                userType: "admin", 
                firstName: "Admin",
                lastName: "User" 
            }
        ];

        await User.insertMany(users);

        const seededUsers = await User.find();

        const juan  = seededUsers.find(u => u.email === "juan.delacruz@dlsu.edu.ph");
        const maria = seededUsers.find(u => u.email === "maria.santos@dlsu.edu.ph");
        const john  = seededUsers.find(u => u.email === "john.lim@dlsu.edu.ph");
        const au    = seededUsers.find(u => u.email === "au@dlsu.edu.ph");

        // Create sample posts for AU
        const posts = [
            {
                title: "2nd General Assembly",
                content: `Let us fly beyond the ordinary! 💫 

                The crew is calling, and Archers for UNICEF is ready to welcome its AUdventurers! ⚓️ 
                Take flight beyond the familiar and step into a journey where every voice matters, every dreamer counts, and every adventure inspires. Fly into the unknown, and let purpose guide your way! 🌟 

                Join us for the 2nd General Assembly: Finding HAUme in Neverland on January 21, 2026, from 4:00 PM to 6:00 PM at Br. Andrew Gonzales Hall 1103. Explore new lands, find your new crew, and discover how your heart and ideas can shape something magical. 🧚‍♀️ 

                ✨Don't miss the adventure by pre-registering here: bit.ly/AU_2ndGA_Pre-Reg 
                Your wings are ready… It's time to find your way home! 🗺️ 

                #TimeToFly 
                #FindingHAUmeinNeverland 
                #ArchersForUNICEF

                Pub by Brent Lim 
                Caption by Giliana Intalan 
                **Walk-ins are allowed for limited slots only. 
                As per CSO-PNP Approved: OPA-03116`,
                organization: au._id,
                image: "/assets/AU_2ndGA.jpg"
            },
            {
                title: "World Children's Day",
                content: `"A person's a person, no matter how small" - Dr. Seuss🤗

                This World Children's Day, we celebrate the wonder, curiosity, and joy that children bring to our communities. 👧 Their voices, their questions, their laughter — each reminds us of the importance of nurturing safe spaces where their dreams can grow. 🌱

                Now, let us be reminded that every small voice matters, because it's their day, their rights, and their opportunity to shape the world around them. 🗣️🌎

                To know more about World Children's Day, you may visit the links below:
                🔗https://www.unicef.org/parenting/world-childrens-day-toolkit
                🔗https://www.un.org/en/observances/world-childrens-day
                🔗https://www.who.int/.../20-11-2019-world-children-s-day...
                🔗https://www.unicef.org/.../focus-children-climate-change...

                #MyDayMyRights #WorldChildrensDay #MonthlyMAUtters
                #ArchersForUNICEF
                Pub by Clara Nicdao
                Caption by Wyonna Quiambao
                As per CSO-PNP Approved: OPA-02738`,
                organization: au._id,
                image: "/assets/AU_WCD.jpg"
            },
            {
                title: "MAUgic in Motion: Unleashing the Powers Within",
                content: `Good news, guiding spirits! 🧙🏻‍♀️ 

                🌲 In the forest, an unknown power calls and reaches out to you. It's your time to guide the hands of adventurers destined to awaken their inner magic and set it in motion. 

                Take part in MAUgic in Motion: Unleashing the Powers Within, where you'll lead our young adventurers through a world of imagination, teamwork, and wonder. 💜 Help others discover the power they never knew they had. 🧚🏻‍♀️

                🕯 Be the guiding light for our young dreamers on November 22, 2025, from 10:00 AM to 12:00 PM at John Gokongwei Building, G104-105, as they journey through tales that sparkle and adventures that awaken the mAUgic within. 💫

                🪄Step forward and claim your role as a facilitator by following these steps:
                1️⃣ Prove your magical potential by filling out the Eligibility Form: bit.ly/MaMoEligibilityForms
                2️⃣ Once your eligibility is confirmed, sign up here: bit.ly/MaMo-PreRegForm
                The forest has chosen you, it's time to let your light lead the way! 🌙

                #TheMAUgicBegins #MAUgicinMotion
                #ArchersForUnicef
                Pub by Khyra Villorente
                Caption by Giliana Intalan
                As per CSO-PNP Approved: OPA-02320`,
                organization: au._id,
                image: "/assets/AU_MAUgic.jpg"
            }
        ];

        const createdPosts = await Post.insertMany(posts);
        console.log(`✅ Created ${createdPosts.length} posts`);

        // Update comments to reference posts
        await Comment.deleteMany({}); // Clear old comments

        await Comment.insertMany([
            // Post 1 comments (MAUgic in Motion)
            { text: "I joined one of your outreach events last term and it was really fulfilling.", user: juan._id, page: "org1", post: createdPosts[2]._id },
            { text: "Love the mission of this org! Hoping to volunteer soon.", user: maria._id, page: "org1", post: createdPosts[2]._id },
            { text: "Thanks to everyone who participated in our last project! 💚", user: au._id, page: "org1", post: createdPosts[2]._id },
            
            // Post 2 comments (World Children's Day)
            { text: "The workshops organized here are actually really helpful.", user: john._id, page: "org1", post: createdPosts[1]._id },
            { text: "Glad to see more students getting involved in volunteer work.", user: au._id, page: "org1", post: createdPosts[1]._id },
            
            // Post 3 comments (2nd General Assembly)
            { text: "Looking forward to the next event announcement!", user: maria._id, page: "org1", post: createdPosts[0]._id },
            { text: "This org has such a great community.", user: juan._id, page: "org1", post: createdPosts[0]._id }
        ]);

        // insert the following review data
        await Review.insertMany([

            // AU
            { user: john._id,  org: "org1", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org1", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org1", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org1", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org1", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // CSO
            { user: john._id,  org: "org2", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org2", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org2", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org2", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org2", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // ISO
            { user: john._id,  org: "org3", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org3", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org3", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org3", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org3", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // LSCS
            { user: john._id,  org: "org4", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org4", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org4", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org4", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org4", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // MAFIA
            { user: john._id,  org: "org5", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org5", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org5", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org5", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org5", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

        ]);

        console.log("Users, comments and reviews seeded successfully.");
        process.exit();

    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
}

seedData();
