"use client";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLogs } from "./context/LogContext";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const { logs, addLog } = useLogs();
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [visibleHistoryCount, setVisibleHistoryCount] = useState<number>(5);
  const [apiUsage, setApiUsage] = useState<{
    used: number;
    dailyQuota: number;
  } | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const cache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const handleScroll = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setVisibleHistoryCount((prev) => prev + 5);
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleScroll);
    const currentObserver = observer.current;

    if (document.querySelector("#load-more")) {
      currentObserver.observe(document.querySelector("#load-more")!);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchApiUsage = async () => {
      try {
        const response = await fetch("/api/usage");
        const data = await response.json();
        if (response.ok) {
          setApiUsage(data);
        } else {
          setApiUsage(null);
        }
      } catch (error) {
        setApiUsage(null);
      }
    };

    fetchApiUsage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === "") {
      setError("Text prompt cannot be empty");
      return;
    }
    setError(null);
    setIsLoading(true);

    const startTime = performance.now();

    if (cache.current.has(prompt)) {
      const cachedImageUrl = cache.current.get(prompt)!;
      const generationTime = performance.now() - startTime;
      setImageUrl(cachedImageUrl);
      setGenerationTime(generationTime);
      addLog({
        prompt,
        status: "Cached",
        imageUrl: cachedImageUrl,
        generationTime,
      });
      setIsLoading(false);
      setPrompt(""); // Clear the input field
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const generationTime = performance.now() - startTime;

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      cache.current.set(prompt, data.imageUrl);
      setImageUrl(data.imageUrl);
      setGenerationTime(generationTime);
      setImageLoading(true);
      addLog({
        prompt,
        status: "Success",
        imageUrl: data.imageUrl,
        generationTime,
      });
      setPrompt(""); // Clear the input field after successful generation
    } catch (error: unknown) {
      const generationTime = performance.now() - startTime;

      if (error instanceof Error) {
        setError(error.message);
        addLog({
          prompt,
          status: "Failed",
          error: error.message,
          generationTime,
        });
      } else {
        const unknownError = "An unknown error occurred";
        setError(unknownError);
        addLog({
          prompt,
          status: "Failed",
          error: unknownError,
          generationTime,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (url: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "generated-image.jpg"); // or the desired file name and extension
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch(() => setError("Failed to download image"));
  };

  const getApiUsageColor = (
    usage: { used: number; dailyQuota: number } | null
  ) => {
    if (!usage) return "text-gray-600";
    const percentageUsed = (usage.used / usage.dailyQuota) * 100;
    if (percentageUsed < 50) return "text-green-600";
    if (percentageUsed < 80) return "text-yellow-600";
    return "text-red-600";
  };

  const shouldDisplayHistory = logs.some((log) => log.imageUrl);

  return (
    <>
      <Head>
        <title>MagicAPI</title>
        <meta name="description" content="Magic API." />
        <meta name="keywords" content="next.js, SEO, react" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container mx-auto p-4">
        <div className="sticky top-0 z-50 rounded shadow-md p-4 mb-6 flex justify-between items-center">
          <div
            className={`text-xl font-semibold ${getApiUsageColor(apiUsage)}`}
          >
            {apiUsage
              ? `API Usage: ${apiUsage.used}/${apiUsage.dailyQuota}`
              : ""}
          </div>
          <Link href="/logs" className="text-blue-600 hover:underline">
            View Logs
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">
          Text to Image Generator
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a text prompt"
            className="border border-gray-300 p-2 rounded w-full max-w-lg text-black"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </form>

        {imageUrl && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold">Generated Image:</h2>
            {imageLoading && (
              <div className="flex justify-center mt-4">
                <ClipLoader color="#36d7b7" size={50} />
              </div>
            )}
            <img
              src={imageUrl}
              alt="Generated"
              className={`mt-4 mx-auto shadow-md rounded-lg transition-opacity duration-500 ease-in-out ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
            />
            {generationTime !== null && (
              <p className="text-gray-600 mt-2">
                Generation Time: {generationTime.toFixed(2)} ms
              </p>
            )}
            <button
              onClick={() => downloadImage(imageUrl)}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
            >
              Download Image
            </button>
          </div>
        )}

        {imageUrl && shouldDisplayHistory && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">History:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {logs.slice(0, visibleHistoryCount).map((item, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-md flex flex-col"
                >
                  <p className="font-semibold mb-4 capitalize">
                    User Prompt:{" "}
                    <span className="font-normal ">{item.prompt}</span>
                  </p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={`Generated from: ${item.prompt}`}
                      className="rounded-lg shadow-md w-full lazyload"
                    />
                  )}
                  <p className="mt-4">Status: {item.status}</p>
                  {item.generationTime !== undefined && (
                    <p className="text-gray-600 mt-2">
                      Generation Time: {item.generationTime.toFixed(2)} ms
                    </p>
                  )}
                  {item.status === "Success" && (
                    <button
                      onClick={() => downloadImage(item.imageUrl!)}
                      className="mt-2 bg-green-500 text-white py-1 px-2 rounded"
                    >
                      Download
                    </button>
                  )}
                  {item.status === "Failed" && (
                    <p className="text-red-500">Error: {item.error}</p>
                  )}
                </div>
              ))}
            </div>

            {visibleHistoryCount < logs.length && (
              <div id="load-more" className="mt-4 text-center">
                <p className="text-blue-500">Loading more...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
