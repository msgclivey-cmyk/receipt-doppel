export function reviewAskCopy({
  brandName,
  customerName,
  orderRef,
  url,
}: {
  brandName: string;
  customerName: string;
  orderRef: string;
  url: string;
}) {
  const first = customerName.trim().split(/\s+/)[0] || "there";
  const subject = `One sentence about ${brandName}? Skip is fine.`;
  const text = `Hi ${first},

You've had a little time with your ${brandName} order #${orderRef}.

If it was useful, one sentence for the next buyer helps. If it wasn't — or you would rather not — skip. This is not another account. We will not chase you.

${url}

Bound to the receipt you already paid.`;
  return { subject, text };
}

export async function sendReviewAskEmail({
  to,
  brandName,
  customerName,
  orderRef,
  url,
}: {
  to: string;
  brandName: string;
  customerName: string;
  orderRef: string;
  url: string;
}): Promise<{ emailed: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = (
    process.env.REVIEW_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    ""
  ).trim();
  if (!apiKey || !from) {
    return { emailed: false };
  }

  const { subject, text } = reviewAskCopy({
    brandName,
    customerName,
    orderRef,
    url,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!res.ok) {
    return { emailed: false, error: "Email provider rejected the send." };
  }
  return { emailed: true };
}

export function reviewAskMailto({
  email,
  brandName,
  customerName,
  orderRef,
  url,
}: {
  email: string;
  brandName: string;
  customerName: string;
  orderRef: string;
  url: string;
}) {
  const { subject, text } = reviewAskCopy({
    brandName,
    customerName,
    orderRef,
    url,
  });
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}
