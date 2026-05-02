import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function sha256hex(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server.' });
  }

  // Timing-safe comparison to prevent brute-force timing attacks
  const submittedHash = Buffer.from(sha256hex(password ?? ''), 'hex');
  const expectedHash = Buffer.from(sha256hex(adminPassword), 'hex');

  if (
    submittedHash.length !== expectedHash.length ||
    !crypto.timingSafeEqual(submittedHash, expectedHash)
  ) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const token = sha256hex(adminPassword);
  const secure = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    `fmi_admin=${token}; Path=/; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}; Max-Age=43200`
  );
  res.status(200).json({ ok: true });
}
