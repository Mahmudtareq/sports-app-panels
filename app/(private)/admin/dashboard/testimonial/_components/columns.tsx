"use client";

import { Button } from "@/components/ui/button";
import { truncateText } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import TestimonialDeleteModal from "./TestimonialDeleteModal";
import TestimonialFormModal from "./TestimonialFormModal";
import TestimonialStatusChange from "./TestimonialStatusChange";
import { Category } from "./types";

export const columns: ColumnDef<Category>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image;

      return (
        <div className="relative w-12.5 h-12.5 overflow-hidden rounded">
          <img
            src={imageUrl}
            alt={row.original.authorName}
            width={50}
            height={50}
            className="object-cover h-full w-full"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "authorName",
    header: "AuthorName",
  },
  {
    accessorKey: "authorRole",
    header: "AuthorRole",
  },
  {
    accessorKey: "quote",
    header: "Quote",
    cell: ({ getValue }) => {
      const text = getValue<string>() || "";
      const limit = 110;

      return <span>{truncateText(text, limit, true)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Visibility",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <TestimonialStatusChange
          testimonialId={category?._id}
          initialStatus={category.status || false}
        />
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const testimonial = row.original;

      return (
        <div className="flex items-center gap-2">
          <TestimonialFormModal isEditMode={true} testimonial={testimonial} />
          <TestimonialDeleteModal
            testimonialId={testimonial?._id}
            trigger={
              <Button
                variant="outline"
                className="flex items-center cursor-pointer hover:bg-red-500 hover:text-white text-red-500 dark:hover:bg-red-500"
              >
                <Trash2 className="h-4 w-4 hover:text-white" />
              </Button>
            }
          />
        </div>
      );
    },
  },
];
