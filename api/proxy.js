export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  // 目标真实业务API地址
  const targetAPI = "http://gdey.ruijiadashop.cn/api/card/intelligentDetection";
  const targetUrl = new URL(targetAPI);

  // 把前端携带的dev_no参数完整透传给目标接口
  searchParams.forEach((val, key) => {
    targetUrl.searchParams.set(key, val);
  });

  // 全局CORS跨域配置，允许你的Gist网页跨域调用
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "*"
  };

  // 处理浏览器OPTIONS预检跨域请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // 转发请求到真实接口，8秒超时防止卡死
    const resp = await fetch(targetUrl.toString(), {
      method: "GET",
      signal: AbortSignal.timeout(8000)
    });
    const respText = await resp.text();

    // 原样返回接口数据，附加跨域头
    return new Response(respText, {
      status: resp.status,
      headers: {
        ...Object.fromEntries(resp.headers),
        ...corsHeaders
      }
    });
  } catch (err) {
    // 捕获转发异常，返回友好错误提示
    return new Response(JSON.stringify({
      code: 502,
      msg: "API代理转发失败：" + err.message
    }), {
      status: 502,
      headers: corsHeaders
    });
  }
}