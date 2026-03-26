exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const params = new URLSearchParams(event.body);
    const email = (params.get('email') || '').trim().toLowerCase();
    const firstName = params.get('first-name') || '';
    const lastName = params.get('last-name') || '';
    const fullName = `${firstName} ${lastName}`.trim();

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
    }

    if (!email.endsWith('@nike.com')) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, restricted: true }),
      };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true }) };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'API Access <newsletter@access-performance.com>',
        to: 'Brett.Kirby@nike.com',
        subject: 'API Access Request: ' + (fullName || email),
        html: '<div style="font-family:Segoe UI,sans-serif;max-width:480px;padding:24px;">'
          + '<h2 style="margin:0 0 16px;">New Access Request</h2>'
          + '<p><strong>Name:</strong> ' + (fullName || '(not provided)') + '</p>'
          + '<p><strong>Email:</strong> ' + email + '</p>'
          + '<p style="margin-top:24px;">'
          + '<a href="https://api-access.netlify.app/approve-access.html?email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(fullName) + '" '
          + 'style="display:inline-block;padding:14px 32px;background:#22c55e;color:#fff;text-decoration:none;font-weight:700;border-radius:8px;font-size:14px;">'
          + 'Approve Access &rarr;</a></p>'
          + '<p style="margin-top:16px;color:#666;font-size:13px;">Or deny by ignoring this email.</p>'
          + '</div>',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Notification email failed:', response.status, err);
    } else {
      console.log('Access request notification sent for:', email);
    }

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
