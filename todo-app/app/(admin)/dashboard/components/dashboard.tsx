import { AreaChartType, AreaThisMonthChartType } from "@/lib/types";
import { AreaChartCustom } from "./area-chart";
import { BarChartCustom } from "./bar-chart";
import { BarChartTwoCustom } from "./bar-chart-two";
import { PieChartCustom } from "./pie-chart";

type DashboardProps = {
  areaInfo: { data: AreaChartType[] | null };
  areaThisMonthInfo: { data: AreaThisMonthChartType[] | null };
};
export function Dashboard(props: DashboardProps) {
  return (
    <div className="grid grid-flow-row grid-row-2 gap-2">
      <div className="grid grid-cols-4 grid-flow-col">
        <div className="col-span-2">
          <AreaChartCustom {...props.areaInfo} />
        </div>
        <div className="col-span-1">
          <PieChartCustom />
        </div>
        <div className="col-span-1">
          <BarChartCustom />
        </div>
      </div>
      <div className="col-span-1">
        <BarChartTwoCustom data={props.areaThisMonthInfo.data} />
      </div>
    </div>
  );
}
