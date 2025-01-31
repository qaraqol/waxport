import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const account = searchParams.get("account");
    const startPage = parseInt(searchParams.get("startPage"), 10) || 1;
    const endPage = Math.min(
      parseInt(searchParams.get("endPage"), 10) || 1,
      30
    );

    if (!account) {
      throw new Error("Account parameter is required.");
    }

    if (startPage < 1 || endPage > 30 || startPage > endPage) {
      throw new Error("Invalid page range. Pages must be between 1 and 30.");
    }

    console.log(`Fetching Pages ${startPage} - ${endPage}`);
    let allData = [];
    for (let page = startPage; page <= endPage; page++) {
      const query = new URLSearchParams({
        account,
        page,
        limit: 50, // Fixed page size
      }).toString();
      if (process.env.API_KEY) {
        const response = await fetch(`${process.env.API_URL}?${query}`, {
          headers: {
            "X-Api-Key": process.env.API_KEY,
          },
        });
      } else {
        const response = await fetch(`${process.env.API_URL}?${query}`);
      }

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch data (Page ${page}): ${errorMessage}`);
      }

      const result = await response.json();

      if (!result.data?.length) {
        console.log(`No data returned on Page ${page}, stopping.`);
        break;
      }

      allData = allData.concat(result.data);

      if (result.data.length < 50) {
        console.log(
          `Fewer records returned (${result.data.length}) than limit, stopping.`
        );
        break;
      }
    }

    const headers = [
      "Transaction ID",
      "From",
      "To",
      "Token",
      "Quantity",
      "Memo",
      "Timestamp",
    ];

    const csvData = [
      headers.join(","),
      ...allData.map((item) => {
        const quantity = item.quantity.includes(".")
          ? item.quantity.split(".")[0] +
            "." +
            item.quantity.split(".")[1].slice(0, 2)
          : item.quantity;

        return [
          item.trx_id,
          item.from,
          item.to,
          item.symcode,
          quantity,
          `"${item.memo?.replace(/"/g, '""') || ""}"`,
          new Date(item.timestamp).toLocaleString(),
        ].join(",");
      }),
    ].join("\n");

    return new Response(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${account}-transfers.csv"`,
      },
    });
  } catch (error) {
    console.error("Error generating CSV:", error);

    return NextResponse.json(
      { ok: false, message: "Error generating CSV: " + error.message },
      { status: 500 }
    );
  }
}
