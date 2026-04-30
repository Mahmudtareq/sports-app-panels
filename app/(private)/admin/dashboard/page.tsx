import { getDashboardStats } from "@/actions/dashboard/dashboardActions";
import DashboardStats from "./_components/DashboardStats";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return (
    <div>
      <DashboardStats statsData={stats?.data || {}} />
    </div>
  );
}
