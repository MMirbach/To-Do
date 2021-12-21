from Crypto.Cipher import AES

key = b"b5a0cd4fab86b58f7de3f2b6d0191cc1"
iv = b"3dfae1cbefce2df2"


def encode(base: str):
    obj = AES.new(key, AES.MODE_EAX, iv)

    return obj.encrypt(bytes(base, 'utf-8'))


def decode(encoded: str):
    obj = AES.new(key, AES.MODE_EAX, iv)

    return obj.decrypt(bytes(encoded, 'utf-8'))


def encodeDict(base: dict):
    encoded = {}
    for k, v in base.items():
        encoded[encode(k)] = encode(v)

    return encoded


