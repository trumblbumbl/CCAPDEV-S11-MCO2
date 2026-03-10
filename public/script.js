async function getServerSession() {
    try {
        const res = await fetch("/session");
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch session:", error);
        return {
            isLoggedIn: false,
            userType: null,
            user: null
        };
    }
}

// =========================
// ORG PAGE
// =========================
document.addEventListener("DOMContentLoaded", async () => {
    const session = await getServerSession();

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

    if (isLoggedIn && session.user) {
        if (userRole === "student") {
            displayName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        } else if (userRole === "organization") {
            displayName = session.user.orgName || "Organization";
        } else if (userRole === "admin") {
            displayName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        }
    }

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

    // Lightbox
    const lightbox = document.getElementById("js-lightbox");
    const lightboxImg = lightbox?.querySelector("img");
    const closeLightbox = lightbox?.querySelector(".js-lightbox-close");

    function attachLightbox(img) {
        img.addEventListener("click", () => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightbox.classList.remove("hidden");
        });
    }

    document.querySelectorAll(".lightbox-trigger").forEach(attachLightbox);

    closeLightbox?.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        if (lightboxImg) lightboxImg.src = "";
    });

    lightbox?.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            if (lightboxImg) lightboxImg.src = "";
        }
    });

    // Post visibility
    document.querySelectorAll(".org-post").forEach(post => {
        const actions = post.querySelector(".post-actions");
        if (!actions) return;

        actions.classList.add("hidden");

        if (canManagePosts) {
            actions.classList.remove("hidden");
        }
    });

    function applyPostLogic(post) {
        const editBtn = post.querySelector(".edit-post-btn");
        const deleteBtn = post.querySelector(".delete-post-btn");
        const actions = post.querySelector(".post-actions");
        const content = post.querySelector(".post-content");

        if (content) {
            content.classList.add("clamp");

            const existingViewMoreBtn = post.querySelector(".view-more-btn");
            if (!existingViewMoreBtn) {
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
        }

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

    createBtn?.addEventListener("click", () => {
        modal?.classList.remove("hidden");
    });

    cancelPost?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        if (titleInput) titleInput.value = "";
        if (contentInput) contentInput.value = "";
        if (imageInput) imageInput.value = "";
    });

    submitPost?.addEventListener("click", () => {
        const title = titleInput?.value.trim();
        const content = contentInput?.value.trim();

        if (!title || !content) {
            alert("Title and content are required.");
            return;
        }

        if (imageInput?.files && imageInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                createPost(e.target.result, title, content);
            };

            reader.readAsDataURL(imageInput.files[0]);
        } else {
            createPost("", title, content);
        }
    });

    function createPost(imageSrc, title, content) {
        if (!postsContainer) return;

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

        modal?.classList.add("hidden");
        if (titleInput) titleInput.value = "";
        if (contentInput) contentInput.value = "";
        if (imageInput) imageInput.value = "";
    }
});

// =========================
// MENU
// =========================
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

function renderProfileMenu() {
    if (!profileDropdown) return;

    profileDropdown.innerHTML = "";

    fetch("/session")
        .then(res => res.json())
        .then(session => {
            if (session.isLoggedIn) {
                profileDropdown.innerHTML = `
                    <li><button type="button" id="profBtn">Profile</button></li>
                    <li><button type="button" id="signOutBtn">Sign Out</button></li>
                `;

                document.getElementById("profBtn")?.addEventListener("click", () => {
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

                document.getElementById("signOutBtn")?.addEventListener("click", () => {
                    closeProfileDropdown();
                    window.location.href = "/logout";
                });
            } else {
                profileDropdown.innerHTML = `
                    <li><a href="/login">Sign In</a></li>
                `;
            }
        })
        .catch(error => {
            console.error("Session check error:", error);
        });
}

function toggleProfileDropdown() {
    profileDropdown?.classList.toggle("open");
}

function closeProfileDropdown() {
    profileDropdown?.classList.remove("open");
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
    if (e.key === "Escape") {
        closeProfileDropdown();
    }
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

// =========================
// REVIEWS PAGE
// =========================
document.addEventListener("DOMContentLoaded", async () => {
    class Review {
        constructor(user, rating, comment, date = null) {
            this.user = user;
            this.rating = rating;
            this.comment = comment;
            this.date = date ? date : new Date().toLocaleDateString();
        }
    }

    const session = await getServerSession();
    const isLoggedIn = session.isLoggedIn;
    const reviewsContainer = document.getElementById("reviewsContainer");
    const loginWarning = document.getElementById("reviewsLoginWarning");

    if (!reviewsContainer && !loginWarning) return;

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
            reviewUserName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        } else if (session.userType === "organization") {
            reviewUserName = session.user.orgName || "Organization";
        } else if (session.userType === "admin") {
            reviewUserName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        }
    }

    let selectedRating = 0;
    let reviews = [
        new Review("Lara Turk", 5, "Most fulfilling org experiences I’ve had in DLSU 💚", "02/01/2026"),
        new Review("Sam Sanchez", 4, "Super fun org!", "02/04/2026"),
        new Review("Ethan Guo", 3, "Good community and members :D", "02/10/2026"),
        new Review("Aya Pangan", 2, "It’s okay overall!", "02/15/2026"),
        new Review("Jane Doe", 1, "Could improve internal communication.", "02/16/2026")
    ];

    let currentFilter = "all";

    const stars = document.querySelectorAll("#starRating span");
    const reviewText = document.getElementById("reviewText");
    const reviewsList = document.getElementById("reviewsList");
    const currentUserEl = document.getElementById("currentUser");

    if (currentUserEl) {
        currentUserEl.textContent = isLoggedIn && reviewUserName ? reviewUserName : "Guest";
    }

    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = star.dataset.value;
            updateStars(selectedRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            star.classList.toggle("active", star.dataset.value <= rating);
        });
    }

    document.getElementById("submitReview")?.addEventListener("click", () => {
        if (!isLoggedIn) {
            alert("You must be logged in to leave a review.");
            return;
        }

        if (!selectedRating || !reviewText?.value.trim()) {
            alert("You cannot leave a review empty. Please provide a review.");
            return;
        }

        const review = new Review(
            reviewUserName,
            Number(selectedRating),
            reviewText.value
        );

        reviews.push(review);
        renderReviews();

        selectedRating = 0;
        updateStars(0);
        reviewText.value = "";
    });

    function renderReviews() {
        if (!reviewsList) return;

        reviewsList.innerHTML = "";

        const filteredReviews = currentFilter === "all"
            ? reviews
            : reviews.filter(review => review.rating === Number(currentFilter));

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

    function updateAverageRating() {
        const avgEl = document.getElementById("averageRating");
        const starsEl = document.getElementById("averageStars");
        const totalEl = document.getElementById("totalReviews");

        if (!avgEl || !starsEl || !totalEl) return;

        if (reviews.length === 0) {
            avgEl.textContent = "0.0";
            starsEl.innerHTML = "";
            totalEl.textContent = "(0 reviews)";
            return;
        }

        let total = 0;
        for (let i = 0; i < reviews.length; i++) {
            total += reviews[i].rating;
        }

        const average = (total / reviews.length).toFixed(1);

        avgEl.textContent = average;
        starsEl.innerHTML = "★".repeat(Math.round(average));
        totalEl.textContent = `(${reviews.length} reviews)`;
    }

    const filterButtons = document.querySelectorAll(".rating-filters button");
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.getAttribute("data-filter");
            renderReviews();
        });
    });

    renderReviews();
});