"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { ThemeProvider } from "./theme-provider";

export default function ClientProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
