// login simulation to test (replace w hardcoded values later)
// const isLoggedIn = true;
// const userRole = "org"; // "student" "org" "admin"
// const currentUser = "org-au";

// ===== AUTHENTICATION SYSTEM =====
class AuthSystem {
    constructor() {
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        this.validateExistingSession();
    }

    validateExistingSession() {
        const storedUser = sessionStorage.getItem('orgspace_user');
        const storedType = sessionStorage.getItem('orgspace_userType');
        const storedTime = sessionStorage.getItem('orgspace_session_time');
        
        if (storedUser && storedType && storedTime) {
            const sessionAge = Date.now() - parseInt(storedTime);
            
            if (sessionAge > this.SESSION_TIMEOUT) {
                this.clearSession();
                return { isLoggedIn: false };
            }
            
            return {
                isLoggedIn: true,
                user: JSON.parse(storedUser),
                userType: storedType
            };
        }
        
        this.clearSession();
        return { isLoggedIn: false };
    }

    clearSession() {
        sessionStorage.removeItem('orgspace_user');
        sessionStorage.removeItem('orgspace_userType');
        sessionStorage.removeItem('orgspace_session_time');
    }

    createSession(user, userType) {
        sessionStorage.setItem('orgspace_user', JSON.stringify(user));
        sessionStorage.setItem('orgspace_userType', userType);
        sessionStorage.setItem('orgspace_session_time', Date.now().toString());
        
        this.scheduleSessionTimeout();
    }

    scheduleSessionTimeout() {
        setTimeout(() => {
            const storedTime = sessionStorage.getItem('orgspace_session_time');
            if (storedTime) {
                const sessionAge = Date.now() - parseInt(storedTime);
                if (sessionAge > this.SESSION_TIMEOUT) {
                    this.clearSession();
                    if (window.location.pathname.includes('profile-') || 
                        window.location.pathname.includes('admin')) {
                        window.location.href = "/login";
                    }
                }
            }
        }, this.SESSION_TIMEOUT + 5000);
    }

    login(email, password, userType) {
        if (!email || !password || !userType) {
            return { 
                success: false, 
                message: 'All fields are required' 
            };
        }

        // Use hardcoded credentials for demo
        const demoCredentials = {
            'student': [
            { email: 'juan.delacruz@dlsu.edu.ph', password: 'password123' },
            { email: 'maria.santos@dlsu.edu.ph', password: 'password123' },
            { email: 'john.lim@dlsu.edu.ph', password: 'password123' }
            ],
            'organization': { email: 'au@dlsu.edu.ph', password: 'password123' },
            'admin': { email: 'admin@orgspace.dlsu.edu.ph', password: 'admin123' }
        };

        // Check if credentials match
        if (userType === 'student') {
        // Check if email and password match any student credentials
        const studentCred = demoCredentials.student.find(cred => 
            email === cred.email && password === cred.password
        );
        
        if (studentCred) {
            const user = this.createDemoUser(userType, email);
            this.createSession(user, userType);
            return {
                success: true,
                userType: userType,
                user: user
            };
        }
    } else if (demoCredentials[userType] && 
               email === demoCredentials[userType].email && 
               password === demoCredentials[userType].password) {
        
        // Create user object
        const user = this.createDemoUser(userType, email);
        this.createSession(user, userType);
        
        return {
            success: true,
            userType: userType,
            user: user
        };
    }
    
    return { 
        success: false, 
        message: 'Invalid email or password' 
    };
}

    // Create demo user based on type
    createDemoUser(userType, email) {
        const baseUser = {
            email: email,
            id: `${userType.toUpperCase()}001`,
            sessionId: this.generateSessionId()
        };

        switch(userType) {
            case 'student':
                // Return different user data based on email
            if (email === 'juan.delacruz@dlsu.edu.ph') {
                return {
                    ...baseUser,
                    firstName: 'Juan',
                    lastName: 'Dela Cruz',
                    studentId: '12345678',
                    course: 'BS Computer Science',
                    yearLevel: 3,
                    profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn'
                };
            } else if (email === 'maria.santos@dlsu.edu.ph') {
                return {
                    ...baseUser,
                    firstName: 'Maria',
                    lastName: 'Santos',
                    studentId: '87654321',
                    course: 'BS Business Management',
                    yearLevel: 2,
                    profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Maria'
                };
            } else if (email === 'john.lim@dlsu.edu.ph') {
                return {
                    ...baseUser,
                    firstName: 'John',
                    lastName: 'Lim',
                    studentId: '11223344',
                    course: 'BS Information Systems',
                    yearLevel: 4,
                    profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=John'
                };
            }
            // Default student
            return {
                ...baseUser,
                firstName: 'Student',
                lastName: 'User',
                studentId: '00000000',
                course: 'General Studies',
                yearLevel: 1,
                profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Student'
            };
            case 'organization':
                return {
                    ...baseUser,
                    orgName: 'Archers for UNICEF',
                    description: 'Archers for UNICEF is a DLSU-based organization committed to supporting UNICEF initiatives and empowering students to advocate for women and children\'s rights through meaningful events, partnerships, and outreach programs.',
                    profileImage: 'assets/AU_logo1.png'
                };
            case 'admin':
                return {
                    ...baseUser,
                    firstName: 'Admin',
                    lastName: 'System',
                    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
                };
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logout() {
        this.clearSession();
        return { success: true, message: 'Logged out successfully' };
    }

    getCurrentUser() {
        return this.validateExistingSession();
    }

    isLoggedIn() {
        const session = this.validateExistingSession();
        return session.isLoggedIn;
    }

    verifySession() {
        const session = this.validateExistingSession();
        if (!session.isLoggedIn) {
            this.clearSession();
        }
        return session;
    }
}

const auth = new AuthSystem();

// ===== AUTH GUARD =====
const AuthGuard = {
    // Check if user can access a page
    requireAuth: function(expectedUserType = null) {
        if (typeof auth === 'undefined') {
            console.error('Auth system not loaded');
            return {
                allowed: false,
                redirect: '/login',
                error: 'Authentication system error'
            };
        }
        
        const userInfo = auth.getCurrentUser();
        
        if (!userInfo.isLoggedIn) {
            return {
                allowed: false,
                redirect: '/login',
                error: 'Please log in to access this page'
            };
        }
        
        if (expectedUserType && userInfo.userType !== expectedUserType) {
            let redirectPage = '/';
            
            switch(userInfo.userType) {
                case 'student':
                    redirectPage = '/profile-student';
                    break;
                case 'organization':
                    redirectPage = '/profile-organization';
                    break;
                case 'admin':
                    redirectPage = '/profile-admin';
                    break;
            }
            
            return {
                allowed: false,
                redirect: redirectPage,
                error: `Access denied. This page is for ${expectedUserType} accounts only.`
            };
        }
        
        return {
            allowed: true,
            userInfo: userInfo
        };
    },
    
    // Protect a page
    protectPage: function(expectedUserType = null) {
        const result = this.requireAuth(expectedUserType);
        
        if (!result.allowed) {
            if (result.error) {
                console.error('AuthGuard:', result.error);
                alert(result.error);
            }
            window.location.href = result.redirect;
            return null;
        }
        
        return result.userInfo;
    },
    
    isAuthenticated: function() {
        if (typeof auth === 'undefined') return false;
        return auth.isLoggedIn();
    },
    
    getCurrentUser: function() {
        if (typeof auth === 'undefined') return { isLoggedIn: false };
        return auth.getCurrentUser();
    }
};

//FOR ORG PAGE
document.addEventListener("DOMContentLoaded", async () => {

let session = { isLoggedIn: false };

async function checkSession() {
  const res = await fetch("/session");
  session = await res.json();
}

await checkSession();

const isLoggedIn = session.isLoggedIn;
const userRole = session.userType;
const currentUser = session.user?.email || null;

const pageOrg = document.body.dataset.org;

const isOrgOwner =
    userRole === "organization" &&
    currentUser === pageOrg;

const canManagePosts =
    userRole === "admin" || isOrgOwner;

let displayName = "Guest";

document.querySelectorAll(".org-post").forEach(post => {
    const addCommentBox = post.querySelector(".add-comment");
    const warning = post.querySelector(".login-warning");

    if (isLoggedIn) {
        addCommentBox?.classList.remove("hidden");
        warning?.classList.add("hidden");
    } else {
        addCommentBox?.classList.add("hidden");
        warning?.classList.remove("hidden");
    }
});


if (isLoggedIn && session.user) {
    if (userRole === "student") {
        displayName = `${session.user.firstName} ${session.user.lastName}`;
    } else if (userRole === "organization") {
        displayName = session.user.orgName;
    } else if (userRole === "admin") {
        displayName = `${session.user.firstName} ${session.user.lastName}`;
    }
}
    //lightbox
    const lightbox = document.getElementById("js-lightbox");
    const lightboxImg = lightbox?.querySelector("img");
    const closeLightbox = lightbox?.querySelector(".js-lightbox-close");

    function attachLightbox(img) {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove("hidden");
        });
    }

    document.querySelectorAll(".lightbox-trigger").forEach(attachLightbox);

    closeLightbox?.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightboxImg.src = "";
    });

    lightbox?.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            lightboxImg.src = "";
        }
    });

    // post visibility
    document.querySelectorAll(".org-post").forEach(post => {
        const actions = post.querySelector(".post-actions");
        if (!actions) return;

        actions.classList.add("hidden");

        if (canManagePosts) {
            actions.classList.remove("hidden");
        }
    });
    
    //edit/delete post
    function applyPostLogic(post) {
        const editBtn = post.querySelector(".edit-post-btn");
        const deleteBtn = post.querySelector(".delete-post-btn");
        const actions = post.querySelector(".post-actions");
        const content = post.querySelector(".post-content");

        if (content) {
            content.classList.add("clamp");

        const viewMoreBtn = document.createElement("button");
        viewMoreBtn.className = "view-more-btn";
        viewMoreBtn.textContent = "See more";

        const commentToggle = post.querySelector(".comment-toggle");

        if (commentToggle) {
            post.insertBefore(viewMoreBtn, commentToggle);
        } else {
            content.after(viewMoreBtn);
        }

        viewMoreBtn.addEventListener("click", () => {
            const isExpanded = content.classList.contains("expanded");

            content.classList.toggle("expanded");
            content.classList.toggle("clamp");

            viewMoreBtn.textContent = isExpanded ? "See more" : "See less";
        });

        setTimeout(() => {
            if (content.scrollHeight <= content.clientHeight) {
                viewMoreBtn.style.display = "none";
                }
            }, 50);
        }
   

        // enforce permissions
        if (!canManagePosts) {
            actions?.classList.add("hidden");
        }

        editBtn?.addEventListener("click", () => {
            const editing = content.isContentEditable;
            content.contentEditable = !editing;
            editBtn.textContent = editing ? "Edit" : "Save";
            content.classList.toggle("editing");
        });

        deleteBtn?.addEventListener("click", () => {
            if (confirm("Delete this post?")) {
                post.remove();
            }
        });

        // comment toggle
        const toggle = post.querySelector(".comment-toggle");
        const comments = post.querySelector(".comments");

        toggle?.addEventListener("click", () => {
            comments.classList.toggle("hidden");
            toggle.textContent = comments.classList.contains("hidden")
                ? "View comments"
                : "Hide comments";
        });
    }

    document.querySelectorAll(".org-post").forEach(applyPostLogic);

    //comment permissions
    function applyCommentPermissions(comment) {
        const owner = comment.dataset.owner;
        const actions = comment.querySelector(".comment-actions");
        const editBtn = comment.querySelector(".edit-comment-btn");
        const deleteBtn = comment.querySelector(".delete-comment-btn");
        const text = comment.querySelector(".comment-text");

        if (!actions) return;

        actions.classList.add("hidden");

        if (isLoggedIn && (owner === currentUser || userRole === "admin")) {
            actions.classList.remove("hidden");
        }
        
        editBtn?.addEventListener("click", () => {
            const editing = text.isContentEditable;
            text.contentEditable = !editing;
            editBtn.textContent = editing ? "Edit" : "Save";
            text.classList.toggle("editing");
        });

        deleteBtn?.addEventListener("click", () => {
            if (confirm("Delete this comment?")) {
                comment.remove();
            }
        });
    }

    document.querySelectorAll(".comment").forEach(applyCommentPermissions);
    
    //create post
    const createBtn = document.getElementById("create-post-btn");
    const modal = document.getElementById("create-post-modal");
    const submitPost = document.getElementById("submit-post");
    const cancelPost = document.getElementById("cancel-post");

    const titleInput = document.getElementById("new-post-title");
    const contentInput = document.getElementById("new-post-content");
    const imageInput = document.getElementById("new-post-image");

    const postsContainer = document.querySelector(".org-posts");

    if (canManagePosts) {
        createBtn?.classList.remove("hidden");
    }

    // open modal
    createBtn?.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // cancel modal
    cancelPost?.addEventListener("click", () => {
        modal.classList.add("hidden");
        titleInput.value = "";
        contentInput.value = "";
        imageInput.value = "";
    });

    // submit post
    submitPost?.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) {
            alert("Title and content are required.");
            return;
        }

        // If user selected image from device
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                createPost(e.target.result, title, content);
            };

            reader.readAsDataURL(imageInput.files[0]);
        } else {
            createPost("", title, content);
        }
    });

    // actual post creation function
    function createPost(imageSrc, title, content) {

        const post = document.createElement("article");
        post.className = "org-post";

        post.innerHTML = `
            ${imageSrc ? `<img src="${imageSrc}" class="post-image lightbox-trigger">` : ""}

            <div class="post-header">
                <h3>${title}</h3>
                <div class="post-actions ${canManagePosts ? "" : "hidden"}">
                    <button class="edit-post-btn">Edit</button>
                    <button class="delete-post-btn">Delete</button>
                </div>
            </div>

            <span class="post-date">Just now</span>

            <div class="post-content">${content}</div>

            <button class="comment-toggle">View comments</button>

            <div class="comments hidden"></div>

            <div class="add-comment hidden">
                <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                <button class="submit-comment">Post</button>
            </div>

            <p class="login-warning hidden">Log in to add a comment.</p>
        `;

        postsContainer.prepend(post);

        applyPostLogic(post);

        // Apply comment visibility + submission logic to this new post
        const addCommentBox = post.querySelector(".add-comment");
        const warning = post.querySelector(".login-warning");
        const submitBtn = post.querySelector(".submit-comment");
        const textarea = post.querySelector(".comment-input");
        const commentsContainer = post.querySelector(".comments");

        if (isLoggedIn) {
            addCommentBox?.classList.remove("hidden");
            warning?.classList.add("hidden");
        } else {
            addCommentBox?.classList.add("hidden");
            warning?.classList.remove("hidden");
        }

        submitBtn?.addEventListener("click", () => {
            const text = textarea.value.trim();
            if (!text) return;

            const comment = document.createElement("div");
            comment.className = "comment";
            comment.dataset.owner = currentUser;

            comment.innerHTML = `
                <strong>${displayName}</strong>
                <p class="comment-text">${text}</p>
                <div class="comment-actions hidden">
                    <button class="edit-comment-btn">Edit</button>
                    <button class="delete-comment-btn">Delete</button>
                </div>
            `;

            commentsContainer.appendChild(comment);
            textarea.value = "";

            applyCommentPermissions(comment);
        });


        post.querySelectorAll(".lightbox-trigger").forEach(attachLightbox);

        // reset modal
        modal.classList.add("hidden");
        titleInput.value = "";
        contentInput.value = "";
        imageInput.value = "";
    }
    });

// END OF ORG PAGE

// FOR MENU


const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

function renderProfileMenu() {
    profileDropdown.innerHTML = "";

    fetch("/session")
    .then(res => res.json())
    .then(session => {


    if (session.isLoggedIn) {
        profileDropdown.innerHTML= `
        <li><button type="button" id="profBtn">Profile</button></li>
        <li><button type="button" id="signOutBtn">Sign Out</button></li>
        `;

    document.getElementById("profBtn").addEventListener("click", () => {

    switch (session.userType) {
        case "student":
            window.location.href = "/profile-student";
            break;

        case "organization":
            window.location.href = "/profile-organization";
            break;

        case "admin":
            window.location.href = "/profile-admin";
            break;

        default:
            window.location.href = "/";
    }

});

        document.getElementById("signOutBtn").addEventListener("click", () => {
            auth.logout();
            closeProfileDropdown();
            renderProfileMenu();
            window.location.href = "/";
        });
    } else {
        profileDropdown.innerHTML = `
        <li><a href="/login">Sign In</a></li>
        `;
    }
})}; 

function toggleProfileDropdown() {
    profileDropdown.classList.toggle("open");
}

function closeProfileDropdown() {
    profileDropdown.classList.remove("open");
}

profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfileDropdown();
});

document.addEventListener("click", (e) => {
    if (!profileMenu?.contains(e.target)) {
        closeProfileDropdown();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
        closeProfileDropdown();
});

renderProfileMenu();

const orgLink = document.querySelector('a[href="#organizations"]');
const orgSection = document.getElementById("organizations");

if (orgLink && orgSection) {
  orgLink.addEventListener("click", (e) => {
    e.preventDefault();

    orgSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}
// END OF MENU

//------ START OF REVIEWS PAGE JS PORTION ------
document.addEventListener("DOMContentLoaded", () => {

    
    class Review {
        constructor(user, rating, comment, date = null) {
            this.user = user;
            this.rating = rating;
            this.comment = comment;
            this.date = date ? date : new Date().toLocaleDateString();
        }
    }

    const session = auth.getCurrentUser();
    const isLoggedIn = session.isLoggedIn;
    const reviewsContainer = document.getElementById("reviewsContainer");
    const loginWarning = document.getElementById("reviewsLoginWarning");

    if (!isLoggedIn) {
        reviewsContainer?.classList.add("hidden");
        loginWarning?.classList.remove("hidden");
    } else {
        reviewsContainer?.classList.remove("hidden");
        loginWarning?.classList.add("hidden");
    }


    let reviewUserName = null;

    if (isLoggedIn && session.user) {
        if (session.userType === "student") {
            reviewUserName = `${session.user.firstName} ${session.user.lastName}`;
        } else if (session.userType === "organization") {
            reviewUserName = session.user.orgName;
        } else if (session.userType === "admin") {
            reviewUserName = `${session.user.firstName} ${session.user.lastName}`;
        }
    }

    let selectedRating = 0;     // user star selection

    // all submitted reviews
    // includes sample reviews for now
    let reviews = [

        new Review("Lara Turk", 5,
            "Most fulfilling org experiences I’ve had in DLSU 💚",
            "02/01/2026"),

        new Review("Sam Sanchez", 4,
            "Super fun org!",
            "02/04/2026"),

        new Review("Ethan Guo", 3,
            "Good community and members :D",
            "02/10/2026"),

        new Review("Aya Pangan", 2,
            "It’s okay overall!",
            "02/15/2026"),

        new Review("Jane Doe", 1,
            "Could improve internal communication.",
            "02/16/2026")
    ];     

    let currentFilter = "all";  // current star filter 

    const stars = document.querySelectorAll("#starRating span");  // list of stars
    const reviewText = document.getElementById("reviewText");     // user review textbox
    const reviewsList = document.getElementById("reviewsList");   // display wall of reviews

    const currentUserEl = document.getElementById("currentUser");

    if (isLoggedIn && reviewUserName) {
        currentUserEl.textContent = reviewUserName;
    } else {
        currentUserEl.textContent = "Guest";
    }

    // -- Handle star clicks
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = star.dataset.value;
            updateStars(selectedRating);
        });
    });

    // -- Fill effect for stars
    function updateStars(rating) {
        stars.forEach(star => {
            star.classList.toggle("active", star.dataset.value <= rating);
        });
    }

    // -- Submit review
    document.getElementById("submitReview").addEventListener("click", () => {

        if (!isLoggedIn) {
            alert("You must be logged in to leave a review.");
            return;
        }

        // validation for empty review
        if (!selectedRating || reviewText.value.trim() === "") {
            alert("You cannot leave a review empty. Please provide a review.");
            return;
        }

        // review object format
        const review = new Review(
            reviewUserName,
            Number(selectedRating),
            reviewText.value
        );

        // add review to list and update 
        reviews.push(review);
        renderReviews();

        // reset review form
        selectedRating = 0;
        updateStars(0);
        reviewText.value = "";
    });

    // -- Render review
    function renderReviews() {

        // erase all reviews
        reviewsList.innerHTML = "";

        // show all reviews or filtered reviews by stars
        let filteredReviews;
        if (currentFilter === "all") {
            filteredReviews = reviews;
        } else {
            filteredReviews = reviews.filter(function (review) {
                return review.rating === Number(currentFilter);
            });
        }

        // add each review into page
        filteredReviews.forEach(review => {
            const div = document.createElement("div");
            div.className = "review-item";

            div.innerHTML = `
                <strong>${review.user}</strong> • <span>${review.date}</span>
                <div class="review-stars">${"★".repeat(review.rating)}</div>
                <p>${review.comment}</p>
            `;

            reviewsList.appendChild(div);
        });

        updateAverageRating();
    }

    // -- Average Rating Calculation
    function updateAverageRating() {
        const avgEl = document.getElementById("averageRating");    // avg num of stars
        const starsEl = document.getElementById("averageStars");   // star icons 
        const totalEl = document.getElementById("totalReviews");   // total reviews

        // validation if no reviews
        if (reviews.length === 0) {
            avgEl.textContent = "0.0";
            starsEl.innerHTML = "";
            totalEl.textContent = "(0 reviews)";
            return;
        }

        // total stars of all reviews
        let total = 0;
        for (let i = 0; i < reviews.length; i++) {
            total = total + reviews[i].rating;
        }

        // get stars average of all reviews
        const average = (total / reviews.length).toFixed(1);

        // update ui 
        avgEl.textContent = average;
        starsEl.innerHTML = "★".repeat(Math.round(average));
        totalEl.textContent = `(${reviews.length} reviews)`;
    }

    // -- Star Filter Buttons
    const filterButtons = document.querySelectorAll(".rating-filters button");   // all filter buttons
    for (let i = 0; i < filterButtons.length; i++) {

        const button = filterButtons[i]; // each single filter button

        button.addEventListener("click", function () {

            // remove active on all buttons
            for (let j = 0; j < filterButtons.length; j++) {
                filterButtons[j].classList.remove("active");
            }

            // add active on clicked button and update reviews based on filter
            button.classList.add("active");
            currentFilter = button.getAttribute("data-filter");
            renderReviews();
        });
    }

    renderReviews();

});
//------ END OF REVIEWS PAGE JS PORTION ------