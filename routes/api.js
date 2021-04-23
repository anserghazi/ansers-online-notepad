const e = require('express');
const express = require('express');

const router = express.Router();

const BlogPost = require('../models/blogpost');


// Routes
router.get('/', (req, res) => {
    
    BlogPost.find({  })
        .then((data) => {
            console.log('Data: ' + data);
            res.json(data);
        })
        .catch((error) => {
            console.log('Error: ' + error);
        })
});


router.post('/save', (req, res) => {
    const data = req.body;

    const newBlogPost = new BlogPost(data);

    newBlogPost.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server error!'});
            return;
        } 

        return res.json({
            msg: 'Your data has been saved!'
        });   
    });
});

router.route('/:id').delete((req, res) => {
    BlogPost.findByIdAndDelete(req.params.id)
        .then(() => res.json('Exercise deleted.'))
        .catch(err => res.status(404).json('Error: ' + err));
});

router.route('/update/:id').put((req, res) => {
    BlogPost.findById(req.params.id)
        .then(BlogPost => {
            BlogPost.body = req.body.body;
            BlogPost.date = req.body.date;

            BlogPost.save()
                .then(() => res.json('Note updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});




module.exports = router;    