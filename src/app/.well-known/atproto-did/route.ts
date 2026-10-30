// Proves to Bluesky that this domain belongs to the account, so its handle can be @stackbyte.dev.
export const dynamic = "force-static";

export function GET() {
  return new Response("did:plc:pmiatvxb27mvyheg3ap46v4g\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
