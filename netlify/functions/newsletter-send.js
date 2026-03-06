// ── Newsletter Email Generator ──
// Table-based layout for Outlook/Gmail/Apple Mail/mobile compatibility

var CANVAS = '#111118';    // outer background
var CARD_BG = '#1a1a28';   // story card background
var DIVIDER = '#2a2a45';   // divider color
var ACCENT = '#3a6df5';    // brand blue
var TEXT = '#f0f0f8';      // primary text
var MUTED = '#9999b8';     // secondary text
var SUBTLE = '#666677';    // footer/fine print

function storySection(s, isFeatured) {
  var titleSize = isFeatured ? '26px' : '22px';
  var h = '';

  // ── Card wrapper ──
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;">';
  h += '<tr><td style="padding:0 0 32px 0;">';

  // Inner card with background
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + CARD_BG + '; border-radius:12px; overflow:hidden;">';

  // ── Image row ──
  if (s.image) {
    h += '<tr><td style="padding:0; line-height:0;">';
    h += '<img src="https://api-access.netlify.app/' + s.image + '" alt="" width="536" style="width:100%; max-width:536px; height:auto; display:block; border-radius:12px 12px 0 0;" />';
    h += '</td></tr>';
  }

  // ── Content row ──
  h += '<tr><td style="padding:28px 32px 32px 32px;">';

  // Category
  h += '<p style="margin:0 0 12px 0; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:' + ACCENT + ';">' + s.category + '</p>';

  // Title
  h += '<p style="margin:0 0 14px 0; font-size:' + titleSize + '; font-weight:900; color:' + TEXT + '; line-height:1.25; letter-spacing:-0.5px;">' + s.title + '</p>';

  // Teaser
  h += '<p style="margin:0 0 24px 0; font-size:15px; color:' + MUTED + '; line-height:1.8;">' + s.teaser + '</p>';

  // ── Bulletproof button (table-based for Outlook) ──
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  h += '<tr><td align="center" bgcolor="' + ACCENT + '" style="background:' + ACCENT + '; border-radius:8px; padding:0;">';
  h += '<a href="' + s.url + '" style="display:block; padding:16px 0; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; letter-spacing:0.5px; text-align:center; mso-padding-alt:16px 32px;">Read the story &#8594;</a>';
  h += '</td></tr>';
  h += '</table>';

  h += '</td></tr>';
  h += '</table>';  // end inner card

  h += '</td></tr>';
  h += '</table>';  // end card wrapper

  return h;
}

function generateEmailHtml(story, secondary, otherStories) {
  var h = '';

  h += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
  h += '<!--[if mso]><style>table,td{font-family:Segoe UI,Helvetica,Arial,sans-serif !important;}</style><![endif]-->';
  h += '</head>';
  h += '<body style="margin:0; padding:0; background:' + CANVAS + '; font-family:Segoe UI, system-ui, -apple-system, Helvetica, Arial, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">';

  // ── Outer wrapper table (centers content, sets canvas bg) ──
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + CANVAS + '" style="background:' + CANVAS + ';">';
  h += '<tr><td align="center" style="padding:0;">';

  // ── Inner container (600px max) ──
  h += '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">';

  // ── Header ──
  h += '<tr><td align="center" style="padding:44px 32px 20px 32px;">';
  h += '<span style="font-size:22px; font-weight:900; color:' + TEXT + '; letter-spacing:-0.5px;">API</span>';
  h += '<span style="font-size:22px; font-weight:300; color:' + ACCENT + '; letter-spacing:2px; margin-left:6px;">ACCESS</span>';
  h += '</td></tr>';

  // ── Intro ──
  h += '<tr><td style="padding:0 32px 28px 32px;">';
  h += '<p style="margin:0; font-size:15px; color:' + MUTED + '; line-height:1.8; text-align:center;">';
  h += 'From the Applied Performance Innovation team at the Nike Sport Research Lab. ';
  h += 'Real insights from real athletes, backed by real data.';
  h += '</p>';
  h += '</td></tr>';

  // ── Divider ──
  h += '<tr><td style="padding:0 32px 28px 32px;">';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ' + DIVIDER + '; font-size:0; height:1px; line-height:1px;">&nbsp;</td></tr></table>';
  h += '</td></tr>';

  // ── Stories ──
  h += '<tr><td style="padding:0 32px;">';

  // Featured
  h += storySection(story, true);

  // Secondary
  if (secondary) {
    h += storySection(secondary, false);
  }

  // Others
  if (otherStories && otherStories.length > 0) {
    otherStories.forEach(function(s) {
      h += storySection(s, false);
    });
  }

  h += '</td></tr>';

  // ── First-time note ──
  h += '<tr><td style="padding:8px 32px 16px 32px;">';
  h += '<p style="margin:0; font-size:12px; color:' + SUBTLE + '; line-height:1.7; text-align:center;">First time visiting API Access? You\'ll be asked to set a password on your first click &#8212; check your inbox for the invite.</p>';
  h += '</td></tr>';

  // ── Footer divider ──
  h += '<tr><td style="padding:8px 32px 0 32px;">';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ' + DIVIDER + '; font-size:0; height:1px; line-height:1px;">&nbsp;</td></tr></table>';
  h += '</td></tr>';

  // ── Footer ──
  h += '<tr><td align="center" style="padding:24px 32px 44px 32px;">';
  h += '<p style="margin:0; font-size:11px; color:#555; line-height:2;">';
  h += 'Applied Performance Innovation<br>Nike Sport Research Lab<br>';
  h += '<a href="https://access-performance.com" style="color:#7a9dff; text-decoration:none;">access-performance.com</a>';
  h += '</p>';
  h += '</td></tr>';

  h += '</table>';  // end inner container
  h += '</td></tr>';
  h += '</table>';  // end outer wrapper

  h += '</body></html>';

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

exports.handler = async (event) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
    return { statusCode: 500, body: 'Missing configuration' };
  }

  try {
    const { featured, secondary, others } = await getLatestStory();

    const storyDate = new Date(featured.date);
    const now = new Date();
    const daysSincePublish = (now - storyDate) / (1000 * 60 * 60 * 24);

    if (daysSincePublish > 10) {
      console.log(`Newest story "${featured.title}" is ${Math.floor(daysSincePublish)} days old — no new content, skipping send`);
      return { statusCode: 200, body: 'No new content to send' };
    }

    const contacts = await getContacts(RESEND_API_KEY, RESEND_AUDIENCE_ID);

    if (contacts.length === 0) {
      console.log('No active subscribers, skipping send');
      return { statusCode: 200, body: 'No subscribers' };
    }

    const html = generateEmailHtml(featured, secondary, others);
    const subject = featured.title + ' \u2014 API Access';

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

    console.log(`Newsletter sent: ${sent}/${contacts.length} recipients`);
    return {
      statusCode: 200,
      body: JSON.stringify({ sent, total: contacts.length, story: featured.title }),
    };
  } catch (err) {
    console.error('Newsletter send error:', err);
    return { statusCode: 500, body: err.message };
  }
};
