import { Shield } from "lucide-react";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden border border-border/50 shadow-xl">
        {/* ── Left — branding panel ── */}
        <div className="bg-slate-900 p-10  flex-col justify-between hidden md:flex">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Shield className="h-5 w-5 text-slate-400" />
            </div>
            <span className="text-slate-100 font-medium text-sm">
              Admin Panel
            </span>
          </div>

          {/* Main copy */}
          <div className="space-y-5 my-3">
            <h1 className="text-2xl font-semibold text-slate-100 leading-snug">
              Admin Administration
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Manage support requests, monitor performance, and oversee system
              activity.
            </p>
            <div className="space-y-3">
              {[
                { text: "Manage workflows and requests" },
                { text: "Track performance and response times" },
                { text: "Control users and permissions" },
              ].map(({ text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-800 rounded-md flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  </div>
                  <span className="text-slate-500 text-xs">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-700 text-xs">
            © 2026 Admin Panel · All rights reserved XoomSports
          </p>
        </div>

        {/* ── Right — form ── */}
        <div className="bg-white dark:bg-slate-900 md:p-10 p-5 flex flex-col justify-center gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Admin Sign In
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials to access the admin dashboard.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
