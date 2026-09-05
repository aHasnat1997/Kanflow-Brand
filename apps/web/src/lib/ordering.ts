/**
 * Frontend ordering utilities — mirrors task-ordering.util.ts on the server.
 * Used by use-board.ts for optimistic position calculations on drag-and-drop.
 *
 * Keep in sync with the server util. Both use the same constants and algorithm.
 */

/** Gap used when appending an item at the end, or as the initial position. */
export const POSITION_GAP = 1000;

/**
 * Calculates the position for an item appended at the end of a list.
 * @param lastPosition - Current last item's position
 */
export function calculateAppendPosition(lastPosition: number): number {
  return lastPosition + POSITION_GAP;
}

/**
 * Calculates the midpoint between two adjacent item positions.
 * @param beforePosition - Position of the item that will precede
 * @param afterPosition - Position of the item that will follow
 */
export function calculateMidpointPosition(
  beforePosition: number,
  afterPosition: number,
): number {
  return (beforePosition + afterPosition) / 2;
}
