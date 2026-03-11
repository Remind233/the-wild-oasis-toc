import { NextRequest } from "next/server";
import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

// 定义 params 的类型（根据动态路由参数）
type RouteParams = {
  params: Promise<{ cabinId: number }>; // 在 App Router 中 params 是 Promise
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { cabinId } = await params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" }, { status: 404 });
  }
}
