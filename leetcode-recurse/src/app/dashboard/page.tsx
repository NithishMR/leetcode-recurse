import AnalyticsCard from "./AnalyticsCard";
import ProgressOverTime from "./ProgressOverTime";

export default function DashBoard() {
  return (
    <div className="">
      <div className="text-center text-3xl">YOUR PROGRESS AND ANALYTICS</div>
      <div className="flex justify-around items-center">
        <AnalyticsCard titleHeader="Total Problems" count={124} />
        <AnalyticsCard titleHeader="Reviewed Today" count={78} />
        <AnalyticsCard titleHeader="Pending Problems" count={21} />
        <AnalyticsCard titleHeader="Review Overdue" count={6} />
      </div>
      <ProgressOverTime />
    </div>
  );
}
