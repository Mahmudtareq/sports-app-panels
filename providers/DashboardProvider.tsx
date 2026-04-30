"use client";
import DashboardLoader from "@/app/(private)/admin/dashboard/_components/DashboardLoader";
import useAdminProfile from "@/store/useAdminProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const { fetchAdminData, adminData, isLoading, error, isSuccess } =
    useAdminProfile();
  const [mainLoading, setMainLoading] = useState(true);
  const token = session?.token;

  useEffect(() => {
    //  Wait for session to finish loading first
    if (sessionStatus === "loading") return;

    // No session at all — stop loader immediately
    if (sessionStatus === "unauthenticated") {
      setMainLoading(false);
      return;
    }

    if (token && !adminData) {
      fetchAdminData(token);
    }
  }, [fetchAdminData, token, adminData, sessionStatus]);

  useEffect(() => {
    // Success — stop loader
    if (isSuccess && adminData) {
      setMainLoading(false);
    }

    // Error of any kind — stop loader (redirect/error handled in apiClient)
    if (error) {
      setMainLoading(false);
    }
  }, [isSuccess, adminData, error]);

  if (mainLoading || sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DashboardLoader />
      </div>
    );
  }

  return <>{children}</>;
}
