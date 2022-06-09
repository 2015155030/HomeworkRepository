const express = require('express');
const ejs = require('ejs');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

var path = require('path');
app.use(express.static(path.join(__dirname, '/')));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/hello', function (req, res) {
//   res.render('hello', { name: req.query.nameQuery });
// });

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

// 첫번째 파라미터 "/"에 전달된 HTTP GET request에 응답
// app.get('/', (req, res) => {
//   res.render('index');
// });

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

// 라우트 추가 (인터넷의 주소에 대응, "/"의 경우에는 root 페이지를 뜻함)
app.get('/', function (req, res) {
  const query = `SELECT * FROM product`;
  db.all(query, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('index', { model: row });
  });
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.get('/login', function (req, res) {
  res.render('login');
});

const insertQuery = `
  CREATE TABLE IF NOT EXISTS person(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(20),
    user_password VARCHAR(20)
  )
`;

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('서버가 실행되었습니다.');
  console.log(`서버주소: http://localhost:${PORT}`);
});
