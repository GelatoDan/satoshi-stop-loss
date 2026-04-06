import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Satoshi Stop Loss <alerts@nput.foundation>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nput.foundation'

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${SITE_URL}/confirm?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Confirm your Satoshi Stop Loss alert',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#0a0a0a;color:#e5e5e5;font-family:sans-serif;padding:40px 20px;margin:0;">
        <div style="max-width:480px;margin:0 auto;">
          <div style="font-size:32px;margin-bottom:24px;">₿</div>
          <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#ffffff;">
            Confirm your alert
          </h1>
          <p style="color:#888;font-size:14px;line-height:1.6;margin-bottom:32px;">
            You're one click away from being among the first to know if any Patoshi
            pattern wallet moves. Click below to activate your alert.
          </p>

          <a href="${confirmUrl}"
             style="display:inline-block;background:#F7931A;color:#000;font-weight:700;
                    font-size:14px;padding:14px 28px;border-radius:8px;text-decoration:none;">
            Activate my alert →
          </a>

          <div style="margin-top:40px;padding-top:24px;border-top:1px solid #222;">
            <p style="color:#444;font-size:12px;line-height:1.6;">
              We're monitoring <strong style="color:#666;">22,000+ Patoshi pattern addresses</strong>
              identified by Sergio Demian Lerner's research. Attribution is based on
              mining pattern analysis — not cryptographic proof.
            </p>
            <p style="color:#333;font-size:12px;margin-top:12px;">
              If you didn't sign up for this, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendAlertEmail({
  email,
  unsubscribeToken,
  address,
  txid,
  amountSats,
  totalBtcRemaining,
}: {
  email: string
  unsubscribeToken: string
  address: string
  txid: string
  amountSats: number
  totalBtcRemaining: string
}) {
  const btcMoved = (amountSats / 100_000_000).toFixed(8)
  const explorerUrl = `https://mempool.space/tx/${txid}`
  const unsubscribeUrl = `${SITE_URL}/preferences?token=${unsubscribeToken}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '⚠️ Satoshi Stop Loss: Patoshi Wallet Movement Detected',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#0a0a0a;color:#e5e5e5;font-family:sans-serif;padding:40px 20px;margin:0;">
        <div style="max-width:520px;margin:0 auto;">

          <div style="background:#1a0a00;border:1px solid #F7931A33;border-radius:12px;padding:24px;margin-bottom:32px;">
            <div style="font-size:24px;margin-bottom:8px;">⚠️</div>
            <h1 style="font-size:20px;font-weight:700;color:#F7931A;margin:0 0 4px;">
              Patoshi Wallet Movement Detected
            </h1>
            <p style="color:#888;font-size:13px;margin:0;">
              A wallet attributed to the Patoshi mining pattern has broadcast a transaction.
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#555;font-size:13px;">Address</td>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#ccc;font-size:13px;text-align:right;font-family:monospace;word-break:break-all;">
                ${address}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#555;font-size:13px;">Amount moved</td>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#F7931A;font-size:13px;text-align:right;font-weight:700;">
                ${btcMoved} BTC
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#555;font-size:13px;">Remaining in Patoshi set</td>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#ccc;font-size:13px;text-align:right;">
                ~${totalBtcRemaining} BTC
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#555;font-size:13px;">Transaction ID</td>
              <td style="padding:10px 0;color:#ccc;font-size:13px;text-align:right;font-family:monospace;word-break:break-all;">
                ${txid.slice(0, 20)}...
              </td>
            </tr>
          </table>

          <a href="${explorerUrl}"
             style="display:block;text-align:center;background:#F7931A;color:#000;font-weight:700;
                    font-size:14px;padding:14px 28px;border-radius:8px;text-decoration:none;margin-bottom:32px;">
            View transaction on mempool.space →
          </a>

          <div style="padding:16px;background:#111;border-radius:8px;margin-bottom:32px;">
            <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
              <strong style="color:#444;">Important:</strong> Attribution of Patoshi wallets is based on
              Sergio Demian Lerner's mining pattern research — not cryptographic proof. This may or may not
              represent Satoshi Nakamoto. Verify independently before acting on this information.
            </p>
          </div>

          <p style="color:#333;font-size:12px;text-align:center;">
            <a href="${unsubscribeUrl}" style="color:#444;text-decoration:underline;">Unsubscribe</a>
            &nbsp;·&nbsp; Satoshi Stop Loss &nbsp;·&nbsp; nput.foundation
          </p>
        </div>
      </body>
      </html>
    `,
  })
}
