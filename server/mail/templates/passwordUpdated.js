exports.passwordUpdated = (name, email) => {
    return `<!DOCTYPE html>
        <html lang="en">
    
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
    
            <style>
                body {
                    background-color: #ffffff;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.4;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
            
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                }
            
                .logo {
                    padding: 10px 20px;
                    background-color: #FFD60A;
                    border-radius: 10px;
                    max-width: 200px;
                    margin-bottom: 20px;
                }
            
                .message {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
            
                .body {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
            
                .cta {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #FFD60A;
                    color: #000000;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                }
            
                .support {
                    font-size: 14px;
                    color: #999999;
                    margin-top: 20px;
                }
            
                .highlight {
                    font-weight: bold;
                }
            </style>
        </head>
            
        <body>
            <div class="container">
                <a href="https://studynotion-edtech-project.netlify.app"><img class="logo" src="https://res.cloudinary.com/dvubosn5g/image/upload/v1705511843/StudyNotion/Logo/Logo-Full-Dark_i7fa6w.png" alt="StudyNotion Logo"></a>
                <div class="message">Course Registration Confirmation</div>
                <div class="body">
                    <p>Hey ${name},</p>
                    <p>Your password has been successfully updated for the email <span class="highlight">"${email}"</span></p>
                    <p>If you did not request this password change, please contact us immediately to secure your account.</p>
                    <a class="cta" href="https://studynotion-edtech-project.netlify.app/dashboard">Go to Dashboard</a>
                </div>
                <div class="support">If you have any questions or need further assistent, please feel free to reach out to us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!</div>
            </div>
      </body>
            
        </html>`;
};