const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/auth', auth, async (req, res) => { //auth(.js)라는 middleware를 넣고, 이로부터 req.user 값을 받음
    return res.json({ //인증이 재확인된 user data를 client에 재전송
         id: req.user._id,
         email: req.user.email,
         name: req.user.name,
         role: req.user.role,
         image: req.user.image
    })
});

//backend index.js에서 유저 데이터를 User Model을 통해 MongoDB에 저장 --> 유저에 관한 요청은 users.js에 정리
router.post('/signup', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => { //뒤에 catch 추가, await 오류 떠서 async 추가
    //req.body = email, password
    try {

        //해당 email의 user가 server's user collection에 있는지 확인
        const user = await User.findOne({ email: req.body.email }); //user collection에서 찾기

        if(!user) {
            return res.status(400).send("해당 이메일을 발견하지 못했습니다.");
        }

        //해당 user의 password가 올바른지 
        const isMatch = await user.comparePassword(req.body.password); //User.js에 선언된 comparePassword() 사용
        //req.body.password = plainPassword, isMatch에는 true or false 값이 들어옴

        if(!isMatch) {
            return res.status(400).send('비밀번호가 틀렸습니다.');
        }

        //email과 해당 password까지 모두 일치하면 token을 생성
        const payload = {
            userId: user._id.toHexString(), //DB의 id는 object이므로 string으로 변환
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res.json({ user, accessToken }) //Client에 전송, userSlice.js의 action.payload로 넣음

    } catch (error) {
        next(error)
    }
});

router.post('/logout', auth, async (res, next) => {
    try {
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

module.exports = router;