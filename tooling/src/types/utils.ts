const bufferToInt = (buffer: Uint8Array) => {
    let acc = BigInt(0);
    for (let i = 0; i < buffer.length; i++) {
        acc = acc * BigInt(256) + BigInt(buffer[i]);
    }
    return acc;
};

export const encodeStringToFelt = (s: string): string => {
    let encoder = new TextEncoder();
    let buffer: Uint8Array = encoder.encode(s);
    let acc = bufferToInt(buffer);
    return acc.toString();
};

// source: https://stackoverflow.com/a/40958850
export function simpleHash(str: string) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
