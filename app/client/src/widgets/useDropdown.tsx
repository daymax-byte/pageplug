import React, { useCallback, useRef } from "react";
import { getMainCanvas } from "./WidgetUtils";
import styled from "styled-components";
import Select from "rc-select";
import { LabelValueType } from "rc-select/lib/interface/generator";
import { RenderMode, RenderModes } from "constants/WidgetConstants";

const BackDropContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: transparent;
  top: 0;
  left: 0;
`;

type useDropdownProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  renderMode?: RenderMode;
};
const FOCUS_TIMEOUT = 500;

// TODO: Refactor More functionalities in MultiSelect, MultiTreeSelect and TreeSelect Components
const useDropdown = ({ inputRef, renderMode }: useDropdownProps) => {
  const popupContainer = useRef<HTMLElement>(getMainCanvas());
  const selectRef = useRef<Select<LabelValueType[]> | null>(null);

  const closeBackDrop = useCallback(() => {
    if (selectRef.current) {
      selectRef.current.blur();
    }
  }, []);

  // Avoid scrolls when Popup is opened
  function BackDrop() {
    return <BackDropContainer onClick={closeBackDrop} />;
  }
  // Get PopupContainer on main Canvas
  const getPopupContainer = useCallback(() => popupContainer.current, []);

  // When Dropdown is opened disable scrolling within the app except the list of options
  const onOpen = useCallback(
    (open: boolean) => {
      if (open) {
        setTimeout(() => inputRef.current?.focus(), FOCUS_TIMEOUT);
        // for more context, the Element we attach to in view mode doesn't have an overflow style, so this only applies to edit mode.
        if (popupContainer.current && renderMode === RenderModes.CANVAS) {
          popupContainer.current.style.overflowY = "hidden";
        }
      } else {
        if (popupContainer.current && renderMode === RenderModes.CANVAS) {
          popupContainer.current.style.overflowY = "auto";
        }
      }
    },
    [renderMode],
  );

  return {
    BackDrop,
    getPopupContainer,
    onOpen,
    selectRef,
  };
};

export default useDropdown;
