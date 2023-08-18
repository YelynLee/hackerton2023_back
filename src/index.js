const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

const corsOptions = {
origin: 'http://localhost:3000',
credentials: true
};

app.use(cors(corsOptions));
//서로 다른 origin도 통신이 되도록 cors라는 middleware를 express app에 등록

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

app.use(express.json());
//req.body의 순데이터를 가져오기 위함 -> express static을 client에 전달할 때 필요

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('연결 완료');
    })
    .catch(err => {
        console.error(err);
    });

/* app.get('/', (req, res, next) => {
    setImmediate(() => { next(new Error('it is an error')) });
    //res.send('Hello');
}); //아래의 오류 처리기가 잘 작동하는지 확인(동기+비동기) */

app.use('/users', require('./routes/users'));

app.use((error, req, res, next) => {
    res.status(err.status || 500);
    res.send(error.message || '서버에서 에러가 났습니다.');
}); //오류가 발생해도 서버가 다운되지 않고, error message만 나오도록


app.listen(port, () => {
    console.log(`${port}번에서 실행이 되었습니다.`);
});