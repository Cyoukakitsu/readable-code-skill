// POST /api/watchlist — 把 symbol 加入当前用户的关注列表
import { z } from "zod";
import { getAuthSession } from "@/features/auth/server/auth-helper";

const bodySchema = z.object({ symbol: z.string().trim().min(1).max(12) });

export async function POST(request: Request) {
  // 请求体来自客户端，必须校验
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "invalid symbol" }, { status: 400 });
  }

  const { supabase, user } = await getAuthSession();
  const { error } = await supabase
    .from("watchlist")
    .upsert({ user_id: user.id, symbol: parsed.data.symbol.toUpperCase() });

  if (error) {
    return Response.json({ error: "failed to save" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
