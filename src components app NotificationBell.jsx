import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, BellRing } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function NotificationBell({ user }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const records = await base44.entities.Notification.filter({ created_by_id: user.id });
      setItems(
        [...records].sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      );
    };
    load();
  }, [user]);

  const unread = items.filter((item) => !item.read).length;

  const handleOpenChange = async (next) => {
    setOpen(next);
    if (!next || unread === 0) return;
    const patch = items.filter((item) => !item.read).map((item) => ({ id: item.id, read: true }));
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    await base44.entities.Notification.bulkUpdate(patch);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-foreground/60 press"
      >
        {unread > 0 ? <BellRing className="h-5 w-5 text-primary" /> : <Bell className="h-5 w-5" />}
        {unread > 0 && (
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-[86vw] max-w-sm border-l-border bg-background p-0">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="font-heading text-[17px] font-extrabold text-foreground">
              Notifications
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-2.5 overflow-y-auto px-4 py-4">
            {items.length === 0 && (
              <p className="rounded-2xl bg-card px-4 py-6 text-center text-sm text-foreground/45">
                Nothing here yet. We'll nudge you when your resume needs a refresh.
              </p>
            )}
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-card p-4">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/55">{item.message}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                  {new Date(item.created_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
