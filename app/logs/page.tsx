"use client";
import { useLogs } from "../context/LogContext";
// import Image from "next/image";
export default function Logs() {
  const { logs, clearLogs } = useLogs();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Logs</h1>
      <button
        onClick={clearLogs}
        className="bg-red-500 text-white p-2 rounded mb-6"
      >
        Clear Logs
      </button>
      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div
              key={index}
              className={`border p-4 rounded-lg shadow-md flex items-center ${
                log.status === "Success" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex flex-col w-2/3">
                <p className="font-semibold text-black capitalize">
                  User Prompt: <span className="font-normal">{log.prompt}</span>
                </p>
                <p
                  className={`${
                    log.status === "Success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {log.status}
                </p>
                <p className="text-gray-600 text-sm">
                  Generation Time:{" "}
                  {log.generationTime
                    ? `${log.generationTime.toFixed(2)} ms`
                    : "N/A"}
                </p>
              </div>
              {log.imageUrl && (
                <img
                  src={log.imageUrl}
                  alt={`Generated from: ${log.prompt}`}
                  className="md:w-1/12 sm:w-full h-auto rounded-lg shadow-md ml-auto"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No logs available.</p>
        )}
      </div>
      <div className="mt-8 text-center">
        <a href="/" className="text-blue-600 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
