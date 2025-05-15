"use client";

import * as React from "react";
import { useCluster } from "./cluster-data-access";

export function ExplorerLink({
    path,
    label,
    className,
}: {
    path: string;
    label: string;
    className?: string;
}) {
    const cluster = useCluster();
    // 确保 getExplorerUrl 函数存在
    const explorerUrl = cluster?.getExplorerUrl
        ? cluster.getExplorerUrl(path)
        : `https://explorer.solana.com/${path}?cluster=devnet`;

    return (
        <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={className ? className : `link font-mono`}
        >
            {label}
        </a>
    );
}
