"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type LogItem = {
  generationTime: number;
  prompt: string;
  status: string;
  error?: string;
  imageUrl?: string;
};

type LogContextType = {
  logs: LogItem[];
  addLog: (log: LogItem) => void;
  clearLogs: () => void; // Added function to clear logs
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    // Load logs and images from localStorage when the app starts
    const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]");
    setLogs(storedLogs);
  }, []);

  useEffect(() => {
    const handleTabClose = () => {
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  const addLog = (log: LogItem) => {
    setLogs((prevLogs) => {
      const updatedLogs = [log, ...prevLogs];
      localStorage.setItem("logs", JSON.stringify(updatedLogs)); // Persist to localStorage
      return updatedLogs;
    });
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.clear();
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLogs must be used within a LogProvider");
  }
  return context;
};
