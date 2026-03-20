import { z } from "zod";
import { buildAnalysis } from "@/lib/semantic/cloud-engine";
import { featureFlags } from "@/lib/config";
import {
  getAuthenticatedUserFromRequest,
  getUsageStatus,
  recordAnalysisUsage
} from "@/lib/usage/service";

const schema = z.object({
  prompt: z.string().min(12),
  focus: z.enum(["western", "eastern", "all"]),
  depth: z.number().int().min(1).max(5)
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await getAuthenticatedUserFromRequest(request);

    if (featureFlags.supabaseEnabled && !user) {
      return Response.json(
        { error: "Login required before running cloud analyses." },
        { status: 401 }
      );
    }

    let usage = user ? await getUsageStatus(user) : null;
    if (usage && !usage.canAnalyze) {
      return Response.json(
        { error: "Free analyses exhausted. Upgrade on the pricing page to continue." },
        { status: 402 }
      );
    }

    const result = await buildAnalysis(body.prompt, body.focus, body.depth);

    if (user) {
      await recordAnalysisUsage({
        user,
        prompt: body.prompt,
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
        providerMode: result.provider.mode
      });
      usage = await getUsageStatus(user);
      result.usage.remainingFreeQueries = usage.remainingFreeQueries;
      result.usage.plan = usage.plan;
    }

    return Response.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid analysis request." }, { status: 400 });
    }

    return Response.json({ error: "Analysis route failed." }, { status: 500 });
  }
}
