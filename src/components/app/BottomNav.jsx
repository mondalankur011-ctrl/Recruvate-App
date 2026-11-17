import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Briefcase, User } from "lucide-react";

const TABS = [
  { to: "/", label: "Open Jobs", icon: Briefcase, end: true },
  { to: "/process", label: "Process Bar", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-[0_-10px_30px_-24px_rgba(23,21,34,0.6)] backdrop-blur-md">
      <div className="safe-bottom mx-auto flex max-w-md items-stretch justify-around px-3 pt-1.5">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors duration-200 ${
                isActive ? "text-primary" : "text-foreground/40"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                    isActive ? "bg-primary/10" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-[21px] w-[21px]" strokeWidth={isActive ? 2.4 : 1.9} />
                </span>
                <span className="text-[10px] font-bold tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
