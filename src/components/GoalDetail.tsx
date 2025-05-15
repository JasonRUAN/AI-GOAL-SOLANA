"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentDetail, ProgressUpdateDetail } from "@/types/move";
import {
    CalendarDays,
    Clock,
    Coins,
    MessageSquare,
    ThumbsUp,
    Users,
    MessageCircle,
    Check,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useGetAgentByGoalId } from "@/hooks/useGetAgentByGoalId";
import GoalAgent from "./GoalAgent";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { useGetGoalComments } from "@/hooks/useGetGoalComments";
import { useGetGoalProgressUpdates } from "@/hooks/useGetGoalProgressUpdates";
import { ProgressUpdateDialog } from "@/components/ProgressUpdateDialog";
import { ChatBox } from "./ChatBox";
import { useConfirmWitness } from "@/mutations/confirm_witness";
import { useLanguage } from "@/providers/LanguageProvider";
import { CONSTANTS } from "@/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGetOneGoal } from "@/hooks/useGetOneGoal";
import { useCreateComment } from "@/mutations/create_comment";
import { useCompleteGoal } from "@/mutations/complete_goal";
import { PublicKey } from "@solana/web3.js";

interface GoalDetailProps {
    id: string;
}

export function GoalDetail({ id }: GoalDetailProps) {
    const { publicKey } = useWallet();
    const address = publicKey?.toBase58();

    const { language } = useLanguage();
    const [commentText, setCommentText] = useState("");
    const [localComments, setLocalComments] = useState<CommentDetail[]>([]);
    const [localProgressUpdates, setLocalProgressUpdates] = useState<
        ProgressUpdateDetail[]
    >([]);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const aiAssistantRef = useRef<HTMLDivElement>(null);
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [allWitnessesConfirmed, setAllWitnessesConfirmed] = useState(false);

    // 工具函数：确保值是字符串格式
    const getStringValue = (value: string | PublicKey): string => {
        if (
            typeof value === "object" &&
            value !== null &&
            "toBase58" in value
        ) {
            return value.toBase58();
        }
        return String(value);
    };

    const { mutate: createComment, isPending: isSubmittingComment } =
        useCreateComment();

    const { mutate: confirmWitness, isPending: isConfirmingWitness } =
        useConfirmWitness();

    const { mutate: completeGoal, isPending: isCompletingGoal } =
        useCompleteGoal();

    // 从API获取goalAgentId
    const { agent: goalAgent, refetch: refetchAgentId } = useGetAgentByGoalId({
        goalId: Number(id),
    });

    const goalAgentId = goalAgent?.agentId;

    // console.log("goalAgent: ", JSON.stringify(goalAgent, null, 2));
    // console.log("######### goalAgentId >>>", goalAgentId);
    // console.log("######### goalId >>>", id);

    const { data: goalComments, refetch: refetchComments } = useGetGoalComments(
        { goalId: Number(id) }
    );

    const { data: progressUpdates, refetch: refetchProgressUpdates } =
        useGetGoalProgressUpdates({ goalId: Number(id) });

    const {
        goal,
        isLoading: loading,
        error,
        refetch: refetchGoal,
    } = useGetOneGoal({ goalId: Number(id) });

    // console.log("goal: ", JSON.stringify(goal, null, 2));

    // 当远程评论数据更新时，更新本地评论状态
    useEffect(() => {
        if (goalComments) {
            setLocalComments([...goalComments]);
        }
    }, [goalComments]);

    // 当远程进度更新数据更新时，更新本地进度更新状态
    useEffect(() => {
        if (progressUpdates) {
            setLocalProgressUpdates([...progressUpdates]);
        }
    }, [progressUpdates]);

    // 当数据更新时，检查当前用户是否已确认
    useEffect(() => {
        if (goal && address) {
            const goalData = goal;
            const isConfirmed =
                goalData.confirmations &&
                goalData.confirmations.some(
                    (confirmation) => getStringValue(confirmation) === address
                );
            setHasConfirmed(isConfirmed);

            // 检查是否所有见证人都已确认
            const allConfirmed =
                goalData.witnesses.length > 0 &&
                goalData.confirmations &&
                goalData.witnesses.every((witness) =>
                    goalData.confirmations.some(
                        (confirmation) =>
                            getStringValue(confirmation) ===
                            getStringValue(witness)
                    )
                );
            setAllWitnessesConfirmed(allConfirmed);
        }
    }, [goal, address]);

    console.log("goalComments >>>", JSON.stringify(goalComments, null, 2));

    if (error) {
        toast.error(`get goal failed: ${error.message}`);
        return;
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                {language === "zh" ? "加载中..." : "Loading..."}
            </div>
        );
    }

    if (!goal) {
        return (
            <div className="text-center py-12">
                {language === "zh"
                    ? "未找到目标信息"
                    : "Goal information not found"}
            </div>
        );
    }

    const goalData = goal;
    // console.log(")))))goalData: ", JSON.stringify(goalData, null, 2));
    const isCreator = getStringValue(goalData.owner) === address;

    const witnesses = goalData.witnesses;
    const isWitness = witnesses.some(
        (witness: PublicKey) => getStringValue(witness) === address
    );

    console.log("witnesses: ", JSON.stringify(witnesses, null, 2));

    console.log(`isCreator: ${isCreator}, isWitness: ${isWitness}`);

    const getStatusText = (status: number) => {
        switch (status) {
            case 1:
                return language === "zh" ? "已完成" : "Completed";
            case 2:
                return language === "zh" ? "失败" : "Failed";
            default:
                return language === "zh" ? "进行中" : "In Progress";
        }
    };

    const handleCommentSubmit = () => {
        if (!commentText.trim()) {
            toast.error(
                language === "zh"
                    ? "评论内容不能为空"
                    : "Comment cannot be empty"
            );
            return;
        }

        createComment(
            {
                goalId: Number(id),
                content: commentText.trim(),
            },
            {
                onSuccess: () => {
                    toast.success(
                        language === "zh"
                            ? "评论发送成功"
                            : "Comment sent successfully"
                    );

                    // 将新评论添加到本地评论列表
                    setLocalComments((prev) => [...prev]);
                    setCommentText("");

                    // 后台静默刷新数据
                    refetchGoal();
                    refetchComments();
                },
                onError: (error) => {
                    toast.error(
                        language === "zh"
                            ? `评论发送失败: ${error.message}`
                            : `Failed to send comment: ${error.message}`
                    );
                },
            }
        );
    };

    // 处理显示AI助手时的滚动
    const handleToggleAIAssistant = () => {
        setShowAIAssistant(!showAIAssistant);

        // 如果是从隐藏变为显示，等待DOM更新后滚动到AI助手区域
        if (!showAIAssistant) {
            setTimeout(() => {
                aiAssistantRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
        }
    };

    // 处理确认完成按钮点击
    const handleConfirmWitness = () => {
        console.log("handleConfirmWitness: ", id);
        confirmWitness(id, {
            onSuccess: () => {
                toast.success(
                    language === "zh"
                        ? "已成功确认目标完成"
                        : "Successfully confirmed goal completion"
                );
                setHasConfirmed(true); // 立即更新本地状态
                refetchGoal(); // 同时从服务器获取最新状态
            },
            onError: (error) => {
                toast.error(
                    language === "zh"
                        ? `确认失败: ${error.message}`
                        : `Confirmation failed: ${error.message}`
                );
            },
        });
    };

    // 处理完成目标按钮点击
    const handleCompleteGoal = () => {
        completeGoal(
            { goalId: Number(id) },
            {
                onSuccess: () => {
                    toast.success(
                        language === "zh"
                            ? "目标已成功完成！"
                            : "Goal successfully completed!"
                    );
                    refetchGoal(); // 刷新目标数据
                },
                onError: (error) => {
                    toast.error(
                        language === "zh"
                            ? `完成目标失败: ${error.message}`
                            : `Failed to complete goal: ${error.message}`
                    );
                },
            }
        );
    };

    return (
        <div className="container mx-auto px-1">
            <div className="grid gap-8">
                <div className="lg:col-span-2">
                    <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {goalData.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center mt-2">
                                        {language === "zh"
                                            ? "由 "
                                            : "Created by "}
                                        <span className="relative group cursor-text">
                                            <span className="text-blue-500 hover:text-orange-600">
                                                {goalData.owner
                                                    .toBase58()
                                                    .slice(0, 6) +
                                                    "..." +
                                                    goalData.owner
                                                        .toBase58()
                                                        .slice(-4)}
                                            </span>
                                            <span className="absolute left-0 -top-8 min-w-max max-w-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs rounded py-2 px-3 shadow-md transition-opacity duration-300 whitespace-nowrap overflow-visible select-text z-10">
                                                {goalData.owner.toBase58()}
                                            </span>
                                        </span>{" "}
                                        {language === "zh" ? "创建" : ""}
                                    </CardDescription>
                                </div>
                                <Badge
                                    className={`text-white ${
                                        goalData.status === 1
                                            ? "bg-blue-500"
                                            : goalData.status === 2
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                    }`}
                                >
                                    {getStatusText(goalData.status)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                {goalData.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-blue-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "zh"
                                            ? "开始日期"
                                            : "Start Date"}
                                    </span>
                                    <span className="font-medium">
                                        {format(
                                            new Date(
                                                Number(
                                                    goalData.createdAt.toString()
                                                ) * 1000
                                            ),
                                            "yyyy-MM-dd"
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-purple-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "zh"
                                            ? "结束日期"
                                            : "End Date"}
                                    </span>
                                    <span className="font-medium">
                                        {format(
                                            new Date(
                                                Number(
                                                    goalData.deadline.toString()
                                                ) * 1000
                                            ),
                                            "yyyy-MM-dd"
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <Coins className="h-5 w-5 text-green-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "zh" ? "保证金" : "Stake"}
                                    </span>
                                    <span className="font-medium">
                                        {Number(goalData.amount) / 10 ** 9} SOL
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "zh"
                                            ? "剩余天数"
                                            : "Days Left"}
                                    </span>
                                    <span className="font-medium">
                                        {Math.max(
                                            Math.ceil(
                                                (Number(
                                                    goalData.deadline.toString()
                                                ) *
                                                    1000 -
                                                    Date.now()) /
                                                    (1000 * 60 * 60 * 24)
                                            ),
                                            0
                                        )}{" "}
                                        {language === "zh" ? "天" : "days"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                        {language === "zh"
                                            ? "完成进度"
                                            : "Completion Progress"}
                                    </span>
                                    <span>
                                        {goalData.progressPercentage.toString()}
                                        %
                                    </span>
                                </div>
                                <Progress
                                    value={goalData.progressPercentage}
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <span className="font-medium">
                                        {language === "zh"
                                            ? "AI 建议"
                                            : "AI Suggestion"}
                                    </span>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800/30 shadow-lg relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse-slow"></div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-orange-500/30 blur-md animate-pulse-slow"></div>
                                    <div className="absolute -inset-2 bg-gradient-to-r from-red-500/5 to-orange-500/5 blur-xl"></div>
                                    <p className="text-red-600 dark:text-red-300 leading-relaxed relative z-10 whitespace-pre-line">
                                        {goalData.aiSuggestion ||
                                            (language === "zh"
                                                ? "暂无建议"
                                                : "No suggestions yet")}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                                    {language === "zh"
                                        ? `见证人 (${goalData.witnesses.length})`
                                        : `Witnesses (${goalData.witnesses.length})`}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {goalData.witnesses.map(
                                        (witness, index) => {
                                            const isConfirmed =
                                                goalData.confirmations &&
                                                goalData.confirmations.some(
                                                    (confirmation) =>
                                                        confirmation === witness
                                                );

                                            const isCurrentUser =
                                                witness.toString() === address;

                                            // 确保witness是字符串格式
                                            const witnessStr =
                                                typeof witness === "object" &&
                                                witness !== null &&
                                                "toBase58" in witness
                                                    ? witness.toBase58()
                                                    : String(witness);

                                            return (
                                                <div
                                                    key={`witness-${index}`}
                                                    className={`p-2 rounded-md flex items-center bg-gray-50 dark:bg-gray-800/50 ${
                                                        isCurrentUser
                                                            ? "ring-2 ring-blue-300 dark:ring-blue-700"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300 mr-2">
                                                        {index + 1}
                                                    </span>
                                                    <span className="relative group cursor-text flex items-center">
                                                        {isCurrentUser && (
                                                            <span className="absolute -top-2 -left-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                                                {language ===
                                                                "zh"
                                                                    ? "我"
                                                                    : "Me"}
                                                            </span>
                                                        )}
                                                        <span className="text-blue-500 hover:text-orange-600">
                                                            {witnessStr.slice(
                                                                0,
                                                                6
                                                            ) +
                                                                "..." +
                                                                witnessStr.slice(
                                                                    -4
                                                                )}
                                                        </span>
                                                        {isConfirmed && (
                                                            <Check className="h-4 w-4 text-green-500 ml-1.5" />
                                                        )}
                                                        <span className="absolute left-0 -top-8 min-w-max max-w-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs rounded py-2 px-3 shadow-md transition-opacity duration-300 whitespace-nowrap overflow-visible select-text z-10">
                                                            {witnessStr}
                                                        </span>
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                {isCreator && (
                                    <>
                                        <ProgressUpdateDialog
                                            goalId={id}
                                            currentProgress={
                                                goalData.progressPercentage
                                            }
                                            onProgressUpdated={() => {
                                                refetchGoal();
                                                refetchProgressUpdates();
                                            }}
                                            isCreator={isCreator}
                                        />

                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                            onClick={handleToggleAIAssistant}
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            {showAIAssistant
                                                ? language === "zh"
                                                    ? "隐藏我的AI目标规划师"
                                                    : "Hide my AI Goal Planner"
                                                : language === "zh"
                                                ? "跟我的AI目标规划师对话"
                                                : "Chat with my AI Goal Planner"}
                                        </Button>

                                        {isCreator &&
                                            allWitnessesConfirmed &&
                                            goalData.status === 0 && (
                                                <Button
                                                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                                                    onClick={handleCompleteGoal}
                                                    disabled={isCompletingGoal}
                                                >
                                                    {isCompletingGoal ? (
                                                        language === "zh" ? (
                                                            "正在完成..."
                                                        ) : (
                                                            "Completing..."
                                                        )
                                                    ) : (
                                                        <>
                                                            <Check className="mr-2 h-4 w-4" />{" "}
                                                            {language === "zh"
                                                                ? "完成目标"
                                                                : "Complete Goal"}
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                    </>
                                )}

                                {isWitness && !hasConfirmed && (
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                        onClick={handleConfirmWitness}
                                        disabled={isConfirmingWitness}
                                    >
                                        {isConfirmingWitness ? (
                                            language === "zh" ? (
                                                "确认中..."
                                            ) : (
                                                "Confirming..."
                                            )
                                        ) : (
                                            <>
                                                <ThumbsUp className="mr-2 h-4 w-4" />{" "}
                                                {language === "zh"
                                                    ? "确认完成"
                                                    : "Confirm Completion"}
                                            </>
                                        )}
                                    </Button>
                                )}
                                {isWitness && hasConfirmed && (
                                    <Button
                                        variant="outline"
                                        className="w-full bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                        disabled
                                    >
                                        <Check className="mr-2 h-4 w-4" />{" "}
                                        {language === "zh"
                                            ? "已确认完成"
                                            : "Confirmed Completion"}
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>

                    {showAIAssistant && isCreator && (
                        <div ref={aiAssistantRef}>
                            <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 mt-8">
                                <CardContent className="pt-6">
                                    {goalAgentId ? (
                                        <div>
                                            <ChatBox
                                                goalId={id}
                                                agentId={String(goalAgentId)}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <GoalAgent
                                                goalId={id}
                                                onAgentCreated={() => {
                                                    // 当Agent创建成功后，重新获取goalAgentId
                                                    refetchAgentId();
                                                }}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Tabs defaultValue="updates" className="mt-8">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="updates">
                                {language === "zh"
                                    ? "进度更新"
                                    : "Progress Updates"}
                            </TabsTrigger>
                            <TabsTrigger value="comments">
                                {language === "zh" ? "评论" : "Comments"}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="updates" className="mt-4 space-y-4">
                            {localProgressUpdates &&
                            localProgressUpdates.length > 0 ? (
                                [...localProgressUpdates]
                                    .reverse()
                                    .map(
                                        (
                                            update: ProgressUpdateDetail,
                                            index: number
                                        ) => (
                                            <div
                                                key={`update-${index}`}
                                                className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium">
                                                            <span className="relative group cursor-text">
                                                                <span className="text-blue-500 hover:text-orange-600">
                                                                    {update.creator.slice(
                                                                        0,
                                                                        6
                                                                    ) +
                                                                        "..." +
                                                                        update.creator.slice(
                                                                            -4
                                                                        )}
                                                                </span>
                                                                <span className="absolute left-0 -top-8 min-w-max max-w-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs rounded py-2 px-3 shadow-md transition-opacity duration-300 whitespace-nowrap overflow-visible select-text z-10">
                                                                    {
                                                                        update.creator
                                                                    }
                                                                </span>
                                                            </span>
                                                        </h4>
                                                        <span className="text-sm text-gray-500">
                                                            {format(
                                                                new Date(
                                                                    Number(
                                                                        update.created_at.toString()
                                                                    ) * 1000
                                                                ),
                                                                "yyyy-MM-dd HH:mm:ss"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1">
                                                        {update.content}
                                                    </p>
                                                    {update.proof_file_blob_id && (
                                                        <div className="mt-2">
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const response =
                                                                            await fetch(
                                                                                `${CONSTANTS.BACKEND_URL}/walrus/download/${update.proof_file_blob_id}`
                                                                            );
                                                                        if (
                                                                            !response.ok
                                                                        ) {
                                                                            const errorData =
                                                                                await response.json();
                                                                            throw new Error(
                                                                                errorData.error ||
                                                                                    "下载失败"
                                                                            );
                                                                        }

                                                                        // 获取文件名
                                                                        const contentDisposition =
                                                                            response.headers.get(
                                                                                "Content-Disposition"
                                                                            );
                                                                        let filename = `proof-${update.proof_file_blob_id}`;
                                                                        if (
                                                                            contentDisposition
                                                                        ) {
                                                                            const matches =
                                                                                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
                                                                                    contentDisposition
                                                                                );
                                                                            if (
                                                                                matches !=
                                                                                    null &&
                                                                                matches[1]
                                                                            ) {
                                                                                filename =
                                                                                    matches[1].replace(
                                                                                        /['"]/g,
                                                                                        ""
                                                                                    );
                                                                            }
                                                                        }

                                                                        // 获取文件内容
                                                                        const blob =
                                                                            await response.blob();
                                                                        const url =
                                                                            window.URL.createObjectURL(
                                                                                blob
                                                                            );
                                                                        const a =
                                                                            document.createElement(
                                                                                "a"
                                                                            );
                                                                        a.href =
                                                                            url;
                                                                        a.download =
                                                                            filename;
                                                                        document.body.appendChild(
                                                                            a
                                                                        );
                                                                        a.click();
                                                                        window.URL.revokeObjectURL(
                                                                            url
                                                                        );
                                                                        document.body.removeChild(
                                                                            a
                                                                        );
                                                                    } catch (err: unknown) {
                                                                        console.error(
                                                                            "下载失败:",
                                                                            err
                                                                        );
                                                                        const errorMessage =
                                                                            err instanceof
                                                                            Error
                                                                                ? err.message
                                                                                : "未知错误";
                                                                        toast.error(
                                                                            language ===
                                                                                "zh"
                                                                                ? `下载证明文件失败: ${errorMessage}`
                                                                                : `Failed to download proof file: ${errorMessage}`
                                                                        );
                                                                    }
                                                                }}
                                                                className="text-sm text-blue-500 hover:text-blue-700"
                                                            >
                                                                {language ===
                                                                "zh"
                                                                    ? "下载证明文件"
                                                                    : "Download proof file"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {language === "zh"
                                        ? "暂无进度更新"
                                        : "No progress updates yet"}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent
                            value="comments"
                            className="mt-4 space-y-4"
                        >
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder={
                                        language === "zh"
                                            ? "添加评论..."
                                            : "Add a comment..."
                                    }
                                    className="flex-1"
                                    value={commentText}
                                    onChange={(e) => {
                                        setCommentText(e.target.value);
                                    }}
                                />
                                <Button
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    size="sm"
                                    onClick={handleCommentSubmit}
                                    disabled={
                                        isSubmittingComment ||
                                        !commentText.trim()
                                    }
                                >
                                    {isSubmittingComment ? (
                                        language === "zh" ? (
                                            "发送中..."
                                        ) : (
                                            "Sending..."
                                        )
                                    ) : (
                                        <>
                                            <MessageSquare className="h-4 w-4 mr-2" />{" "}
                                            {language === "zh"
                                                ? "发送"
                                                : "Send"}
                                        </>
                                    )}
                                </Button>
                            </div>
                            {localComments &&
                                [...localComments]
                                    .reverse()
                                    .map(
                                        (
                                            comment: CommentDetail,
                                            index: number
                                        ) => (
                                            <div
                                                key={`comment-${index}`}
                                                className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium">
                                                            <span className="relative group cursor-text">
                                                                <span className="text-blue-500 hover:text-orange-600">
                                                                    {comment.creator.slice(
                                                                        0,
                                                                        6
                                                                    ) +
                                                                        "..." +
                                                                        comment.creator.slice(
                                                                            -4
                                                                        )}
                                                                </span>
                                                                <span className="absolute left-0 -top-8 min-w-max max-w-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs rounded py-2 px-3 shadow-md transition-opacity duration-300 whitespace-nowrap overflow-visible select-text z-10">
                                                                    {
                                                                        comment.creator
                                                                    }
                                                                </span>
                                                            </span>
                                                        </h4>
                                                        <span className="text-sm text-gray-500">
                                                            {format(
                                                                new Date(
                                                                    Number(
                                                                        comment.created_at.toString()
                                                                    ) * 1000
                                                                ),
                                                                "yyyy-MM-dd HH:mm:ss"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
