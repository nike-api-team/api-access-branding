function categoryColor(cat) {
  var colors = {
    'Publication': '#3a6df5',
    'Athlete Story': '#22c55e',
    'Case Study': '#a855f7',
    'Data Drop': '#f59e0b'
  };
  return colors[cat] || '#3a6df5';
}

function categoryGradient(cat) {
  var grads = {
    'Publication': 'linear-gradient(135deg, #1a2a5f 0%, #0d1533 100%)',
    'Athlete Story': 'linear-gradient(135deg, #0f3d1f 0%, #0a1a10 100%)',
    'Case Study': 'linear-gradient(135deg, #2d1854 0%, #150d2a 100%)',
    'Data Drop': 'linear-gradient(135deg, #3d2a0a 0%, #1a1205 100%)'
  };
  return grads[cat] || grads['Publication'];
}

function storyCard(s, isFeatured) {
  var color = categoryColor(s.category);
  var h = '';

  h += '<div style="margin:0 24px 24px; border-radius:12px; overflow:hidden; border:1px solid #2a2a45; background:#151520;">';

  if (s.image) {
    h += '<img src="https://api-access.netlify.app/' + s.image + '" alt="" style="width:100%; height:auto; max-height:200px; object-fit:cover; display:block;" />';
  } else {
    h += '<div style="padding:28px 24px 20px; background:' + categoryGradient(s.category) + '; border-bottom:2px solid ' + color + ';">';
    h += '<span style="font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:' + color + ';">' + s.category + '</span>';
    h += '</div>';
  }

  var titleSize = isFeatured ? '24px' : '20px';
  var teaserSize = isFeatured ? '14px' : '13px';

  h += '<div style="padding:20px 24px 24px;">';

  if (s.image) {
    h += '<div style="margin-bottom:10px;">';
    h += '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:' + color + '; margin-right:8px; vertical-align:middle;"></span>';
    h += '<span style="font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + color + '; vertical-align:middle;">' + s.category + '</span>';
    h += '</div>';
  }

  h += '<div style="font-size:' + titleSize + '; font-weight:900; color:#f0f0f8; line-height:1.2; margin-bottom:10px; letter-spacing:-0.5px;">' + s.title + '</div>';
  h += '<div style="font-size:' + teaserSize + '; color:#9999b8; line-height:1.7; margin-bottom:18px;">' + s.teaser + '</div>';

  if (isFeatured) {
    h += '<a href="' + s.url + '" style="display:inline-block; padding:12px 32px; background:#3a6df5; color:#ffffff; text-decoration:none; font-size:13px; font-weight:700; border-radius:8px; letter-spacing:0.5px;">Read the story &#8594;</a>';
  } else {
    h += '<a href="' + s.url + '" style="display:inline-block; padding:10px 28px; border:2px solid ' + color + '; color:' + color + '; text-decoration:none; font-size:12px; font-weight:700; border-radius:8px; letter-spacing:0.5px;">Read more &#8594;</a>';
  }

  h += '</div>';
  h += '</div>';

  return h;
}

function generateEmailHtml(story, secondary, otherStories) {
  var h = '';

  h += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>';
  h += '<body style="margin:0; padding:0; background:#0d1017; font-family:Segoe UI, system-ui, -apple-system, Helvetica, Arial, sans-serif;">';
  h += '<div style="max-width:600px; margin:0 auto; background:#0d1017;">';

  // ── Header ──
  h += '<div style="padding:36px 32px 16px; text-align:center;">';
  h += '<span style="font-size:20px; font-weight:900; color:#f0f0f8; letter-spacing:-0.5px;">API</span>';
  h += '<span style="font-size:20px; font-weight:300; color:#3a6df5; letter-spacing:2px; margin-left:4px;">ACCESS</span>';
  h += '</div>';

  // ── Team intro ──
  h += '<div style="padding:0 32px 36px;">';
  h += '<div style="font-size:14px; color:#9999b8; line-height:1.8; text-align:justify;">';
  h += 'Welcome to <strong style="color:#f0f0f8;">API Access</strong>, from the Applied Performance Innovation team at the Nike Sport Research Lab. ';
  h += 'Real insights from real athletes, backed by real data. ';
  h += 'You\'re on the short list &#8212; this hits your inbox before it goes anywhere else. Enjoy the access.';
  h += '</div>';
  h += '</div>';

  // ── Featured story card ──
  h += storyCard(story, true);

  // ── Secondary story card ──
  if (secondary) {
    h += storyCard(secondary, false);
  }

  // ── Additional story cards ──
  if (otherStories && otherStories.length > 0) {
    otherStories.forEach(function(s) {
      h += storyCard(s, false);
    });
  }

  // ── First-time visitor note ──
  h += '<div style="padding:12px 24px 8px;">';
  h += '<div style="padding:14px 16px; background:#151520; border-radius:8px; border:1px solid #2a2a45;">';
  h += '<div style="font-size:12px; color:#777; line-height:1.6;">First time visiting API Access? You\'ll be asked to set a password on your first click &#8212; check your inbox for the invite.</div>';
  h += '</div>';
  h += '</div>';

  // ── Footer ──
  h += '<div style="padding:28px 32px 40px; text-align:center;">';
  h += '<div style="font-size:11px; color:#555; line-height:1.8;">';
  h += 'Applied Performance Innovation<br>Nike Sport Research Lab<br>';
  h += '<a href="https://api-access.netlify.app" style="color:#7a9dff; text-decoration:none;">api-access.netlify.app</a>';
  h += '</div>';
  h += '</div>';

  h += '</div></body></html>';

  return h;
}

async function getContacts(apiKey, audienceId) {
  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch contacts: ' + response.status);
  }

  const data = await response.json();
  return data.data.filter(c => !c.unsubscribed).map(c => c.email);
}

async function sendEmail(apiKey, to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'API Access <newsletter@access-performance.com>',
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error('Send failed: ' + response.status + ' ' + err);
  }

  return response.json();
}

async function getLatestStory() {
  const response = await fetch('https://api-access.netlify.app/newsletter-content.json?v=' + Date.now());

  if (!response.ok) {
    throw new Error('Failed to fetch newsletter content');
  }

  const data = await response.json();
  const sorted = data.stories.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { featured: sorted[0], secondary: sorted[1] || null, others: sorted.slice(2, 5) };
}

// TEST ENDPOINT — sends to all subscribers, no 10-day gate, HTTP-invokable
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
    return { statusCode: 500, body: 'Missing configuration' };
  }

  try {
    const { featured, secondary, others } = await getLatestStory();

    const contacts = await getContacts(RESEND_API_KEY, RESEND_AUDIENCE_ID);

    if (contacts.length === 0) {
      console.log('No active subscribers, skipping send');
      return { statusCode: 200, body: 'No subscribers' };
    }

    const html = generateEmailHtml(featured, secondary, others);
    const subject = '[TEST] ' + featured.title + ' \u2014 API Access';

    let sent = 0;
    for (const email of contacts) {
      try {
        await sendEmail(RESEND_API_KEY, email, subject, html);
        sent++;
        console.log('Sent to:', email);
      } catch (err) {
        console.error('Failed to send to', email, err.message);
      }
    }

    console.log(`Test newsletter sent: ${sent}/${contacts.length} recipients`);
    return {
      statusCode: 200,
      body: JSON.stringify({ sent, total: contacts.length, story: featured.title }),
    };
  } catch (err) {
    console.error('Newsletter test error:', err);
    return { statusCode: 500, body: err.message };
  }
};
