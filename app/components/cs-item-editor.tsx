/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faBolt, faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CS_Item,
  CS_MAX_SEED,
  CS_MAX_WEAR,
  CS_MIN_SEED,
  CS_MIN_WEAR,
  CS_WEAR_FACTOR,
  CS_hasNametag,
  CS_hasSeed,
  CS_hasStatTrak,
  CS_hasStickers,
  CS_hasWear,
  CS_safeValidateNametag,
  CS_safeValidateSeed,
  CS_safeValidateWear
} from "@ianlucas/cslib";
import { useState } from "react";
import { useCheckbox } from "~/hooks/use-checkbox";
import { useInput } from "~/hooks/use-input";
import { useTranslation } from "~/hooks/use-translation";
import {
  seedStringMaxLen,
  showQuantity,
  wearStringMaxLen,
  wearToString
} from "~/utils/economy";
import { CSItemImage } from "./cs-item-image";
import { EditorInput } from "./editor-input";
import { EditorStepRange } from "./editor-step-range";
import { EditorToggle } from "./editor-toggle";
import { useRootContext } from "./root-context";
import { StickerPicker } from "./sticker-picker";
import { EditorStepRangeWithInput } from "./editor-step-range-with-input";

export interface CSItemEditorAttributes {
  nametag?: string;
  quantity: number;
  seed?: number;
  stattrak?: boolean;
  stickers?: (number | null)[];
  wear?: number;
}

export function CSItemEditor({
  item,
  onReset,
  onSubmit
}: {
  item: CS_Item;
  onReset(): void;
  onSubmit(props: CSItemEditorAttributes): void;
}) {
  const { maxInventoryItems, inventory } = useRootContext();
  const [stattrak, setStattrak] = useCheckbox(false);
  const [wear, setWear] = useState(item.wearmin ?? CS_MIN_WEAR);
  const [seed, setSeed] = useState(1);
  const [nametag, setNametag] = useInput("");
  const [stickers, setStickers] = useState([null, null, null, null] as (
    | number
    | null
  )[]);
  const [quantity, setQuantity] = useState(1);
  const hasStickers = CS_hasStickers(item);
  const hasStattrak = CS_hasStatTrak(item);
  const hasSeed = CS_hasSeed(item);
  const hasWear = CS_hasWear(item);
  const hasNametag = CS_hasNametag(item);
  const canCraft =
    CS_safeValidateWear(wear) &&
    (CS_safeValidateNametag(nametag) || nametag.length === 0) &&
    CS_safeValidateSeed(seed);
  const maxQuantity = maxInventoryItems - inventory.size();
  const hasQuantity = showQuantity(item);
  const translate = useTranslation();

  function handleSubmit() {
    onSubmit({
      nametag: hasNametag && nametag.length > 0 ? nametag : undefined,
      quantity,
      stickers:
        hasStickers && stickers.filter((sticker) => sticker !== null).length > 0
          ? stickers
          : undefined,
      seed: hasSeed && seed !== CS_MIN_SEED ? seed : undefined,
      wear: hasWear && wear !== CS_MIN_WEAR ? wear : undefined,
      stattrak: hasStattrak && stattrak === true ? stattrak : undefined
    });
  }

  return (
    <div className="m-auto w-[360px] select-none px-4 pb-6 lg:px-0">
      <CSItemImage
        className="m-auto h-[192px] w-[256px]"
        item={item}
        wear={wear}
      />
      <div
        className="mb-4 text-center font-bold"
        style={{ color: item.rarity }}
      >
        {item.name}
      </div>
      <div className="space-y-4">
        {hasStickers && (
          <div>
            <label className="w-[76.33px] select-none font-bold text-neutral-500">
              {translate("EditorStickers")}
            </label>
            <StickerPicker value={stickers} onChange={setStickers} />
          </div>
        )}
        {hasNametag && (
          <div className="flex items-center gap-4">
            <label className="w-[76.33px] select-none font-bold text-neutral-500">
              {translate("EditorNametag")}
            </label>
            <EditorInput
              maxLength={20}
              onChange={setNametag}
              placeholder={translate("EditorNametagPlaceholder")}
              validate={CS_safeValidateNametag}
              value={nametag}
            />
          </div>
        )}
        {hasSeed && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorSeed")}
            </label>
            <EditorStepRangeWithInput
              inputStyles="w-[68px]"
              maxLength={seedStringMaxLen}
              validate={(value) => CS_safeValidateSeed(value, item)}
              stepRangeStyles="flex-1"
              min={CS_MIN_SEED}
              max={CS_MAX_SEED}
              step={CS_MIN_SEED}
              value={seed}
              onChange={setSeed}
            />
          </div>
        )}
        {hasWear && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorWear")}
            </label>
            <EditorStepRangeWithInput
              inputStyles="w-[68px]"
              transform={wearToString}
              maxLength={wearStringMaxLen}
              validate={(value) => CS_safeValidateWear(value, item)}
              stepRangeStyles="flex-1"
              min={item.wearmin ?? CS_MIN_WEAR}
              max={item.wearmax ?? CS_MAX_WEAR}
              step={CS_WEAR_FACTOR}
              value={wear}
              onChange={setWear}
            />
          </div>
        )}
        {hasStattrak && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorStatTrak")}
            </label>
            <EditorToggle checked={stattrak} onChange={setStattrak} />
          </div>
        )}
        {hasQuantity && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorQuantity")}
            </label>
            <span className="w-[68px]">{quantity}</span>
            <EditorStepRange
              className="flex-1"
              value={quantity}
              onChange={setQuantity}
              max={maxQuantity}
              min={1}
              step={1}
            />
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={onReset}
          className="flex cursor-default items-center gap-2 rounded px-4 py-2 text-neutral-300 drop-shadow-lg hover:text-neutral-100"
        >
          <FontAwesomeIcon icon={faLongArrowLeft} className="h-4" />
          {translate("EditorReset")}
        </button>
        <button
          disabled={!canCraft}
          onClick={handleSubmit}
          className="flex cursor-default items-center gap-2 rounded bg-white/80 px-4 py-2 font-bold text-neutral-700 drop-shadow-lg transition hover:bg-white disabled:bg-neutral-500 disabled:text-neutral-700"
        >
          <FontAwesomeIcon icon={faBolt} className="h-4" />
          {translate("EditorCraft")}
        </button>
      </div>
    </div>
  );
}
