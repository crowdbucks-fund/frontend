import { UserGoal } from '@xeronith/granola/core/objects'


export const sortGoals = (a: UserGoal, b: UserGoal) => {
  if (a.priority === b.priority) {
    return a.timestamp < b.timestamp ? -1 : 1
  }
  return a.priority < b.priority ? -1 : 1
}
