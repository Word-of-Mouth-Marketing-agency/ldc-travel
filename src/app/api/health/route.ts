export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", service: "ldc-travel" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
