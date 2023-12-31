/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_Item } from "@ianlucas/cslib";
import clsx from "clsx";

const HAS_KIND_FIRST = ["weapon", "melee", "glove"];

export function CSItemName({
  item: { name, type, rarity }
}: {
  item: CS_Item;
}) {
  const parts = name.split("|");

  return (
    <>
      {parts.map((name, index) => (
        <>
          <span
            className={clsx(
              index === 0 && HAS_KIND_FIRST.includes(type)
                ? "text-neutral-400"
                : "font-bold"
            )}
            style={{
              color:
                index !== 0 || !HAS_KIND_FIRST.includes(type)
                  ? rarity
                  : undefined
            }}
          >
            {name}
          </span>
          {index < parts.length - 1 && (
            <span className="text-neutral-700"> | </span>
          )}
        </>
      ))}
    </>
  );
}
