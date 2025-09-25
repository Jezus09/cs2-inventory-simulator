/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { describe, expect, test } from "vitest";

// Mock the useIsOwner hook logic for testing
function useIsOwnerLogic(user: { id: string } | null, rules: { ownerId?: string | null }) {
  // If no owner is set, everyone is considered an "owner" (can craft)
  if (!rules.ownerId || rules.ownerId.trim() === "") {
    return true;
  }
  return user?.id === rules.ownerId;
}

describe("useIsOwner hook logic", () => {
  test("should return true when no owner is set (OWNER_ID is empty)", () => {
    const user = { id: "user123" };
    const rules = { ownerId: null };
    
    expect(useIsOwnerLogic(user, rules)).toBe(true);
  });

  test("should return true when no owner is set (OWNER_ID is undefined)", () => {
    const user = { id: "user123" };
    const rules = { ownerId: undefined };
    
    expect(useIsOwnerLogic(user, rules)).toBe(true);
  });

  test("should return true when user matches the owner ID", () => {
    const user = { id: "owner123" };
    const rules = { ownerId: "owner123" };
    
    expect(useIsOwnerLogic(user, rules)).toBe(true);
  });

  test("should return false when user does not match the owner ID", () => {
    const user = { id: "user456" };
    const rules = { ownerId: "owner123" };
    
    expect(useIsOwnerLogic(user, rules)).toBe(false);
  });

  test("should return false when user is not logged in (null user)", () => {
    const user = null;
    const rules = { ownerId: "owner123" };
    
    expect(useIsOwnerLogic(user, rules)).toBe(false);
  });

  test("should return false when user is not logged in (undefined user)", () => {
    const user = undefined as any;
    const rules = { ownerId: "owner123" };
    
    expect(useIsOwnerLogic(user, rules)).toBe(false);
  });

  test("should handle empty string owner ID", () => {
    const user = { id: "user123" };
    const rules = { ownerId: "" };
    
    // Empty string should be treated as "no owner set"
    expect(useIsOwnerLogic(user, rules)).toBe(true);
  });

  test("should handle whitespace-only owner ID", () => {
    const user = { id: "user123" };
    const rules = { ownerId: "   " };
    
    // Whitespace-only string should be treated as "no owner set"
    expect(useIsOwnerLogic(user, rules)).toBe(true);
  });
});