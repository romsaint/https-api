export const generateHtmlContent = (name: string, confirmationLink: string): string => {
  return `
  <html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 20px;
          }
          .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #52ac3e;
          }
          .button {
              background-color: #52ac3e;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
          }
          .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777;
          }
          p {
              margin-bottom: 30px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Hello, ${name}!</h1>
          <p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
          <a href="${confirmationLink}" class="button">Confirm Email</a>
          <div class="footer">
              <p>If you did not create an account, no further action is required.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};