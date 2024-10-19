const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');  // For password hashing
const adminSchema = require('../models/admin');  // MongoDB user schema
const Post = require('../models/post'); // Import the Post model
// const addpost = require('../models/post')

const methodOverride = require('method-override');
router.use(methodOverride('_method'));




// Admin page route
router.get('/admin', (req, res) => {
    try {
        const text = { title: 'Admin Page', content: 'This is the admin page' };
        res.render('admin/index', { text, layout: 'layouts/admin.ejs' });
    } catch (error) {
        console.log(error);
    }
});






// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if both username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user in the database
        try {
            const newUser = await adminSchema.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'Registration successful', user: newUser });
            
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Username already exists' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Login Route
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await adminSchema.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Successful login - redirect to dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



//route for the dashboard

router.get('/dashboard', async(req,res)=>{
    try {
        const text={
            title:'dashboard',
            content:'this is the dashboard'

        }

        const data = await Post.find()
        res.render('admin/dashboard',{text,data})


    } catch (error) {
        console.log(error)
        
    }

})


//adding pannel

router.get('/add-post',async(req,res)=>{
    try {
        const text={
            title:'dashboard',
            content:'this is the dashboard'

        }

        const data = await Post.find()
        res.render('admin/addpost',{text,data})


    } catch (error) {
        console.log(error)
        
    }
})

// Add a new post (handle form submission)
router.post('/add-post', async (req, res) => {
    try {
        const { title, body } = req.body;

        // Validate that both fields are provided
        if (!title || !body) {
            return res.status(400).send('Title and body are required.');
        }

        // Create a new post and save it to the database
        const newPost = new Post({
            title,
            body,
        });

        await newPost.save();

        // Redirect back to the dashboard or posts page
        res.redirect('/dashboard');
    } catch (error) {
        console.log('Error saving post:', error);
        res.status(500).send('Server error, please try again.');
    }
});





// Route to display the edit form
router.get('/edit-post/:id', async (req, res) => {  
    try {
        const text={
            title:'edit page',
            content:"edit page"
        }
        const post = await Post.findById(req.params.id);  // Correct reference to Post model
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('admin/editpost', { post,text });  // Render the edit form
    } catch (error) {
        console.log('Error fetching post:', error);
        res.status(500).send('Server error');
    }
});

// Route to handle post update
router.post('/edit-post/:id', async (req, res) => {
    try {
        const { title, body } = req.body;

        // Find the post and update it
        await Post.findByIdAndUpdate(req.params.id, { title, body });

        // Redirect back to the dashboard or the post view
        res.redirect('/dashboard');
    } catch (error) {
        console.log('Error updating post:', error);
        res.status(500).send('Server error');
    }
});


router.delete('/delete-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Find and delete the post by ID
        await Post.findByIdAndDelete(postId);

        res.redirect('/dashboard');  // Redirect back to the dashboard
    } catch (error) {
        console.log('Error deleting post:', error);
        res.status(500).send('Server error');
    }
});

router.get('/contact',(req,res)=>
{
    const text={
        title:'contact page',
        body:'this is contact page'
    }
    res.render('admin/contact',{text})
})



module.exports = router;













