import nodemailer from "nodemailer";

const SendVerifyMail = (email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.ETHERIALHOST,
    port: process.env.ETHERIALPORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.ETHERILAUSERID,
      pass: process.env.ETHERIALPASSWORD,
    },
  });

  const mailoption = {
    from: process.env.FROMMAIL,
    to: email,

    subject: "verify your mail",
    text: "hello",
    html:
      "<p>hi " +
      email +
      ',please click here to <a href="https://poseben-assigment.netlify.app/?email=' +
      email +
      '">verify</a> your mail</p>  ',
  };
  transporter.sendMail(mailoption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email has been verified", info.response);
    }
  });
};

export default SendVerifyMail;
