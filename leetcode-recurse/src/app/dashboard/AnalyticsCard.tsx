interface AnalyticsCardType {
  titleHeader: string;
  count: number;
}
export default function AnalyticsCard({
  titleHeader,
  count,
}: AnalyticsCardType) {
  return (
    <div className="">
      <div className="">{titleHeader}</div>
      <div className="">{count}</div>
    </div>
  );
}
