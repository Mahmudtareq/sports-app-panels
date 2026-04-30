"use client";

import {
  getTestimonialList,
  shortsTestimonialLists,
} from "@/actions/testimonial/testimonialActions";
import { DataTableWithPagination } from "@/components/custom/data-table/DataTableWithPagination";
import { ToastMessage } from "@/components/custom/ToastMessage";
import { useTableState } from "@/store/useTableStore";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import TestimonialTableToolbar from "./TestimonialTableToolbar";

export default function TestimonialList() {
  const tableId = "testimonial";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refresh, handleRefresh, search, filters } = useTableState(tableId);

  const fetchTestimonial = async () => {
    try {
      const result = await getTestimonialList();
      setData(result?.data || []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTestimonial();
  }, [refresh]);

  // Handle drag & drop
  const handleDataChange = async (sortedIds: string[]) => {
    const loading = ToastMessage.loading({
      title: "Updating testimonial order...",
    });
    try {
      const response = await shortsTestimonialLists({ sortedIds });

      if (!response.status) {
        ToastMessage.error(
          {
            title: response?.message || "Failed to update sorts table",
          },
          { id: loading },
        );
        return;
      }
      ToastMessage.success(
        {
          title: response?.message || "Testimonial order updated successfully!",
        },
        { id: loading },
      );
    } catch (error: any) {
      ToastMessage.error(
        { title: "Your session has expired!" },
        { id: loading },
      );
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <TestimonialTableToolbar tableId={tableId} />
      <DataTableWithPagination
        data={data}
        columns={columns}
        // total={total}
        tableId={tableId}
        isLoading={isLoading}
        onSortEnd={handleDataChange}
        pagination={false}
      />
    </div>
  );
}
