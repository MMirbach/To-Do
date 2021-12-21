// const crypto = require("crypto-js");

const encodeString = base => {
    // return crypto.AES.encrypt(base, "matanreut").toString();
    return Buffer.from(base).toString("base64");
};

const decodeString = encoded => {
    // return crypto.AES.decrypt(encoded, "matanreut").toString(crypto.enc.Utf8);
    return Buffer.from(encoded, "base64").toString("ascii");
};

const encodeObject = base => {
    let obj = {};
    for (let [key, value] of Object.entries(base)) {
        obj[encode(key)] = encode(value);
    }
    return obj;
};

const decodeObject = encoded => {
    let obj = {};
    for (let [key, value] of Object.entries(encoded)) {
        obj[decode(key)] = decode(value);
    }
    return obj;
};

const encodeArray = base => {
    let arr = [];
    base.forEach(element => {
        arr.push(encode(element));
    });
    return arr;
};

const decodeArray = encoded => {
    let arr = [];
    encoded.forEach(element => {
        arr.push(decode(element));
    });
    return arr;
};

const encode = base => {
    if (Array.isArray(base)) return encodeArray(base);
    if (typeof base === "string") return encodeString(base);
    if (typeof base === "object") return encodeObject(base);

    return base;
};

const decode = encoded => {
    if (Array.isArray(encoded)) return decodeArray(encoded);
    if (typeof encoded === "object") return decodeObject(encoded);
    if (typeof encoded === "string") return decodeString(encoded);

    return encoded;
};

exports.encode = encode;
exports.decode = decode;
