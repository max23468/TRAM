import { NextResponse } from "next/server";

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#12312b"/>
  <path d="M16 18h32v7H36v25h-8V25H16z" fill="#f4efe4"/>
</svg>`;

export function GET() {
  return new NextResponse(icon, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml"
    }
  });
}
