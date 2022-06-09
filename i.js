const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('./');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite3');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server started (http://localhost:3000/) !');
});

// 첫번째 파라미터 "/"에 전달된 HTTP GET request에 응답
app.get('/', (req, res) => {
  res.render('index');
});

async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'product.db',
    driver: sqlite3.Database,
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 추가 (인터넷의 주소에 대응, "/"의 경우에는 root 페이지를 뜻함)
app.get('/', async function (req, res) {
  let db = await getDBConnection();
  let rows = await db.all('select * from images');
  await db.close();
});

// JSON을 출력해주는 라우트
app.get('/posts', function (req, res) {
  res.json([
    { postId: 1, title: 'Hello' },
    { postId: 1, title: 'Hello' },
  ]);
});

app.get('/read-file', function (req, res) {
  console.log(req.query);

  if (!req.query?.file) {
    res.status(400).send('400 에러! file이 query parameters에 없습니다.');
    return;
  }

  fs.readFile(req.query.file, 'utf-8', async function (error, data) {
    if (error) {
      if (error.code == 'ENOENT') {
        res.status(400).send(`${req.query.file}이 없습니다.`);
      } else {
        res.status(500).send('500 서버 에러!');
      }
    } else {
      res.status(200).send(data.toString());
    }
  });
});

app.post('/write-file', function (req, res) {
  console.log(req.body);

  if (!req.body?.content) {
    res.status(400).send('400 에러! content가 post body에 없습니다.');
    return;
  }

  fs.writeFile('test.txt', req.body.content, function (error, data) {
    if (error) {
      res.status(500).send('500 서버 에러!');
    } else {
      res.status(201).send('파일 생성 성공');
    }
  });
});

// precess.env.PORT : 서버의 환경변수에 등록된 port 정보를 이용
const PORT = process.env.PORT || 8000;

// 서버가 PORT에 연결됐을 때 수행할 함수 정의
app.listen(PORT, () => {
  console.log('서버가 실행되었습니다.');
  console.log(`서버주소: http://localhost:${PORT}`);
});
