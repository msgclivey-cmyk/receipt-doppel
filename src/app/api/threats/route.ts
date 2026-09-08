import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (id) {
    const threat = await prisma.threat.findFirst({
      where: { id, brandId: ctx.brand.id },
    });
    if (!threat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      threat: { ...threat, evidence: JSON.parse(threat.evidenceJson) },
    });
  }

  const threats = await prisma.threat.findMany({
    where: { brandId: ctx.brand.id },
    orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({
    threats: threats.map((t) => ({
      ...t,
      evidence: JSON.parse(t.evidenceJson),
    })),
  });
}

export async function PATCH(req: Request) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const action = String(body.action || "");
    const threat = await prisma.threat.findFirst({
      where: { id, brandId: ctx.brand.id },
    });
    if (!threat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const evidence = JSON.parse(threat.evidenceJson) as {
      checklist: { id: string; label: string; done: boolean; at?: string }[];
      timeline: {
        id: string;
        label: string;
        done: boolean;
        at: string;
        by: string | null;
      }[];
      [key: string]: unknown;
    };

    if (action === "launch_takedown") {
      evidence.checklist = evidence.checklist.map((c) =>
        c.done
          ? c
          : {
              ...c,
              done: true,
              at: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
      );
      evidence.timeline = evidence.timeline.map((t) =>
        t.done
          ? t
          : {
              ...t,
              done: true,
              at: new Date().toLocaleString("en-US"),
              by: ctx.user.name,
            },
      );
      const updated = await prisma.threat.update({
        where: { id },
        data: {
          status: "in_progress",
          evidenceJson: JSON.stringify(evidence),
        },
      });
      return NextResponse.json({
        threat: { ...updated, evidence },
        message: "Takedown launched. Registrar and platform notices queued.",
      });
    }

    if (action === "resolve") {
      const updated = await prisma.threat.update({
        where: { id },
        data: { status: "resolved" },
      });
      return NextResponse.json({
        threat: { ...updated, evidence },
        message: "Threat marked resolved.",
      });
    }

    if (action === "toggle_checklist" && body.checklistId) {
      evidence.checklist = evidence.checklist.map((c) =>
        c.id === body.checklistId
          ? {
              ...c,
              done: !c.done,
              at: !c.done
                ? new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : undefined,
            }
          : c,
      );
      const updated = await prisma.threat.update({
        where: { id },
        data: { evidenceJson: JSON.stringify(evidence) },
      });
      return NextResponse.json({ threat: { ...updated, evidence } });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
