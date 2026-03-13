import DashboardContent from "@/components/DashboardContent";
import { withAuth } from "@/infra/auth";

export const getServerSideProps = withAuth();

export default function Page() {
  return <DashboardContent />;
}
