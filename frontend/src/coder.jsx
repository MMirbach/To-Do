const crypto = require("crypto-js");

const encode = base => {
    return crypto.AES.encrypt(base, "matanreut").toString();
    //return Buffer.from(base).toString("base64");
};

const decode = decoded => {
    return crypto.AES.decrypt(decoded, "matanreut").toString(crypto.enc.Utf8);
    //return Buffer.from(decoded, "base64").toString("ascii");
};

const encodeObject = base => {
    let obj = {};
    for (let [key, value] of Object.entries(base)) {
        obj[encode(key)] = encode(value);
    }
    return obj;
};

const decodeObject = decoded => {
    let obj = {};
    for (let [key, value] of Object.entries(decoded)) {
        obj[decode(key)] = decode(value);
    }
    return obj;
};

const encodeArray = base => {
    let arr = [];
    base.forEach(element => {
        arr.push(encodeObject(element));
    });
    return arr;
};

const decodeArray = decoded => {
    let arr = [];
    decoded.forEach(element => {
        arr.push(decodeObject(element));
    });
    return arr;
};

module.exports = {
    encode,
    decode,
    encodeObject,
    decodeObject,
    encodeArray,
    decodeArray,
};
