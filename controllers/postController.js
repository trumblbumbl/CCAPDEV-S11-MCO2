const Post = require("../models/Post");
const Comment = require("../models/Comment");

// ======================
// CREATE POST
// ======================
async function createPost(req, res) {
    try {
        // Check if user is an organization
        if (req.session.user.userType !== "organization") {
            return res.status(403).json({ error: "Only organizations can create posts" });
        }
        
        const { title, content, image, orgName } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        
        const newPost = new Post({
            title,
            content,
            image: image || "",
            organization: req.session.user.id
        });
        
        await newPost.save();
        
        // Check if request wants JSON (for AJAX calls)
        const wantsJson = req.xhr || 
                         (req.headers.accept && req.headers.accept.includes('json'));
        
        if (wantsJson) {
            return res.json({ 
                success: true, 
                post: newPost
            });
        }
        
        // Otherwise redirect (for form submissions)
        const orgPageMap = {
            'Archers for UNICEF': 'org1',
            'Council of Student Organizations': 'org2',
            'Information Security Organization': 'org3',
            'La Salle Computer Society': 'org4',
            'Management of Financial Institutions Association': 'org5'
        };
        
        const page = orgPageMap[orgName] || 'org1';
        res.redirect(`/${page}`);
        
    } catch (error) {
        console.error("Error creating post:", error);
        
        const wantsJson = req.xhr || 
                         (req.headers.accept && req.headers.accept.includes('json'));
        
        if (wantsJson) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).send("Error creating post");
        }
    }
}

// ======================
// EDIT POST
// ======================
async function editPost(req, res) {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).send("Post not found");
        }
        
        // Check if user owns this post or is admin
        if (post.organization.toString() !== req.session.user.id && 
            req.session.user.userType !== "admin") {
            return res.status(403).send("Unauthorized");
        }
        
        const { title, content, image, orgName } = req.body;
        
        post.title = title || post.title;
        post.content = content || post.content;
        if (image) post.image = image;
        
        await post.save();
        
        const orgPageMap = {
            'Archers for UNICEF': 'org1',
            'Council of Student Organizations': 'org2',
            'Information Security Organization': 'org3',
            'La Salle Computer Society': 'org4',
            'Management of Financial Institutions Association': 'org5'
        };
        
        const page = orgPageMap[orgName] || 'org1';
        res.redirect(`/${page}#post-${postId}`);
        
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).send("Error editing post");
    }
}

// ======================
// DELETE POST
// ======================
async function deletePost(req, res) {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).send("Post not found");
        }
        
        // Check if user owns this post or is admin
        if (post.organization.toString() !== req.session.user.id && 
            req.session.user.userType !== "admin") {
            return res.status(403).send("Unauthorized");
        }
        
        // Delete all comments associated with this post
        await Comment.deleteMany({ post: postId });
        
        // Delete the post
        await Post.findByIdAndDelete(postId);
        
        const { orgName } = req.body;
        const orgPageMap = {
            'Archers for UNICEF': 'org1',
            'Council of Student Organizations': 'org2',
            'Information Security Organization': 'org3',
            'La Salle Computer Society': 'org4',
            'Management of Financial Institutions Association': 'org5'
        };
        
        const page = orgPageMap[orgName] || 'org1';
        res.redirect(`/${page}`);
        
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Error deleting post");
    }
}

// ======================
// LIKE/UNLIKE POST
// ======================
async function toggleLike(req, res) {
    try {
        console.log('=== TOGGLE LIKE CALLED ===');
        const postId = req.params.postId;
        const userId = req.session.user.id;
        
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // Check if user already liked
        const likedIndex = post.likes.findIndex(like => like.toString() === userId.toString());
        
        if (likedIndex === -1) {
            // Like the post
            post.likes.push(userId);
        } else {
            // Unlike the post
            post.likes.splice(likedIndex, 1);
        }
        
        await post.save();
        
        res.json({ 
            likes: post.likes.length, 
            liked: likedIndex === -1 
        });
        
    } catch (error) {
        console.error("❌ Error toggling like:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPost,
    editPost,
    deletePost,
    toggleLike
};