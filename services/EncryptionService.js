import crypto from "crypto";

const ALGORITHM = "aes-192-cbc";
const SECRET = process.env.ENCRYPT_SECRET;
const SALT = process.env.ENCRYPT_SALT;
const KEY_LEN = 24;
// const IV_BYTES = 16;
const ENCODING_UTF8 = 'utf8';
const ENCODING_HEX = 'hex'
const ENCRYPT_OR_DECRYPT_DEFAULT = 'encrypt';
const IV = 'WillowCohenVelez';

export class EncryptionService {

    // Refer to https://stackoverflow.com/questions/6953286/how-to-encrypt-data-that-needs-to-be-decrypted-in-node-js

    constructor() {

    }

    _getKey() {
        return crypto.scryptSync(SECRET, SALT, KEY_LEN)
    }

    _getIv() {
        // must be static to ensure the decryption works later
        return IV;
        // return crypto.randomBytes(IV_BYTES);
    }

    _getCipher() {
        return crypto.createCipheriv(ALGORITHM, this._getKey(), this._getIv())
    }

    _getDecipher() {
        return crypto.createDecipheriv(ALGORITHM, this._getKey(), this._getIv())
    }

    _getInputEncoding(encryptOrDecrypt = ENCRYPT_OR_DECRYPT_DEFAULT) {
        return encryptOrDecrypt === ENCRYPT_OR_DECRYPT_DEFAULT
            ? ENCODING_UTF8
            : ENCODING_HEX
    }

    _getOutputEncoding(encryptOrDecrypt = ENCRYPT_OR_DECRYPT_DEFAULT) {
        return encryptOrDecrypt === ENCRYPT_OR_DECRYPT_DEFAULT
            ? ENCODING_HEX
            : ENCODING_UTF8
    }

    encrypt(strToEncrypt) {
        let cipher = this._getCipher()
        let input = this._getInputEncoding();
        let output = this._getOutputEncoding();
        return cipher.update(strToEncrypt, input, output) + cipher.final(output);
    }

    decrypt(encryptedString) {
        if(!encryptedString){
            console.log('EncryptionService:decrypt encryptedString can not be empty. Check your code.')
        }
        let decipher = this._getDecipher();
        let input = this._getInputEncoding('decrypt');
        let output = this._getOutputEncoding('decrypt');
        return decipher.update(encryptedString, input, output) + decipher.final(output);
    }

}
