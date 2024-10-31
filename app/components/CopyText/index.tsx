"use client";

import { useState } from "react";
import { Button } from "@radix-ui/themes";

export default function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return <div className="flex items-center justify-between p-5 border border-dashed border-silver rounded-md bg-opacity-5 bg-blue-500">
    <p className="text-blue-500 text-base">{text}</p>
    <Button variant="outline" onClick={copyToClipboard} className="ml-2">
      {copied ? "Copied!" : "Copy"}
    </Button>
  </div>
}