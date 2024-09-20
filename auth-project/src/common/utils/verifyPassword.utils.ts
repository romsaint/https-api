import * as CryptoJS from 'crypto-js'


export function verifyPassword(enteredPassword: string, storedSalt: string, storedHashedPassword: string): boolean {
    // Генерируем хеш для введенного пароля с использованием сохраненной соли
    const hashedEnteredPassword = CryptoJS.PBKDF2(enteredPassword, storedSalt, {
        keySize: 16, // 8 * 32 бит = 256 бит (32 байта)
        iterations: 1000,
    }).toString();

    // Сравниваем полученный хеш с сохраненным хешированным паролем
    return hashedEnteredPassword === storedHashedPassword;
}