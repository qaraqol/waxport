import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const account = searchParams.get("account") || searchParams.get("from");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const symcode = searchParams.get("symcode");
    const rows = Math.max(parseInt(searchParams.get("rows"), 10) || 100, 1); // Ensure at least 1 row
    if (rows > 1000) {
      throw new Error("Number of transactions exceed 1000.");
    }

    if (!account) {
      throw new Error("Account parameter is required.");
    }

    let allData = [];
    let page = 1;

    while (allData.length < rows) {
      const query = new URLSearchParams({
        account,
        ...(from && { from }),
        ...(to && { to }),
        ...(symcode && { symcode }),
        limit: 100, // Always fetch 100 rows per page
        page, // Add the current page to the query
      }).toString();

      console.log(`Fetching Page ${page}: ${process.env.API_URL}?${query}`);

      const response = await fetch(`${process.env.API_URL}?${query}`, {
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      });

      console.log(`Page ${page} status:`, response.status);

      if (response.status === 404) {
        console.warn(`Page ${page} returned 404, stopping pagination.`);
        break;
      }

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Failed to fetch data (Page ${page}): ${response.statusText} - ${errorMessage}`
        );
      }

      const result = await response.json();

      if (!result.data?.length) {
        console.log(`No data returned on Page ${page}, stopping pagination.`);
        break;
      }

      allData = allData.concat(result.data);

      // Stop if the API returned fewer than the limit, indicating no further data
      if (result.data.length < 100) {
        console.log(
          `Fewer records returned (${result.data.length}) than limit, stopping.`
        );
        break;
      }

      // Stop if the meta indicates no next page (optional, depending on API)
      if (!result.meta?.next_page) {
        console.log("No next page available in metadata, stopping pagination.");
        break;
      }

      page += 1;
    }

    allData = allData.slice(0, rows); // Limit to requested rows

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
          `"${item.memo?.replace(/"/g, '""') || ""}"`, // Escape quotes in memo
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
