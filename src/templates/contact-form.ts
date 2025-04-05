export const emailTemplate = (validatedData: any): string => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Contact Form Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <!-- Header -->
        <div style="background-color: #4338ca; padding: 20px; border-radius: 5px 5px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Here I Am</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 20px;">
          <p style="font-size: 16px; margin-top: 0;">You have received a new message from your website contact form.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e1e1e1; font-weight: bold; width: 100px; font-size: 16px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e1e1e1; font-size: 16px;">${
                  validatedData.name
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e1e1e1; font-weight: bold; font-size: 16px;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e1e1e1; font-size: 16px;">
                  <a href="mailto:${
                    validatedData.email
                  }" style="color: #4338ca; text-decoration: none;">${
    validatedData.email
  }</a>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px;">
            <h2 style="font-size: 18px; margin-top: 0; color: #4338ca; border-bottom: 1px solid #e1e1e1; padding-bottom: 10px;">Message:</h2>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-size: 16px;">${
              validatedData.message
            }</div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${
              validatedData.email
            }" style="display: inline-block; background-color: #4338ca; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Reply to ${
    validatedData.name
  }</a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e1e1e1; color: #777777; font-size: 14px;">
          <p>&copy; ${new Date().getFullYear()} HereIAm. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>`;
};
