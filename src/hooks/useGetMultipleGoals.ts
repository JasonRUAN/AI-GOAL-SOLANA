import { QueryKey } from "@/constants";
import { getOneGoal } from "@/lib/anchorClient";
import { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export function useGetMultipleGoals({ goalIds }: { goalIds: string[] }) {
  const connection = new Connection("https://api.devnet.solana.com");

  return useQuery({
    queryKey: [QueryKey.GetMultipleGoalsQueryKey, goalIds],
    queryFn: async () => {
      const promises = goalIds.map(async (goalId) => {
        const result = await getOneGoal({
          connection,
          goalId: Number.parseInt(goalId),
          network: "devnet",
        });
        return result;
      });
      return Promise.all(promises);
    },
    enabled: !!goalIds && goalIds.length > 0,
  });
}
