import { api } from "lib/api.server";
import { notFound } from "next/navigation";
import GoalClientPage from "./page.client";

const findGoal = async (communityHandle: string, goalId: number) => {
  try {
    return await api.confirmCommunityGoalExists({
      communityHandle,
      goalId,
    });
  } catch (e) {
    return null;
  }
};
export default async function GoalPage({ params }: { params: Params }) {
  const { community, goal } = await params;
  const currentGoal = await findGoal(
    community.toString(),
    parseInt(goal.toString())
  );
  if (currentGoal && currentGoal.belongsToCommunity)
    return <GoalClientPage goal={currentGoal} />;
  return notFound();
}
