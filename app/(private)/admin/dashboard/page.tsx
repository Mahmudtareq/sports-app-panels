import { getDashboardStats } from "@/actions/dashboard/dashboardActions";
import DashboardStats from "./_components/DashboardStats";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return (
    <>
      <DashboardStats statsData={stats?.data || {}} />
    </>
  );
}
