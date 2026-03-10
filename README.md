# CCAPDEV-S11-MCO

A centralized web application that serves as a unified platform for all DLSU organizations.

## Project Description

The system allows official organization accounts to create and manage their own profile and publish posts such as announcements and updates. In addition, students can actively engage with organizations by viewing posts, leaving comments, and submitting reviews. By consolidating organization content into a single platform, the system improves information accessibility, encourages interaction between students and organizations, and provides the student body with a reliable and centralized source of organization-related information. 

## Features

- View a list of school organizations
- Access organization profiles and descriptions
- Comment on posts of different organizations
- Updates on recruitment period
- Store organization data in a database
- Simple and user-friendly interface

## Project Structure
```
CCAPDEV-S11-MCO2/
├── config/                          ←---- database connection
│   └── db.js                        
├── controllers/                     ←---- website logic and coordinates models/views
│   ├── adminController.js           
│   ├── authController.js            
│   ├── commentController.js        
│   ├── orgController.js             
│   └── profileController.js         
├── middleware/                      ←---- functions for req-res cycle
│   └── authMiddleware.js            
├── models/                           ←---- database schemas
│   ├── Comment.js
│   └── User.js
├── node_modules/                     ←---- contains all installed dependencies
├── public/                           ←---- html, css, assets
├── routes/                           ←---- endpoints map to controller functions
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── orgRoutes.js
│   └── profileRoutes.js
├── views/                            ←---- front-end rendered by server and sent as html
├── package-lock.json                 ←---- 
├── package.json
├── README.md
├── seed.js                           ←---- populates with data
└── server.js    
```

## Prequisites and Technologies Used

- HTML
- CSS
- JavaScript
- MongoDB and Compass
- Node.js
- Npm


## Database Overview

The database stores information such as:
- Student logins:
- juan.delacruz@dlsu.edu.ph / password123
- maria.santos@dlsu.edu.ph / password123
- john.lim@dlsu.edu.ph / password123
  
- Org logins:
- au@dlsu.edu.ph / password123
  
- Admin login:
- admin@orgspace.dlsu.edu.ph / admin123

## How to Run the Project

Running in Windows

1. Clone the repository
```
git clone https://github.com/sxmsnchz/CCAPDEV-S11-MCO2.git
cd CCAPDEV-S11-MCO2
```

2. Install dependencies
- mongodb: https://www.mongodb.com/try/download/community
- npm, node.js: https://nodejs.org/en

3. Create Connection and Database in MongoDB
- You may need to edit connection string in /config/db.js

4. Run program
```
npm start
```


Running in WSL (Windows Subsystem for Linux)

1. Install dependencies
- prepare packages
```
sudo apt update && sudo apt upgrade -y
sudo apt install curl -y
```

- npm, node.js
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts
node -v
npm -v
```

- MongoDB
```
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod
mongod --version
```

- Compass (in Powershell terminal as Admin)
```
winget install --id=MongoDB.Compass.Full -e
```

2. Clone the repository
```
git clone https://github.com/sxmsnchz/CCAPDEV-S11-MCO2.git
cd CCAPDEV-S11-MCO2
```

3. Run MongoDB 
```
sudo systemctl start mongod
sudo systemctl status mongod
```
- Open Compass in PC and start connection

4. Run program
```
npm start
```

## Contributors

- [Ethan Guo](https://github.com/trumblbumbl)
- [Aaliyah Pangan](https://github.com/ayamerp)
- [Samantha Sanchez](https://github.com/sxmsnchz)
- [Lara Turk](https://github.com/larruuhh5)


## Notes

This project was developed for academic purposes and is not yet an official school system.
This project uses a local MongoDB database during development. The database is automatically populated with test accounts using the seed.js file.