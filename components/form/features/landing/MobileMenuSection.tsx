import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/public/sample-data/photography-sample-data";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";

const MobileMenuSection = ({ isScrolled }: any) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden  cursor-pointer">
          {/* <Menu className=" text-black dark:text-white" /> */}
          <HiMenuAlt3
            className={`${
              isScrolled ? "text-black" : "text-white"
            }  dark:text-white h-6 w-6`}
          />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white dark:bg-black">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <h1
                className={`text-lg uppercase urbanist-extrabold transition-colors duration-300 `}
              >
                MOMENT
                <span className={`text-[#6B6B6B]`}>O</span>
              </h1>
            </Link>

            <button
              className=" h-[20px] w-[20px] flex items-center justify-center cursor-pointer"
              onClick={handleNavClick}
            >
              <X className=" h-5 w-5 dark:text-white" />
            </button>
          </div>
        </SheetHeader>
        <div className="md:hidden bg-white dark:bg-black ">
          <div className="container px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => {
              // ✅ Clean route-only active detection
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 text-[16px] montserrat-semibold transition-colors ${
                    isActive
                      ? "text-[#1F1F1F] dark:text-[#F9FAFB] font-black helvetica-neue-regular border-b border-[#1A1A1A] pb-1 "
                      : "text-[#6B7280] hover:text-[#1F1F1F] dark:text-[#9CA3AF] border-b border-[#DDD] pb-1"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuSection;
