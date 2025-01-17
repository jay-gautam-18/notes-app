const express = require('express');
const fs = require('fs');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  fs.readdir('./files', {withFileTypes: true}, (err, files) => {
    
    res.render('home', {files});
  });
});

// GET route to display the create note form
app.get('/notes', (req, res) => {
    let filename = req.params.filename
    res.render('note',{filename});
});

// POST route to handle form submission
app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    // Write the file to the files directory
    fs.writeFile(`./files/${title}.txt`, content, (err) => {
        if(err) throw err;
        res.redirect('/');
    }); 
});

app.get('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    fs.unlink(`./files/${filename}`, (err) => {
        if(err) throw err;
        res.redirect('/');
    });
})
app.get('/show/:filename', function(req, res){
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) throw err;
        res.render('show', {filename: req.params.filename, content: data});
    });
})
app.get('/edit/:filename', function(req, res){
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) throw err;
        res.render('update', {filename: req.params.filename, content: data});
    });
})
app.post('/update/:filename', function(req, res) {
    const filename = req.params.filename;
    const content = req.body.filedata;
    
    // Check if content exists
    if (!content) {
        return res.status(400).send('Content is required');
    }
    
    fs.writeFile(`./files/${filename}`, content, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Error updating file');
        }
        res.redirect('/');
    });
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});