"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CompanySize } from "@/data/company-profiles";

interface SettingsContextType {
  companySize: CompanySize;
  setCompanySize: (size: CompanySize) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "iso-compliance-settings";

interface StoredSettings {
  companySize: CompanySize;
  companyName: string;
}

function getStoredSettings(): StoredSettings {
  if (typeof window === "undefined") {
    return { companySize: "startup", companyName: "내 회사" };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const settings: StoredSettings = JSON.parse(stored);
      return {
        companySize: settings.companySize || "startup",
        companyName: settings.companyName || "내 회사",
      };
    }
  } catch {
    // Ignore errors
  }
  return { companySize: "startup", companyName: "내 회사" };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [companySize, setCompanySizeState] = useState<CompanySize>(() => getStoredSettings().companySize);
  const [companyName, setCompanyNameState] = useState(() => getStoredSettings().companyName);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      const settings: StoredSettings = { companySize, companyName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore errors
    }
  }, [companySize, companyName]);

  const setCompanySize = useCallback((size: CompanySize) => {
    setCompanySizeState(size);
  }, []);

  const setCompanyName = useCallback((name: string) => {
    setCompanyNameState(name);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        companySize,
        setCompanySize,
        companyName,
        setCompanyName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
