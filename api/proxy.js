export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetAPI = "http://gdey.ruijiadashop.cn/api/card/intelligentDetection";
    const targetUrl = new URL(targetAPI);

    searchParams.forEach((val, key) => {
      targetUrl.searchParams.set(key, val);
    });

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "*"
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const res = await fetch(targetUrl.toString(), {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      redirect: "follow"
    });

    const raw = await res.text();
    return new Response(raw, {
      status: res.status,
      headers: { ...Object.fromEntries(res.headers), ...corsHeaders }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      code: 502,
      msg: "代理调用失败：" + String(err)
    }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
