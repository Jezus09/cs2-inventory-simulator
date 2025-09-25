/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { describe, expect, test, beforeEach, vi } from "vitest";

// Mock the enforceOwnerOnlyCraft function logic for testing
function enforceOwnerOnlyCraftLogic(userId: string, ownerId?: string | null) {
  if (ownerId && ownerId.trim() !== "" && userId !== ownerId) {
    throw new Response("Crafting is disabled for non-owners.", { status: 403 });
  }
}

describe("enforceOwnerOnlyCraft backend logic", () => {
  test("should allow crafting when no OWNER_ID is set", () => {
    const userId = "user123";
    const ownerId = null;
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).not.toThrow();
  });

  test("should allow crafting when OWNER_ID is undefined", () => {
    const userId = "user123";
    const ownerId = undefined;
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).not.toThrow();
  });

  test("should allow crafting when OWNER_ID is empty string", () => {
    const userId = "user123";
    const ownerId = "";
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).not.toThrow();
  });

  test("should allow crafting when OWNER_ID is whitespace-only", () => {
    const userId = "user123";
    const ownerId = "   ";
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).not.toThrow();
  });

  test("should allow crafting when user matches the OWNER_ID", () => {
    const userId = "owner123";
    const ownerId = "owner123";
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).not.toThrow();
  });

  test("should block crafting when user does not match the OWNER_ID", () => {
    const userId = "user456";
    const ownerId = "owner123";
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).toThrow();
  });

  test("should throw Response object with correct status code", () => {
    const userId = "user456";
    const ownerId = "owner123";
    
    try {
      enforceOwnerOnlyCraftLogic(userId, ownerId);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(403);
    }
  });

  test("should handle case-sensitive user IDs", () => {
    const userId = "Owner123";
    const ownerId = "owner123";
    
    expect(() => enforceOwnerOnlyCraftLogic(userId, ownerId)).toThrow();
  });
});