exports.handler = async (event) => {
    const { queryStringParameters, httpMethod } = event;
    const dev_no = queryStringParameters.dev_no;

    // CORS跨域头
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json"
    };

    // 预检OPTIONS直接放行
    if (httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers
        };
    }

    try {
        const targetUrl = `http://gdey.ruijiadashop.cn/api/card/intelligentDetection?dev_no=${dev_no}`;
        const resp = await fetch(targetUrl, { timeout: 8000 });
        const data = await resp.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };
    } catch (err) {
        return {
            statusCode: 502,
            headers,
            body: JSON.stringify({
                code: 502,
                msg: "代理转发失败",
                error: String(err)
            })
        };
    }
};
