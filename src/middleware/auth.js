//authentication 과정이 잘 되었는지 재확인 & client에 다시 보내주기
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async (req, res, next) => {
    //토큰을 request headers에서 가져오기
    const authHeader = req.headers['authorization'];

    //headers: Bearer dafsladsfaf.adsfasfaf.dsfadfaff
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.sendStatus(401);

    try {
        //토큰이 유효한지 확인
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        //해당 토큰의 유저가 존재하는지
        const user = await User.findOne({"_id": decode.userId});
        if(!user) {
            return res.status(400).send('없는 유저입니다.');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = auth;