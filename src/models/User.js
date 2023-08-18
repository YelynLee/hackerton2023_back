const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 6, 
        unique: true
    },
    email: { //이메일 가입? 아이디 가입? //본인은 이메일이 더 좋은 것 같음!
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    }
})

userSchema.pre('save', async function(next) {
    let user = this;

    if(user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }

    next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
    let user = this; //database의 user data를 지목
    const match = await bcrypt.compare(plainPassword, user.password); //user가 입력한 password 그대로를 hash화 vs DB에 hashed된 password
    return match; //true or false
}

const User = mongoose.model("User", userSchema);

module.exports = User;