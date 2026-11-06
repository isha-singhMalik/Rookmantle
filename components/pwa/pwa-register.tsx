"use client";

import { useEffect } from "react";

/** Registers the service worker (production only, so dev hot-reload is never affected). */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Non-fatal: the site works fine without the service worker.
    });
  }, []);
  return null;
}
