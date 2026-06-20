import CryptoJS from "crypto-js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const saltRounds = 12;

export const generateRandomPassword = (min = 4, max = 6) => {
    const chars = process.env.RANDOM_PASSWORD;
    const passwordLength = Math.floor(Math.random() * (max - min + 1)) + min; // random between min & max
    let password = "";

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
};

// Encrypt
export const encryptData = async (data) => {
    try {
        const hashedPassword = await bcrypt.hash(data, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Internal server error!");
    }
};

export const verifyData = async (data, hashedData) => {
    try {
        const isMatch = await bcrypt.compare(data, hashedData);
        return isMatch; 
    } catch (error) {
        console.error('Error verifying password:', error);
    }
}
// Decrypt
export const decryptData = async (data) => {
    try {
        var decryptedText = await CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        throw new Error("Internal server error!");
    }
};

export const generateResetToken = (size = 32, expireMinutes = 15) => {
    // STEP 1: Generate random bytes
    const plainToken = crypto.randomBytes(size).toString("hex"); // 64 chars

    // STEP 2: Hash the token for DB storage
    const hashedToken = CryptoJS.SHA256(plainToken).toString();

    // STEP 3: Set expiry
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000); // 15 mins

    return {
        plainToken,   // to send in email link
        hashedToken,  // to store in DB
        expiresAt     // to store in DB
    };
};
