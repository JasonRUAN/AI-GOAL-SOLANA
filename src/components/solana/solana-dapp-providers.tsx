"use client";

import { ReactQueryProvider } from "./react-query-provider";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { ClusterProvider } from "./cluster-data-access";

export function SolanaDappProviders({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ReactQueryProvider>
            <ClusterProvider>
                <SolanaProvider>{children}</SolanaProvider>
            </ClusterProvider>
        </ReactQueryProvider>
    );
}
