import { NextResponse } from "next/server";

export async function GET() {
  console.log("coming here");

  try {
    const response = await fetch(
      // "https://api.magicapi.dev/api/v1/account/usage",
      "https://api.market/account/subscriptions",
      {
        headers: {
          accept: "application/json",
          "x-magicapi-key": process.env.API_KEY || "",
        },
      }
    );

    const data = await response.json();
    console.log(data, "##############");

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch usage data");
    }

    return NextResponse.json({
      dailyQuota: data.dailyQuota,
      used: data.used,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
