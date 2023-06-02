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
