// ── Approve Access Request ──
// Called from approve-access.html with the logged-in user's Identity JWT.
// Uses the GoTrue admin token (injected by Netlify) to invite the user.

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { email, name } = JSON.parse(event.body);

    if (!email || !email.endsWith('@nike.com')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid @nike.com email required' }) };
    }

    const rawCtx = context.clientContext?.custom?.netlify;
    if (!rawCtx) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Not authenticated — open this page while logged in' }) };
    }

    const netlifyCtx = JSON.parse(Buffer.from(rawCtx, 'base64').toString('utf-8'));
    const { identity } = netlifyCtx;
    if (!identity?.url || !identity?.token) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Identity not configured' }) };
    }

    const inviteUrl = identity.url.replace(/\/$/, '') + '/invite';
    const response = await fetch(inviteUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${identity.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        data: { full_name: name || '' },
      }),
    });

    const respText = await response.text();
    if (!response.ok) {
      console.error('GoTrue invite error:', response.status, respText);
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'Invite failed — they may already have an account' }) };
    }

    console.log('Approved and invited:', email);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Approve error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
