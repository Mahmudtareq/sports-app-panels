import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { House } from "lucide-react";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";
export const metadata = generatePageMetadata(PAGE_METADATA.LOGIN);

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-4 md:p-10">
      <div className="w-full md:max-w-4xl">
        <div className="flex w-full">
          <Card className="w-full max-w-lg rounded-l-xl md:rounded-r-none md:border-none shadow-none md:p-6 p-3">
            <CardHeader className="flex flex-col justify-center items-center">
              <Link href={`/`} className="bg-primary rounded-full p-2">
                <House className="text-white" />
              </Link>
              <CardTitle className="text-2xl font-semibold font-jost text-foreground">
                Admin Login
              </CardTitle>
              <p className="text-base text-muted-foreground mt-1 font-jost">
                Sign in to access your dashboard
              </p>
            </CardHeader>

            <CardContent>
              {/* Wrap with FormProvider */}
              <LoginForm />
              <div className="text-center mt-4 text-xs text-muted-foreground">
                © {new Date().getFullYear()} Admin Panel. All rights reserved.
              </div>
            </CardContent>
          </Card>

          {/* Right-side image */}
          {/* <div className="relative hidden md:block h-112.5 w-full">
            <Image
              // height={500}
              // width={500}
              fill
              src="/images/landing-hero/login-image.webp"
              alt="Login illustration"
              className="absolute inset-0 h-full w-full object-cover md:rounded-r-xl"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
