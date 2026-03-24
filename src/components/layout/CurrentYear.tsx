"use client";

import { useState, useEffect } from "react";

/**
 * Renders the current year only on the client to avoid hydration mismatch
 * when the server and client render at different times across year boundaries.
 */
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <>{year ?? "2025"}</>;
}
