import React from "react";
export interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[]; // Allowed roles for this route
  }