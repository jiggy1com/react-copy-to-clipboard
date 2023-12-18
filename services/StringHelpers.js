// export function generateRoute(){
//
// }

// export function generateProductRoute(product){
//     let r = product.prod_name.replaceAll(' ', '-')
//         .replaceAll('#', '');
//     return '/product/' + r + '/' + product.productid;
// }
//

var crypto = require('crypto');

export function dollarFormat(price) {
    return '$' + price.toFixed(2);
}


// password helpers
export const ALLOWED_SPECIAL_CHARS = [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '<',
    '>',
    '?'
];
export const REGEX_ALPHA = /\w/
export const REGEX_NUMERIC = /\d/
export const PASSWORD_MIN_LENGTH = 8;

export function isValidPassword(password = '') {
    console.log('password', password)
    let success = true;
    let message = '';
    let passwordArray = password.split("");

    function setInvalid(msg) {
        success = false;
        message = msg;
    }

    if (success && password.length < 8) {
        setInvalid(`Password must be at least ${PASSWORD_MIN_LENGTH} is too short`)
    }

    if(success && !REGEX_ALPHA.test(password)){
        setInvalid('Password must contain at least one letter.');
    }

    if(success && !REGEX_NUMERIC.test(password)){
        setInvalid('Password mst contain at least one number');
    }

    if(success){
        let allowed = false
        ALLOWED_SPECIAL_CHARS.forEach((char)=>{
            if(!allowed){
                allowed = passwordArray.includes(char);
                console.log('allowed', allowed)
            }
        });
        if(!allowed){
            setInvalid(`Password must contain at least one valid special character. Characters include: ${ALLOWED_SPECIAL_CHARS}`)
        }
    }

    if(success){
        if(passwordArray.includes(" ")){
            setInvalid("Password can not contain empty space.");
        }
    }

    return {
        success: success,
        message: message,
    }
}

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function getRandomNumberBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


function generateSalt(){
    let alphaArr = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(",");
    let numericArr = '0,1,2,3,4,5,6,7,8,9'.split(",");
    let cnt = 20;
    let salt = '';
    for(let i=0; i<cnt; i++){
        let alphaIndex = getRandomNumberBetween(0, alphaArr.length);
        let numericIndex = getRandomNumberBetween(0, numericArr.length);
        let choice = getRandomNumberBetween(0,1);
        salt = salt + (choice ? numericArr[numericIndex] : alphaArr[alphaIndex]);
    }
    return salt;
}

/**
 * salt should only be passed in for authentication, not account creation
 * @param password
 * @param salt
 * @returns {{salt, passwordHash: *}}
 */
export function hashPassword(password, salt=null){
    if(!salt){
        salt = generateSalt();
    }
    return sha512(password, salt);
}
