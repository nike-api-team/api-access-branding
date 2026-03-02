exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const params = new URLSearchParams(event.body);
    const email = (params.get('email') || '').trim();
    const firstName = params.get('first-name') || '';
    const lastName = params.get('last-name') || '';

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
    }

    // Use built-in Identity admin token — no env vars needed
    const rawCtx = context.clientContext?.custom?.netlify;
    if (!rawCtx) {
      console.error('No Identity context — is Identity enabled for this site?');
      return { statusCode: 500, body: JSON.stringify({ error: 'Identity not configured' }) };
    }

    const netlifyCtx = JSON.parse(Buffer.from(rawCtx, 'base64').toString('utf-8'));
    const { identity } = netlifyCtx;
    if (!identity?.url || !identity?.token) {
      console.error('Missing identity.url or identity.token in context');
      return { statusCode: 500, body: JSON.stringify({ error: 'Identity not configured' }) };
    }

    // GoTrue invite endpoint: POST {identity_url}/invite
    const inviteUrl = identity.url.replace(/\/$/, '') + '/invite';
    const response = await fetch(inviteUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${identity.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        data: { full_name: `${firstName} ${lastName}`.trim() },
      }),
    });

    const respText = await response.text();
    if (!response.ok) {
      console.error('GoTrue invite error:', response.status, respText);
    }

    // Always return success to the user — don't expose API errors
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  }
};
