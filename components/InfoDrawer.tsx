"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { ReactNode } from "react";

type InfoDrawerProps = {
  open: boolean;
  title: string;
  eyebrow?: string;
  ctaLabel?: string;
  children: ReactNode;
  onClose: () => void;
  onCta?: () => void;
};

export function InfoDrawer({
  open,
  title,
  eyebrow,
  ctaLabel,
  children,
  onClose,
  onCta
}: InfoDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 bg-app-text/35 p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-drawer-title"
            className="ml-auto flex h-full w-full max-w-[640px] flex-col overflow-hidden border-[4px] border-app-line bg-app-surface shadow-[8px_8px_0_rgb(var(--color-line))]"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b-[4px] border-app-line bg-app-surface p-5 sm:p-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="mb-2 text-xs font-black uppercase tracking-normal text-app-muted">{eyebrow}</p>
                ) : null}
                <h2
                  id="info-drawer-title"
                  className="break-words text-4xl font-black uppercase leading-[0.95] text-app-text sm:text-5xl"
                >
                  {title}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close info drawer"
                className="focus-ring grid h-11 w-11 shrink-0 place-items-center border-[3px] border-app-line bg-app-elevated text-app-text shadow-[3px_3px_0_rgb(var(--color-line))] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_rgb(var(--color-line))]"
                onClick={onClose}
              >
                <X size={22} strokeWidth={3} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>

            {ctaLabel ? (
              <div className="border-t-[4px] border-app-line bg-app-elevated p-5 sm:p-6">
                <button
                  type="button"
                  className="focus-ring brutal-button flex min-h-12 w-full items-center justify-center gap-2 px-4 text-sm font-black"
                  onClick={onCta}
                >
                  {ctaLabel}
                  <ArrowRight size={18} strokeWidth={3} />
                </button>
              </div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
