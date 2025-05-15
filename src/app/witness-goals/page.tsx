"use client";

import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { useGetWitnessGoals } from "@/hooks/useGetWitnessGoals";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function WitnessGoalsPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { data: goals, isLoading } = useGetWitnessGoals();
    const [activeTab, setActiveTab] = useState("active");

    const filteredGoals = goals?.filter((goal) => {
        if (!goal) return false;
        if (!goal.goal) return false;

        if (activeTab === "all") return true;
        const status = goal.goal.status;
        switch (activeTab) {
            case "active":
                return status === 0;
            case "completed":
                return status === 1;
            case "failed":
                return status === 2;
            default:
                return true;
        }
    });

    // console.log("filteredGoals: ", JSON.stringify(filteredGoals, null, 2));

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t("witnessGoals")}</h1>
                <Button
                    onClick={() => router.push("/create")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    {t("createNewGoal")}
                </Button>
            </div>

            <Tabs
                defaultValue="active"
                className="mb-8"
                onValueChange={setActiveTab}
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">
                        {language === "zh" ? "全部" : "All"}
                    </TabsTrigger>
                    <TabsTrigger value="active">{t("inProgress")}</TabsTrigger>
                    <TabsTrigger value="completed">
                        {t("completed")}
                    </TabsTrigger>
                    <TabsTrigger value="failed">{t("failed")}</TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredGoals?.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">
                        {activeTab === "all"
                            ? language === "zh"
                                ? "还没有见证的目标"
                                : "No goals to witness yet"
                            : activeTab === "active"
                            ? language === "zh"
                                ? "没有进行中的目标"
                                : "No goals in progress"
                            : activeTab === "completed"
                            ? language === "zh"
                                ? "没有已完成的目标"
                                : "No completed goals"
                            : language === "zh"
                            ? "没有失败的目标"
                            : "No failed goals"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {language === "zh"
                            ? "你还没有被邀请见证任何目标"
                            : "You haven't been invited to witness any goals yet"}
                    </p>
                    <Button
                        onClick={() => router.push("/create")}
                        variant="outline"
                        className="mx-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        {language === "zh" ? "创建目标" : "Create Goal"}
                    </Button>
                </div>
            ) : (
                <div
                    className={`grid gap-6 ${
                        filteredGoals?.length === 1
                            ? "grid-cols-1 md:grid-cols-2"
                            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                >
                    {filteredGoals
                        .filter((goal) => goal !== null && goal.goal !== null)
                        .map((goal) => (
                            <GoalCard
                                key={goal.goal.goalId.toString()}
                                goal={goal.goal}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
