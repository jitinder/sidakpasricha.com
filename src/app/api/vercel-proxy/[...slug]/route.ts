import { NextResponse } from "next/server";

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
  queryParams?: string,
  body?: Record<string, unknown>
) {
  const url = new URL(baseUrl);
  if (queryParams) {
    const queryParamsObj = new URLSearchParams(queryParams);
    queryParamsObj.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

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

function parseUrlAndToken(req: Request, slug: string[]) {
  const url = new URL(req.url);
  const shareToken = url.searchParams.get("_vercel_share");

  if (!shareToken) {
    throw new Error("No share token found in URL");
  }

  const joinedPath = slug.join("/");
  const baseUrl = decodeURIComponent(joinedPath);

  // Find any additional path parameters that come after the base URL
  const queryParams = Array.from(url.searchParams.entries())
    .filter(([key]) => key !== "_vercel_share")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return {
    baseUrl,
    shareToken,
    queryParams: queryParams || undefined,
  };
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    const { slug } = await params;
    const { baseUrl, shareToken, queryParams } = parseUrlAndToken(req, slug);
    const data = await proxyRequest("GET", baseUrl, shareToken, queryParams);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    const { slug } = await params;
    const { baseUrl, shareToken, queryParams } = parseUrlAndToken(req, slug);
    const body = await req.json();
    const data = await proxyRequest(
      "POST",
      baseUrl,
      shareToken,
      queryParams,
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
