// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();
var db = require('./models');

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////
//  DATA
///////////////////

// var books = [
//   {
//     _id: 15,
//     title: "The Four Hour Workweek",
//     author: "Tim Ferriss",
//     image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
//     release_date: "April 1, 2007"
//   },
//   {
//     _id: 16,
//     title: "Of Mice and Men",
//     author: "John Steinbeck",
//     image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
//     release_date: "Unknown 1937"
//   },
//   {
//     _id: 17,
//     title: "Romeo and Juliet",
//     author: "William Shakespeare",
//     image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
//     release_date: "Unknown 1597"
//   }
// ];


var newBookUUID = 18;







////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
    .populate('author')
    .exec(function(err, books) {
      if (err) {return console.log(`index error: ${err}`);}
      res.json(books);
  });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  var bookId = req.params.id;
  // find one book by its id
  db.Book.findOne({_id: bookId}, function (err, foundBook) {
    if (err) {return console.log(`book find error!`);}
      res.json(foundBook);
  });
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });

  //will only add an author to a book if the author already exists
  db.Author.findOne({name: req.body.author}, function(err, author) {
    newBook.author = author;
  //save new book in db
    newBook.save(function(err, book) {
      if (err) {return console.log(`could not create`);}
      res.json(book);
    });
  });
});

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  var bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOne({_id: bookId}, function(err, found) {
    if (err) {console.log(`that book was not found`);}
    //update the book's attrs
    found.title = req.body.title;
    found.author = req.body.author;
    found.image = req.body.image;
    found.releaseDate = req.body.releaseDate;

    //save updated book in db
    found.save(function(err, saved) {
      if (err) {console.log(`that was not saved properly`);}
      console.log(saved);
      res.json(saved);
    });

  });
});

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  var bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOneAndRemove({_id: bookId}, function(err, deleted) {
    if (err) {console.log(`could not delete`);}
  res.json(deleted);
  });
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
