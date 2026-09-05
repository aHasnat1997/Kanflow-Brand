/**
 * @module TaskOrderingUtil
 *
 * Single source of truth for float-position ordering logic used by both
 * columns and tasks. All position calculations go through these functions —
 * no ordering math is duplicated elsewhere in the codebase.
 *
 * ### Algorithm
 * Items are ordered by a `position` float. To insert between two items,
 * place the new item at the midpoint of its neighbours. When neighbours
 * converge closer than {@link REBALANCE_EPSILON}, redistribute positions
 * to even multiples of {@link POSITION_GAP} to restore floating-point room.
 *
 * Insert positions:
 * - **Start**: `firstItem.position / 2`
 * - **End**: `lastItem.position + POSITION_GAP`
 * - **Between A and B**: `(A.position + B.position) / 2`
 */

/** Gap used when appending an item at the end, or rebalancing a list. */
export const POSITION_GAP = 1000;

/**
 * Minimum allowed gap between two adjacent positions before a rebalance
 * is triggered. Below this threshold, floating-point precision may cause
 * ordering collisions.
 */
export const REBALANCE_EPSILON = 0.001;

// ---------------------------------------------------------------------------
// Insertion helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the position for an item inserted at the very start of a list
 * (before the current first item).
 *
 * @param firstPosition - The current first item's position value
 * @returns A position value smaller than `firstPosition`
 */
export function calculatePrependPosition(firstPosition: number): number {
  return firstPosition / 2;
}

/**
 * Calculates the position for an item appended at the end of a list.
 *
 * @param lastPosition - The current last item's position value
 * @returns `lastPosition + POSITION_GAP`
 */
export function calculateAppendPosition(lastPosition: number): number {
  return lastPosition + POSITION_GAP;
}

/**
 * Calculates the midpoint position between two adjacent items.
 * Used when moving an item between two existing neighbours.
 *
 * @param beforePosition - The position of the item that will be immediately before
 * @param afterPosition - The position of the item that will be immediately after
 * @returns The arithmetic midpoint of the two positions
 */
export function calculateMidpointPosition(
  beforePosition: number,
  afterPosition: number,
): number {
  return (beforePosition + afterPosition) / 2;
}

/**
 * Calculates the appropriate position for inserting an item at a target index
 * within an ordered list.
 *
 * - Inserting at index 0 (start): position before the first item
 * - Inserting at the end: position after the last item
 * - Inserting between: midpoint of neighbours
 *
 * @param positions - Sorted array of existing item positions (ascending)
 * @param targetIndex - The 0-based index where the new item should land
 * @returns The calculated float position
 */
export function calculateInsertPosition(
  positions: number[],
  targetIndex: number,
): number {
  if (positions.length === 0) {
    // First item in an empty list
    return POSITION_GAP;
  }

  if (targetIndex <= 0) {
    // Inserting before everything — halve the current minimum
    return calculatePrependPosition(positions[0]!);
  }

  if (targetIndex >= positions.length) {
    // Appending after everything
    return calculateAppendPosition(positions[positions.length - 1]!);
  }

  // Between two existing items
  return calculateMidpointPosition(
    positions[targetIndex - 1]!,
    positions[targetIndex]!,
  );
}

// ---------------------------------------------------------------------------
// Rebalancing
// ---------------------------------------------------------------------------

/**
 * Returns `true` when any two adjacent positions in the sorted array are
 * closer than {@link REBALANCE_EPSILON}, signalling that precision is running
 * out and a rebalance is needed.
 *
 * @param positions - Sorted array of position values (ascending)
 * @returns Whether a rebalance should be performed
 */
export function shouldRebalance(positions: number[]): boolean {
  for (let i = 1; i < positions.length; i++) {
    if ((positions[i]! - positions[i - 1]!) < REBALANCE_EPSILON) {
      return true;
    }
  }
  return false;
}

/**
 * Redistributes positions for a list of items to clean multiples of
 * {@link POSITION_GAP}, restoring floating-point precision after many inserts.
 *
 * @param count - The number of items to assign new positions to
 * @returns Array of new position values in ascending order
 *
 * @example
 * rebalancePositions(3) → [1000, 2000, 3000]
 */
export function rebalancePositions(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (i + 1) * POSITION_GAP);
}
