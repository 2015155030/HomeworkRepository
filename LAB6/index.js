const express = require('express');
const ejs = require('ejs');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const db = new sqlite3.Database(
  './product.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Successful connected to the database');
  }
);

var path = require('path');
app.use(express.static(path.join(__dirname, '/')));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/product/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM product WHERE product_id=?';
  db.get(sql, id, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.render('product', { model: row });
  });
});

app.post('/product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = [req.body.comment, id];
  const sql = 'UPDATE product SET product_comment=? WHERE (product_id = ?)';
  db.run(sql, comment, (err) => {
    if (err) {
      console.error('error', comment, err.message);
    }
    res.redirect('/');
  });
});

app.post('/category', (req, res) => {
  const category = req.body.category;
  const query = 'SELECT * FROM product WHERE (product_category = ?)';
  db.all(query, category, (err, row) => {
    if (err) {
      console.error('error', comment, err.message);
    }
    res.render('index', { model: row });
  });
});

app.get('/', function (req, res) {
  const query = `SELECT * FROM product`;

  db.all(query, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('index', { model: row });
  });
});

app.post('/', function (req, res) {
  if (req.params.category) {
    const category = req.params.category;
    console.log('here');
    const query = `SELECT * FROM product WHERE (product_category = ?)`;

    db.all(query, category, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render('index', { model: row });
    });
  } else {
    const query = `SELECT * FROM product`;

    db.all(query, [], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render('index', { model: row });
    });
  }
});

app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = [req.body.comment, id];
  const sql = 'UPDATE product SET product_comment=? WHERE (product_id = ?)';
  db.run(sql, comment, (err) => {
    if (err) {
      console.error('error', comment, err.message);
    }
  });
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.get('/login', function (req, res) {
  res.render('login');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('서버가 실행되었습니다.');
  console.log(`서버주소: http://localhost:${PORT}`);
});
