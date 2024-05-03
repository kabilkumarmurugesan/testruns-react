import React from "react";
import { CardLayout } from "./CardLayout";

export const withCardLayout = (WrappedComponent: any) => {
  return (props: any) => (
    <CardLayout>
      <WrappedComponent {...props} />
    </CardLayout>
  );
};
