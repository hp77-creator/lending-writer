import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string; documentName: string }> }
) {
  const resolvedParams = await params;
  const { appId, documentName } = resolvedParams;

  try {
    // Navigate up to the root project directory, then into data/documents
    const filePath = path.join(
      process.cwd(),
      "..",
      "data",
      "documents",
      appId,
      documentName
    );

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse("Document not found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    // Return the file as a PDF
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${documentName}"`,
      },
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
