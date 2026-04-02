import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { email } = await req.json();

  if (!email) return Response.json({ error: 'Email required' }, { status: 400 });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

  // Delete old unused codes for this email
  const existing = await base44.asServiceRole.entities.OtpCode.filter({ email, used: false });
  for (const rec of existing) {
    await base44.asServiceRole.entities.OtpCode.delete(rec.id);
  }

  await base44.asServiceRole.entities.OtpCode.create({ email, code, expires_at, used: false });

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: email,
    subject: 'Your Verification Code',
    body: `Your verification code is: <strong>${code}</strong><br><br>This code expires in 10 minutes.`
  });

  return Response.json({ success: true });
});