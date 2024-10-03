export function htmlNotification(data) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Noification</title>
    </head>
    <body style="font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #f5f7fa, #c3cfe2); display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; color: #333;">
        <div class="container" style="margin: 25px auto; background: #fff; border-radius: 15px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); padding:35px; text-align: center; max-width: 550px;">
            <div class="icon" style="font-size: 5em; color: #4a90e2; margin-bottom: 20px;">⏰</div>
            <h1 style="font-size: 2.5em; margin-bottom: 20px; color: #4a90e2;">Hello, ${data.username}!</h1>
            <p style="font-size: 1.2em; margin-bottom: 30px; color: #555;">You have been on our site for more than 10 days!</p>
            <div class="timer" style="font-size: 1.5em; color: #555; margin-bottom: 20px;">⏳ 10 days</div>
            <div class="footer" style="font-size: 0.9em; color: #888;">
                <p>Thank you for your time! <a href="#" style="color: #4a90e2; text-decoration: none;">Read more</a></p>
            </div>
        </div>
    </body>
    </html>
`;
}