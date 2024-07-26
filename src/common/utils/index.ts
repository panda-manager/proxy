import { Request } from 'express';
import { Transporter } from 'nodemailer';

export const getDeviceIdentifier = (req: Request): string => {
  const { headers, ip, ips } = req;

  if (headers['X-Forwarded-For'])
    return headers['X-Forwarded-For'].toString().split(',')[0];

  return ips[0] ?? ip;
};

export const mailSender = (
  transporter: Transporter,
  to: string,
  from: string,
  title: string,
  body: any,
): Promise<any> => {
  return transporter.sendMail({
    to: to,
    from: from,
    subject: title,
    html: body,
  });
};
