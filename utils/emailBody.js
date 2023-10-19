module.exports = (token, buttonText) => {
  const resetURL = `https://digit-client.vercel.app/reset-password?token=${token}`;
  const emailBody = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      /* Add your CSS styles here */
      body {
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #072f5f;
        color: #fff;
        padding: 20px;
      }
      .content {
        padding: 20px;
      }
      button {
        background-color: #072f5f;
        padding: 10px 14px;
      }
      .button {
        color: #fff;
        text-decoration: none;
        display: inline-block;
      }
      .button .text {
        color: #fff
      }
      p{
        font-size: 14px;
      }
      a{
        text-decoration:none
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <p>Hi,</p>
        <p>
          Please follow this link to reset your password. This link is valid for
          10 minutes from now.
        </p>
        <a class="text" href="${resetURL}">
        <button type="button" class="button">
        <p>${buttonText}</p>
        </button>
        </a>
      </div>
      <p>Regards,<br />SOFANA</p>
    </div>
  </body>
</html>
`;

  return emailBody;
};
