"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { toast } from "sonner";
import { useGetMyStatistics } from "@/hooks/useGetMyStatistics";

import { useWallet } from "@solana/wallet-adapter-react";
import { useGetBalance } from "@/hooks/useGetBalnace";

export default function ProfilePage() {
    const { t } = useLanguage();
    const { publicKey } = useWallet();

    const address = publicKey?.toBase58();

    const { data: sol_balance } = useGetBalance({
        address: publicKey!,
    });

    const { data: categorizedGoals } = useGetMyStatistics();
    console.log(">>>>>>>>>>>> ", categorizedGoals);

    if (!publicKey || !address) {
        return (
            <div className="alert alert-info flex justify-center">
                <span>Please connect your wallet to create an entry.</span>
            </div>
        );
    }

    // const account = useCurrentAccount();
    // const [events, setEvents] = useState<PaginatedEvents | null>(null);

    // const sui_balance = useGetBalance({
    //     address: account?.address || "",
    //     coinType: SUI_COIN_TYPE,
    // });

    // const aig_balance = useGetBalance({
    //     address: account?.address || "",
    //     coinType: AIG_COIN_TYPE,
    // });

    // // 获取事件数据
    // useEffect(() => {
    //     if (account?.address) {
    //         const fetchEvents = async () => {
    //             const eventData = await queryEvents(account.address);
    //             setEvents(eventData);
    //         };
    //         fetchEvents();
    //     }
    // }, [account?.address]);

    // 根据地址生成固定的颜色
    const getRandomColor = (address: string) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-yellow-500",
            "bg-indigo-500",
        ];
        // 将地址转换为数字并取模
        const hash = address
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    // 获取地址的首字母作为头像的备选显示
    const getInitials = (address: string) => {
        return address.substring(address.length - 4).toUpperCase();
    };

    if (!publicKey) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-semibold mb-4">
                    {t("connectWalletFirst")}
                </h2>
                <p className="text-gray-500 mb-6">{t("connectWalletDesc")}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{t("profile")}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 用户基本信息卡片 */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t("accountInfo")}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src="" alt={address} />
                            <AvatarFallback
                                className={`text-xl ${getRandomColor(
                                    address
                                )} text-white`}
                            >
                                {getInitials(address)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="font-semibold">
                                {t("walletAddress")}
                            </h3>
                            <p className="text-sm text-gray-500 break-all mb-4">
                                {address}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    try {
                                        if (navigator && navigator.clipboard) {
                                            navigator.clipboard
                                                .writeText(address)
                                                .then(() => {
                                                    toast.success(
                                                        t("copySuccess")
                                                    );
                                                    console.log(
                                                        "复制成功:",
                                                        address
                                                    );
                                                })
                                                .catch((err) => {
                                                    console.error(
                                                        "复制失败:",
                                                        err
                                                    );
                                                    toast.error(
                                                        t("copyError") ||
                                                            "复制失败"
                                                    );
                                                });
                                        } else {
                                            // console.error("剪贴板API不可用");
                                            // 回退方案：创建临时输入框
                                            const tempInput =
                                                document.createElement("input");
                                            tempInput.value = address;
                                            document.body.appendChild(
                                                tempInput
                                            );
                                            tempInput.select();
                                            document.execCommand("copy");
                                            document.body.removeChild(
                                                tempInput
                                            );
                                            toast.success(t("copySuccess"));
                                        }
                                    } catch (error) {
                                        console.error("复制过程出错:", error);
                                        toast.error(
                                            t("copyError") || "复制失败"
                                        );
                                    }
                                }}
                            >
                                {t("copyAddress")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 用户统计信息卡片 */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t("statistics")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium">
                                    {t("totalGoals")}
                                </h3>
                                <p className="text-3xl font-bold text-primary">
                                    {categorizedGoals?.totalGoals}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium">
                                    {t("completedGoals")}
                                </h3>
                                <p className="text-3xl font-bold text-green-500">
                                    {categorizedGoals?.completedGoals}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium">
                                    {t("pendingGoals")}
                                </h3>
                                <p className="text-3xl font-bold text-yellow-500">
                                    {categorizedGoals?.activeGoals}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium">
                                    {t("failedGoals")}
                                </h3>
                                <p className="text-3xl font-bold text-red-500">
                                    {categorizedGoals?.failedGoals}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 钱包余额卡片 */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t("balance")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium">SOL</h3>
                                <p className="text-3xl font-bold text-primary">
                                    {sol_balance
                                        ? (
                                              Number(sol_balance) /
                                              10 ** 9
                                          ).toFixed(5)
                                        : "-"}
                                </p>
                            </div>

                            {/* <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium">AIG</h3>
                                <p className="text-3xl font-bold text-primary">
                                    {aig_balance
                                        ? (
                                              Number(aig_balance) /
                                              10 ** 3
                                          ).toFixed(2)
                                        : "-"}
                                </p>
                            </div> */}
                        </div>
                    </CardContent>
                </Card>

                {/* 活动卡片
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t("recentActivity")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {events && events.data && events.data.length > 0 ? (
                            <div className="space-y-4">
                                {events.data.slice(0, 5).map((event, index) => {
                                    // 从parsedJson中提取method和amount（如果存在）
                                    let method = "";
                                    let amount = "";

                                    if (
                                        event.parsedJson &&
                                        typeof event.parsedJson === "object" &&
                                        event.parsedJson !== null
                                    ) {
                                        const json = event.parsedJson as Record<
                                            string,
                                            unknown
                                        >;
                                        if ("method" in json) {
                                            method = String(json.method);
                                        }
                                        if ("amount" in json) {
                                            amount = String(json.amount);
                                        }
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    {(method || amount) && (
                                                        <div className="flex gap-2">
                                                            {method && (
                                                                <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                                                                    <span className="font-medium">
                                                                        {t(
                                                                            "rewardMethod"
                                                                        )}
                                                                        :
                                                                    </span>{" "}
                                                                    {method}
                                                                </div>
                                                            )}
                                                            {amount && (
                                                                <div className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full">
                                                                    <span className="font-medium">
                                                                        {t(
                                                                            "rewardAmount"
                                                                        )}
                                                                        :
                                                                    </span>{" "}
                                                                    {(
                                                                        Number(
                                                                            amount
                                                                        ) /
                                                                        10 ** 3
                                                                    ).toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    AIG
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(
                                                        Number(
                                                            event.timestampMs
                                                        )
                                                    ).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-sm text-gray-600">
                                                    TX:{" "}
                                                    <a
                                                        href={`https://testnet.suivision.xyz/txblock/${event.id.txDigest}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {event.id.txDigest.substring(
                                                            0,
                                                            10
                                                        )}
                                                        ...
                                                        {event.id.txDigest.substring(
                                                            event.id.txDigest
                                                                .length - 6
                                                        )}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>{t("noRecentActivity")}</p>
                            </div>
                        )}
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
}
