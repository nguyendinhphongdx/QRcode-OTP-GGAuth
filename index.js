const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const express = require("express");
const bodyParser = require('body-parser');
const { getUserById, savePrivateKey, saveLastOTP } = require("./ultis");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})



app.get("/get-qr-code/:userId", async (req, res, next) => {
    // tồn tại
    if (!req.params.userId) return res.status(400).json({
        message: 'user not found',
    })
    const user = getUserById(Number(req.params.userId));
    // kiểm tra private
    if (user.private_key) return res.status(400).json({
        message: `${user.name} has already private key`
    })
    // tạo cặp key: ascii: private, base32: public
    const secretKey = speakeasy.generateSecret({
        name: user.name,
    })
    // lưu private key
    savePrivateKey(user.id, secretKey.ascii);
    //  share public key
    const dataBase64 = await qrcode.toDataURL(secretKey.otpauth_url);
    res.send(`<img src="${dataBase64}"/>`);
})


app.post("/validate-otp", (req, res, next) => {
    const { userId } = req.body;
    const token = Number(req.body.token);
    //  kiểm tra user
    const user = getUserById(Number(userId));
    if (!user || !user.private_key) return res.status(400).json({
        message: "User not found",
    });
    // xác thực otp và private key
    const verified = speakeasy.totp.verify({
        encoding: "ascii",
        secret: user.private_key,
        token: token
    })
    if (verified) {
        if (token === user.last_otp) {
            return res.status(400).json({
                message: "Token expired",
            })
        } else saveLastOTP(user.id, token);
    }
    res.json({
        verify: verified
    })
})

