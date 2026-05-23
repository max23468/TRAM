import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import {
  getCphPilotInventory,
  resolveCphDocumentPath
} from "@/lib/pilot-cph";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const inventory = await getCphPilotInventory();
  const file = inventory?.files.find((item) => item.id === id);

  if (!file) {
    return new NextResponse("Documento non trovato", { status: 404 });
  }

  const filePath = resolveCphDocumentPath(file);

  if (!filePath) {
    return new NextResponse("Path documento non valido", { status: 400 });
  }

  const body = Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>;

  return new NextResponse(body, {
    headers: {
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.fileName)}"`,
      "Content-Type": file.contentType
    }
  });
}
