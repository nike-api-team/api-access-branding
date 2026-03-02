exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const params = new URLSearchParams(event.body);
    const email     = params.get('email')      || '';
    const firstName = params.get('first-name') || '';
    const lastName  = params.get('last-name')  || '';

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
    }

    const siteId = process.env.NETLIFY_SITE_ID;
    const token  = process.env.NETLIFY_AUTH_TOKEN;

    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/identity/users`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          send_invite: true,
          user_metadata: {
            full_name: `${firstName} ${lastName}`.trim(),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Netlify Identity invite error:', response.status, errorText);
    }

    // Always return success to the user — don't expose API errors client-side
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
