const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: 'siddh4194@gmail.com',
    pass: 'ozyaatcpuipilxlg',
  },
});
const mailSender = (email,hash)=>{
  console.log("----------------------at mailSender--------------------");
  const mailOptions = {
    from: 'siddh4194@gmail.com',
    to: email,
    subject: 'Manoops Verification',
    html: `
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h1 style="text-align:center">Manoops Security 🔐</h1>
        <h2>Thank You For Your Efforts</h2>
        <h3>Our main goal is to provide security to you data.</h3>
        <p>This is your next post hash key: </p>
        <div style="display:flex; flex-direction:row;"><div style="border: 1px solid #ddd; padding: 20px; border-radius: 10px 10px 10px 10px;"><strong id="hashKey">${hash}</strong></div></div>
      </div>
      <script>
        function copyToClipboard() {
          // Get the text content of the <strong> element
          const hashKeyElement = document.getElementById('hashKey');
          const hashKeyText = hashKeyElement.innerText;
  
          // Create a temporary textarea element to hold the text
          const textarea = document.createElement('textarea');
          textarea.value = hashKeyText;
          document.body.appendChild(textarea);
  
          // Select and copy the text
          textarea.select();
          document.execCommand('copy');
  
          // Remove the temporary textarea
          document.body.removeChild(textarea);
  
          // Optionally, provide user feedback
          alert('Hash key copied to clipboard: ' + hashKeyText);
        }
      </script>
    `,
  };
  
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log('Email sent successfully!', info.messageId);
    }
  });  
}

module.exports = mailSender;