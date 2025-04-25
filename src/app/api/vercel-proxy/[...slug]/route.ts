async function getCookie(baseUrl: string, shareToken: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("_vercel_share", shareToken);
  const response = await fetch(url.toString(), {
    redirect: "manual",
  });
  const cookie = response.headers.get("set-cookie");
  if (!cookie) {
    throw new Error("No cookie received from initial request");
  }
  return cookie;
}

async function proxyRequest(
  method: string,
  baseUrl: string,
  shareToken: string,
  queryParams?: URLSearchParams,
  body?: Record<string, unknown>
) {
  const url = new URL(baseUrl);
  
  // Add all query params except _vercel_share
  queryParams?.forEach((value, key) => {
    if (key !== '_vercel_share') {
      url.searchParams.set(key, value);
    }
  });

  const cookie = await getCookie(baseUrl, shareToken);
  const response = await fetch(url.toString(), {
    method,
    headers: {
      Cookie: cookie,
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function GET(
  request: Request
) {
  try {
    const url = new URL(request.url as string);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const encodedUrl = pathSegments.slice(2).join('/');
    const baseUrl = decodeURIComponent(encodedUrl);
    
    const shareToken = url.searchParams.get('_vercel_share');
    if (!shareToken) {
      return new Response(JSON.stringify({ error: "No share token provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await proxyRequest("GET", baseUrl, shareToken, url.searchParams);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Proxy request failed" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(
  request: Request
) {
  try {
    const url = new URL(request.url as string);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const encodedUrl = pathSegments.slice(2).join('/');
    const baseUrl = decodeURIComponent(encodedUrl);
    
    const shareToken = url.searchParams.get('_vercel_share');
    if (!shareToken) {
      return new Response(JSON.stringify({ error: "No share token provided" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const data = await proxyRequest("POST", baseUrl, shareToken, url.searchParams, body);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Proxy request failed" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}