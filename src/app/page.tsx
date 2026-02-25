"use client";

import React, { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/dashboard/welcome-screen";
import { MainLayout } from "@/components/dashboard/main-layout";

const loadSavedData = <T,>(key: string, fallbackValue: T): T => {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return fallbackValue;
  }
};

export default function Home() {
  const [isStarted, setIsStarted] = useState(() => loadSavedData('dash_started', false));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("dash_started", JSON.stringify(isStarted));
    }
  }, [isStarted, isClient]);

  if (!isClient) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isStarted) {
    return <WelcomeScreen onStart={() => setIsStarted(true)} />;
  }

  return <MainLayout onSessionReset={() => setIsStarted(false)} />;
}
