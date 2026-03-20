// ── TEMPORARY: Test newsletter send (single recipient, no dedup) ──
// DELETE THIS FILE after testing

var CANVAS = '#111118';
var CARD_BG = '#1a1a28';
var DIVIDER = '#2a2a45';
var ACCENT = '#3a6df5';
var TEXT = '#f0f0f8';
var MUTED = '#9999b8';
var SUBTLE = '#666677';

function storySection(s, isFeatured) {
  var titleSize = isFeatured ? '26px' : '22px';
  var h = '';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;">';
  h += '<tr><td style="padding:0 0 32px 0;">';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + CARD_BG + '; border-radius:12px; overflow:hidden;">';
  if (s.image) {
    h += '<tr><td style="padding:0; line-height:0;">';
    h += '<img src="https://api-access.netlify.app/' + s.image + '" alt="" width="536" style="width:100%; max-width:536px; height:auto; display:block; border-radius:12px 12px 0 0;" />';
    h += '</td></tr>';
  }
  h += '<tr><td style="padding:28px 32px 32px 32px;">';
  h += '<p style="margin:0 0 12px 0; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:' + ACCENT + ';">' + s.category + '</p>';
  h += '<p style="margin:0 0 14px 0; font-size:' + titleSize + '; font-weight:900; color:' + TEXT + '; line-height:1.25; letter-spacing:-0.5px;">' + s.title + '</p>';
  h += '<p style="margin:0 0 24px 0; font-size:15px; color:' + MUTED + '; line-height:1.8;">' + s.teaser + '</p>';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  h += '<tr><td align="center" bgcolor="' + ACCENT + '" style="background:' + ACCENT + '; border-radius:8px; padding:0;">';
  h += '<a href="' + s.url + '" style="display:block; padding:16px 0; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; letter-spacing:0.5px; text-align:center; mso-padding-alt:16px 32px;">Read the story &#8594;</a>';
  h += '</td></tr>';
  h += '</table>';
  h += '</td></tr>';
  h += '</table>';
  h += '</td></tr>';
  h += '</table>';
  return h;
}

function generateEmailHtml(story, secondary, otherStories) {
  var h = '';
  h += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
  h += '<!--[if mso]><style>table,td{font-family:Segoe UI,Helvetica,Arial,sans-serif !important;}</style><![endif]-->';
  h += '</head>';
  h += '<body style="margin:0; padding:0; background:' + CANVAS + '; font-family:Segoe UI, system-ui, -apple-system, Helvetica, Arial, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + CANVAS + '" style="background:' + CANVAS + ';">';
  h += '<tr><td align="center" style="padding:0;">';
  h += '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">';
  h += '<tr><td align="center" style="padding:44px 32px 20px 32px;">';
  h += '<span style="font-size:22px; font-weight:900; color:' + TEXT + '; letter-spacing:-0.5px;">API</span>';
  h += '<span style="font-size:22px; font-weight:300; color:' + ACCENT + '; letter-spacing:2px; margin-left:6px;">ACCESS</span>';
  h += '</td></tr>';
  h += '<tr><td style="padding:0 32px 28px 32px;">';
  h += '<p style="margin:0; font-size:15px; color:' + MUTED + '; line-height:1.8; text-align:center;">';
  h += 'From the Applied Performance Innovation team at the Nike Sport Research Lab. ';
  h += 'Real insights from real athletes, backed by real data.';
  h += '</p>';
  h += '</td></tr>';
  h += '<tr><td style="padding:0 32px 28px 32px;">';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ' + DIVIDER + '; font-size:0; height:1px; line-height:1px;">&nbsp;</td></tr></table>';
  h += '</td></tr>';
  h += '<tr><td style="padding:0 32px;">';
  h += storySection(story, true);
  if (secondary) { h += storySection(secondary, false); }
  if (otherStories && otherStories.length > 0) {
    otherStories.forEach(function(s) { h += storySection(s, false); });
  }
  h += '</td></tr>';
  h += '<tr><td style="padding:8px 32px 16px 32px;">';
  h += '<p style="margin:0; font-size:12px; color:' + SUBTLE + '; line-height:1.7; text-align:center;">First time visiting API Access? You\'ll be asked to set a password on your first click &#8212; check your inbox for the invite.</p>';
  h += '</td></tr>';
  h += '<tr><td style="padding:8px 32px 0 32px;">';
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ' + DIVIDER + '; font-size:0; height:1px; line-height:1px;">&nbsp;</td></tr></table>';
  h += '</td></tr>';
  h += '<tr><td align="center" style="padding:24px 32px 44px 32px;">';
  h += '<p style="margin:0; font-size:11px; color:#555; line-height:2;">';
  h += 'Applied Performance Innovation<br>Nike Sport Research Lab<br>';
  h += '<a href="https://api-access.netlify.app" style="color:#7a9dff; text-decoration:none;">api-access.netlify.app</a>';
  h += '</p>';
  h += '</td></tr>';
  h += '</table>';
  h += '</td></tr>';
  h += '</table>';
  h += '</body></html>';
  return h;
}

async function getLatestStory() {
  const response = await fetch('https://api-access.netlify.app/newsletter-content.json?v=' + Date.now());
  if (!response.ok) throw new Error('Failed to fetch newsletter content');
  const data = await response.json();
  const sorted = data.stories.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { featured: sorted[0], secondary: sorted[1] || null, others: sorted.slice(2, 5) };
}

exports.handler = async (event) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TEST_EMAIL = 'Brett.Kirby@nike.com';

  if (!RESEND_API_KEY) {
    return { statusCode: 500, body: 'Missing RESEND_API_KEY' };
  }

  try {
    const { featured, secondary, others } = await getLatestStory();
    const html = generateEmailHtml(featured, secondary, others);
    const subject = '[TEST] ' + featured.title + ' — API Access';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'API Access <newsletter@access-performance.com>',
        to: TEST_EMAIL,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: 'Send failed: ' + response.status + ' ' + err };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ sent: true, to: TEST_EMAIL, story: featured.title }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
