exports.handler = async (event) => {
    const { queryStringParameters, httpMethod } = event;
    const dev_no = queryStringParameters.dev_no;

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json;charset=utf-8"
    };

    // 跨域预检直接放行
    if (httpMethod === "OPTIONS") {
        return { statusCode: 204, headers };
    }

    try {
        const targetUrl = `http://gdey.ruijiadashop.cn/api/card/intelligentDetection?dev_no=${dev_no}`;
        // 超时拉长至15秒，避免大数据量响应被提前切断
        const resp = await fetch(targetUrl, {
            timeout: 15000,
            redirect: "follow"
        });

        // 完整读取原始字符串，再解析JSON
        const rawText = await resp.text();
        const data = JSON.parse(rawText);

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
                detail: err.message
            })
        };
    }
};
