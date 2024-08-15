import { Request } from 'express';
import { Transporter } from 'nodemailer';
import { generate } from 'otp-generator';

const retainLastOctet = (ip: string): string => {
  if (!ip) return '';

  const segments: string[] = ip.split('.');

  if (segments.length > 1) {
    segments.pop();
    return segments.join('.') + '.0';
  }

  return ip;
};

export const getDeviceIdentifier = (req: Request): string => {
  const { headers, ips, ip } = req;

  if (headers['x-forwarded-for'])
    return retainLastOctet(headers['x-forwarded-for'].toString().split(',')[0]);

  return retainLastOctet(ips[0] ?? ip);
};

export const generateOtp = () => {
  return generate(6, {
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
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
