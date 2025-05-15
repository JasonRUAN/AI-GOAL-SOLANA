"use client";

import { ConnectButton } from "@mysten/dapp-kit";

export function NavBar() {
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 border-b bg-white z-50">
                <div className="text-xl font-bold">AI GOAL</div>
                <div>
                    <ConnectButton />
                </div>
            </nav>
            <div className="h-[64px]"></div>
        </>
    );
}
