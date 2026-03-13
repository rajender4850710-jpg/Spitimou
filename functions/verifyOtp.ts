import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { email, code } = await req.json();

  if (!email || !code) return Response.json({ error: 'Email and code required' }, { status: 400 });

  const records = await base44.asServiceRole.entities.OtpCode.filter({ email, code, used: false });

  if (!records.length) return Response.json({ valid: false, error: 'Invalid code' }, { status: 400 });

  const record = records[0];
  if (new Date(record.expires_at) < new Date()) {
    return Response.json({ valid: false, error: 'Code expired' }, { status: 400 });
  }

  await base44.asServiceRole.entities.OtpCode.update(record.id, { used: true });

  return Response.json({ valid: true });
});