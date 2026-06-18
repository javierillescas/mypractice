import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createTransport } from 'nodemailer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const RECIPIENT = 'javier.illescas@me.com'
const SITE_URL = 'https://javierillescas.github.io/mypracticenews/'

const TAG_ORDER = [
  'AI in Law', 'Regulation', 'In-House Counsel',
  'Legal Market', 'Legal Tech', 'Legal Education', 'Access to Justice',
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function buildHtml(articles, date) {
  const byTag = {}
  for (const tag of TAG_ORDER) {
    const group = articles.filter(a => a.tags.includes(tag))
    if (group.length) byTag[tag] = group
  }

  const tagSections = Object.entries(byTag).map(([tag, items]) => `
    <tr><td style="padding: 24px 0 8px;">
      <p style="margin:0; font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#94a3b8;">${tag}</p>
    </td></tr>
    ${items.map(a => `
    <tr><td style="padding: 8px 0 16px; border-bottom: 1px solid #1e293b;">
      <a href="${a.url}" style="display:block; font-size:15px; font-weight:600; color:#f1f5f9; text-decoration:none; line-height:1.4; margin-bottom:4px;">${a.title}</a>
      <p style="margin:0 0 6px; font-size:12px; color:#64748b;">${a.source} &nbsp;·&nbsp; ${a.region} &nbsp;·&nbsp; ${a.relevance === 'high' ? '🟢 High' : '🟡 Medium'}</p>
      <p style="margin:0; font-size:13px; color:#94a3b8; line-height:1.5;">${a.summary}</p>
    </td></tr>`).join('')}
  `).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding-bottom:0;">
          <p style="margin:0; font-size:22px; font-weight:700; color:#f1f5f9; letter-spacing:-0.5px;">My Practice</p>
          <p style="margin:4px 0 0; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#475569;">Legal Intelligence</p>
        </td></tr>
        <tr><td style="padding:12px 0 4px;"><div style="height:1px;background:#1e293b;"></div></td></tr>

        <!-- Date + count -->
        <tr><td style="padding:12px 0 8px;">
          <p style="margin:0; font-size:13px; color:#64748b;">${date} &nbsp;·&nbsp; <strong style="color:#94a3b8;">${articles.length} article${articles.length !== 1 ? 's' : ''}</strong> today</p>
        </td></tr>

        <!-- Articles by tag -->
        ${tagSections}

        <!-- Footer -->
        <tr><td style="padding:28px 0 0;">
          <div style="height:1px;background:#1e293b;margin-bottom:16px;"></div>
          <p style="margin:0; font-size:12px; color:#334155; text-align:center;">
            <a href="${SITE_URL}" style="color:#64748b;">Open My Practice →</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function main() {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars')
    process.exit(1)
  }

  const cache = JSON.parse(readFileSync(join(ROOT, 'news-cache.json'), 'utf8'))

  // Articles from the last 25h (slight buffer over 24h cron interval)
  const cutoff = Date.now() - 25 * 60 * 60 * 1000
  const fresh = cache.articles.filter(a => new Date(a.date).getTime() > cutoff)

  if (fresh.length === 0) {
    console.log('No new articles in the last 25h — skipping email.')
    return
  }

  const date = formatDate(new Date().toISOString())
  const html = buildHtml(fresh, date)

  const transporter = createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  await transporter.sendMail({
    from: `"My Practice" <${gmailUser}>`,
    to: RECIPIENT,
    subject: `My Practice · ${fresh.length} new article${fresh.length !== 1 ? 's' : ''} · ${date}`,
    html,
  })

  console.log(`✓ Email sent to ${RECIPIENT} (${fresh.length} articles)`)
}

main().catch(err => { console.error(err); process.exit(1) })
