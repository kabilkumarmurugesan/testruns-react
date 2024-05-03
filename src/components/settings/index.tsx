import React from "react";
import { SettingsLayout } from "./SettingsLayout";

export const withSettingsLayout = (WrappedComponent: any) => {
  return (props: any) => (
    <SettingsLayout>
      <WrappedComponent {...props} />
    </SettingsLayout>
  );
};
