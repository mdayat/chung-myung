import type { FailedResponse } from "@customTypes/api";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/materials")) {
    const removedBasePath = req.nextUrl.pathname.split("/api/")[1];
    const splittedPath = removedBasePath.split("/");
    if (splittedPath.length === 1 || splittedPath.length === 2) {
      return NextResponse.next();
    }

    const learningMaterialType = splittedPath[2];
    const hasLearningMaterialPath =
      learningMaterialType === "prerequisites" ||
      learningMaterialType === "sub-materials";

    if (hasLearningMaterialPath) {
      return NextResponse.next();
    }

    const bodyPayload: FailedResponse = {
      status: "failed",
      message: "Invalid Resource URL",
    };

    const res = NextResponse.json(bodyPayload, { status: 404 });
    res.headers.set("Content-Type", "application/json");
    return res;
  }
}
