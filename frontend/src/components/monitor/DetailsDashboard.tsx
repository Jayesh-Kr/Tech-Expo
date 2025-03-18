import React from "react";
import { Grid } from "@/components/ui/grid";
import ResponseTimeChart from "./ResponseTimeChart";
import MonitorDetails from "./MonitorDetails";
import RecentEvents from "./RecentEvents";

interface DetailsDashboardProps {
  monitor: {
    chartData: { name: string; responseTime: number }[];
    checkFrequency: number;
  };
}

const DetailsDashboard: React.FC<DetailsDashboardProps> = ({ monitor }) => {
  return (
    <Grid numCols={12} className="gap-6">
      <div className="col-span-12 lg:col-span-8">
        <ResponseTimeChart data={monitor.chartData} />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <MonitorDetails checkFrequency={monitor.checkFrequency} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <RecentEvents />
      </div>
    </Grid>
  );
};

export default DetailsDashboard;
