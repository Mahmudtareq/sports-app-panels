import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string;
}

export function DynamicBreadcrumb({
  items,
  className,
}: DynamicBreadcrumbProps) {
  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrentPage = item.isCurrentPage || isLast;

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {isCurrentPage ? (
                    <BreadcrumbPage className="text-primary font-dm-sans font-medium text-sm">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href || "#"}
                        className="font-dm-sans font-medium hover:text-primary text-sm"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="ms-1.5" />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
