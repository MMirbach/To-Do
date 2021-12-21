import base64


def encode(base: str):
    return base64.b64encode(bytes(base, 'utf-8'))

def encodeDict(base: dict):
    encoded = {}
    for k, v in base.items():
        encoded[encode(k)] = encode(v)

    return encoded


