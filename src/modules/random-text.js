export default function random_text(length) {
    const original_text ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const text_array = Array.from(original_text);

    let result = '';
    let loop = 0;
    while (loop < length) {
        result = result + text_array[Math.floor(Math.random() * original_text.length)];
        loop++;
    }

    return result;
}
