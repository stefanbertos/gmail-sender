import {
  sendEmail,
  GmailNodeSenderAuth,
  GmailNodeSenderMessage,
  GmailNodeSenderSendResponse,
} from '../src';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

const mockSendMail = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: mockSendMail,
});

describe('sendEmail', () => {
  beforeEach(() => {
    mockSendMail.mockReset();
  });

  it('should send email with correct params', async () => {
    mockSendMail.mockResolvedValueOnce({ response: 'ok', accepted: ['to@email.com'] });
    const auth: GmailNodeSenderAuth = { user: 'test@gmail.com', pass: 'password' };
    const message: GmailNodeSenderMessage = {
      from: 'test@gmail.com',
      to: 'to@email.com',
      subject: 'Test',
      html: '<b>Hello</b>',
    };
    const result: GmailNodeSenderSendResponse = await sendEmail(auth, message);
    expect(result.success).toBe(true);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
      }),
    );
  });

  it('should handle errors from nodemailer', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('fail'));
    const auth: GmailNodeSenderAuth = { user: 'test@gmail.com', pass: 'password' };
    const message: GmailNodeSenderMessage = {
      from: 'test@gmail.com',
      to: 'to@email.com',
      subject: 'Test',
      html: '<b>Hello</b>',
    };
    const result: GmailNodeSenderSendResponse = await sendEmail(auth, message);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
