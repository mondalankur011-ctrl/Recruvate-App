import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { base44 } from "@/api/base44Client";
import { ArrowUpRight, Rocket } from "lucide-react";
import PipelineBars from "@/components/process/PipelineBars";
import ApplicationCard from "@/components/process/ApplicationCard";
import PullToRefresh from "@/components/app/PullToRefresh";

export default function ProcessBar() {
  const { user } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const loadData = useCallback(async () => {
    const records = await base44.entities.Application.filter({ created_by_id: user.id });
    const sorted = [...records].sort(
      (a, b) =>
        new Date(b.applied_at || b.created_date).getTime() -
        new Date(a.applied_at || a.created_date).getTime()
    );
    setApplications(sorted);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadData().finally(() => setLoading(false));
  }, [user, loadData]);

  return (
    <PullToRefresh onRefresh={loadData}>
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Process bar
          </p>
          <h1 className="mt-1.5 font-heading text-[26px] font-black leading-[1.1] tracking-tight text-foreground">
            Every application, <span className="brand-text-gradient">tracked.</span>
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/50">
            Your 48-hour response window starts the moment you apply.
          </p>
        </div>

        {loading ? (
          <div className="h-[228px] animate-pulse rounded-[24px] bg-card/70" />
        ) : (
          <PipelineBars applications={applications} />
        )}

        {!loading && applications.length === 0 && (
          <div className="rounded-[24px] bg-card px-5 py-9 text-center">
            <Rocket className="mx-auto h-7 w-7 text-primary" />
            <p className="mt-3 font-heading text-[15px] font-extrabold text-foreground">
              No applications yet
            </p>
            <p className="mx-auto mt-1 max-w-[240px] text-sm leading-relaxed text-foreground/50">
              Apply to a role from Open Jobs and it lands here with its response timer.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex h-11 items-center rounded-xl brand-gradient px-5 text-sm font-bold text-white press"
            >
              Browse open jobs
            </Link>
          </div>
        )}

        {applications.length > 0 && (
          <div className="space-y-3">
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
              Your applications
            </p>
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} now={now} />
            ))}
          </div>
        )}

        <div className="relative overflow-hidden rounded-[22px] bg-card p-4 pl-5 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
          <span className="absolute inset-y-0 left-0 w-1.5 brand-gradient" />
          <p className="text-sm leading-relaxed text-foreground/75">
            Facing rejections along the way? No worries, we've got your back. Let's turn those 'no's'
            into your next big breakthrough together.
          </p>
          <a
            href="https://talent.recruvate.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-11 items-center gap-1.5 rounded-xl bg-foreground px-4 text-sm font-bold text-background press"
          >
            Explore talent.recruvate.in <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </PullToRefresh>
  );
}
