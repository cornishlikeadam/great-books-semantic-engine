import { featureFlags } from "@/lib/config";
import { getAuthenticatedUserFromRequest, getAccountSnapshot } from "@/lib/usage/service";

export async function GET(request: Request) {
  const user = await getAuthenticatedUserFromRequest(request);

  if (featureFlags.supabaseEnabled && !user) {
    return Response.json({ error: "Login required." }, { status: 401 });
  }

  if (!user) {
    return Response.json({
      email: null,
      plan: "demo",
      freeAnalysesUsed: 0,
      remainingFreeQueries: 3,
      recentEvents: []
    });
  }

  const snapshot = await getAccountSnapshot(user);
  return Response.json(snapshot);
}
