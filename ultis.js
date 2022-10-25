const fs = require('fs');
const pathFile = './users.json';
/**
 * 
 * @param {number} userId find user by user id
 * @returns user or undefined if not found
 */
function getUserById(userId) {
    const rawData = fs.readFileSync(pathFile);
    const users = JSON.parse(Buffer.from(rawData).toString());
    return users.find(user => user.id === userId);
}

/**
 * 
 * @param {number} userId user for save key
 * @param {string} privateKey private key for totp
 * @returns boolean
 */
function savePrivateKey(userId, privateKey) {
    const rawData = fs.readFileSync(pathFile);
    const users = JSON.parse(Buffer.from(rawData).toString()).map(user => {
        if (user.id === userId) {
            return {
                ...user,
                private_key: privateKey,
            }
        } else return user;
    });
    fs.writeFile(pathFile, JSON.stringify(users, null, 2),()=>{
        
    })
}
/**
 * 
 * @param {*} userId userid for save OTP
 * @param {*} otp last otp
 */
function saveLastOTP(userId, otp) {
    const rawData = fs.readFileSync(pathFile);
    const users = JSON.parse(Buffer.from(rawData).toString()).map(user => {
        if (user.id === userId) {
            return {
                ...user,
                last_otp: otp,
            }
        } else return user;
    });
    fs.writeFile(pathFile, JSON.stringify(users, null, 2),()=>{
        
    })
}

module.exports = {
    getUserById,
    savePrivateKey,
    saveLastOTP,
}