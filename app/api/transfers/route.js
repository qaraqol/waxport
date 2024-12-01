import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account") || searchParams.get("from");
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 50;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const symcode = searchParams.get("symcode");
  const query = new URLSearchParams({
    account,
    ...(from && { from }),
    ...(to && { to }),
    ...(symcode && { symcode }),
    limit,
    page,
  }).toString();
  const response = await fetch(`${process.env.API_URL}?${query}`, {
    headers: {
      "X-Api-Key": process.env.API_KEY,
    },
  });
  if (!response.ok) {
    return NextResponse.json({
      ok: false,
      status: false,
      message: "API Error",
    });
  }

  const result = await response.json();
  return NextResponse.json({
    ok: true,
    data: result.data,
    meta: result.meta,
  });
}
