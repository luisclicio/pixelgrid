export function UmamiAnalytics() {
  return (
    <script
      defer
      src={process.env.ANALYTICS_UMAMI_URL}
      data-website-id={process.env.ANALYTICS_UMAMI_ID}
    ></script>
  );
}
