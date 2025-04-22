import { type ReactNode, Suspense } from "react";

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<div className="p-4">Loading...</div>}>{children}</Suspense>;
};
