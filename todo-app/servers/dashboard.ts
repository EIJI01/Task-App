import { API_GET } from "@/lib/api-requests";
import { verifySession } from "./session";
import { Api_Response, AreaChartType, AreaThisMonthChartType, Error_Response } from "@/lib/types";

export async function getAreaCharInfo(): Promise<Api_Response<AreaChartType[]> | Error_Response> {
  const session = await verifySession();
  const response = await API_GET<AreaChartType[]>("/dashboard/area-chart", undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return response;
}

export async function getAreaThisMonthCharInfo(): Promise<
  Api_Response<AreaThisMonthChartType[]> | Error_Response
> {
  const session = await verifySession();
  const response = await API_GET<AreaThisMonthChartType[]>("/dashboard/area-thisMonth-chart", undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}
