"use server";
import React from "react";
import { Dashboard } from "./components/dashboard";
import { getAreaCharInfo, getAreaThisMonthCharInfo } from "@/servers/dashboard";

export default async function DashboardPage() {
  const area = await getAreaCharInfo();
  const areaThisMonth = await getAreaThisMonthCharInfo();

  const areaInfo = {
    data: area.success ? area.data : null,
  };
  const areaThisMonthInfo = {
    data: areaThisMonth.success ? areaThisMonth.data : null,
  };

  return <Dashboard areaInfo={areaInfo} areaThisMonthInfo={areaThisMonthInfo} />;
}
