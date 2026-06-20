export const emailTemplate = (email, password) => {
  return `
      <html>
        <head>
          <title>Diamond Login Details</title>
          <style>
            /* CSS styles for the design */
            body {
              background-color: #f6f9fc;
              font-family: Arial, sans-serif;
              
            }
            .container {
              border-radius: 10px;
              box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
              margin: 50px auto;
              padding: 30px;
              width: 80%;
              max-width: 500px;
              text-align: center;
              background-color: white;
              border:2px solid black;
            }
            h1 {
              color: #444444;
              font-size: 28px;
              font-weight: bold;
              margin-top: 0;
              text-align: center;
            }
            h2 {
              color: #444444;
              font-size: 22px;
              margin-bottom: 0;
              text-align: center;
            }
            p {
              color: #777777;
              font-size: 16px;
              margin-bottom: 20px;
              text-align: justify;
            }
            b {
              color: #444444;
              font-size: 20px;
              font-weight: bold;
            }
            .logo {
              margin: 0 auto;
              max-width: 200px;
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Diamond</h1>
            <h2>Hello ${email}</h2>
            <p>Please find your Diamond login credentials below:</p>
            <p><b>Password: ${password}</b></p>
            <p>
            Click the link below to log in and set up your account:
            <br>
            </p>
            <p>Please do not share your password with anyone.</p>      
          </div>
        </body>
      </html>
    `;
};
