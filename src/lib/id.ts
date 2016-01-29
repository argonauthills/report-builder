export function generate(length) {
    var chars = '23456789ABCDEFGHJKMNPQRSTUVWXTZabcdefghkmnpqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}