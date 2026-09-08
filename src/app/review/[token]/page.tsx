import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/misc";
import { ReviewForm } from "@/components/reviews/review-form";
import { findInviteByToken, inviteBlockReason } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await findInviteByToken(token);
  const blocked = inviteBlockReason(invite);
  const skipHref = invite ? `/proof/${invite.brand.slug}` : "/";

  return (
    <div className="min-h-screen bg-[var(--rd-mist)] px-4 py-12">
      <div className="mx-auto max-w-lg space-y-6">
        <p className="text-center text-sm font-semibold text-[var(--rd-forest)]">
          {invite?.brand.name ?? "Thanks"}
        </p>
        <Card>
          <CardHeader>
            <CardTitle>
              {invite ? `Thanks, ${invite.charge.customerName.split(" ")[0]}.` : "Thanks."}
            </CardTitle>
            <p className="text-sm text-[var(--rd-muted)]">
              Payment went through. One sentence for the next buyer — or skip.
              This is not another account. It sits on the receipt you already paid.
            </p>
          </CardHeader>
          <CardContent>
            {blocked || !invite ? (
              <div className="space-y-4">
                <Alert variant="danger">{blocked}</Alert>
                {invite ? (
                  <Link
                    href={`/review/find/${invite.brand.slug}`}
                    className="text-sm font-semibold text-[var(--rd-forest)]"
                  >
                    Lost this page? Look up the order
                  </Link>
                ) : (
                  <Link href="/" className="text-sm font-semibold text-[var(--rd-forest)]">
                    Back home
                  </Link>
                )}
              </div>
            ) : (
              <ReviewForm
                token={token}
                brandName={invite.brand.name}
                amountCents={invite.charge.amountCents}
                currency={invite.charge.currency}
                orderRef={invite.charge.orderRef}
                provider={invite.charge.provider}
                defaultName={invite.charge.customerName}
                skipHref={skipHref}
              />
            )}
          </CardContent>
        </Card>
        <p className="text-center text-xs text-[var(--rd-muted)]">
          Bound by Receipt Doppel · not a screenshot
        </p>
      </div>
    </div>
  );
}
