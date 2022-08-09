import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import { BottomSheet as SpringBottomSheet } from "react-spring-bottom-sheet";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isTouchDevice } from "../helpers/device";

import "react-spring-bottom-sheet/dist/style.css";

const StyledBottomSheet = styled(SpringBottomSheet)`
  --rsbs-handle-bg: transparent;
  --rsbs-bg: #111317;
  --rsbs-max-w: 500px;

  --rsbs-ml: auto;
  --rsbs-mr: auto;

  [data-rsbs-header] {
    padding: 0 !important;
  }

  [data-rsbs-content] {
    overflow: initial;
  }
`;

const Header = styled.div`
  margin: 0.75rem 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 300;
`;

const CloseContainer = styled.div`
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.05);

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 2.5rem;

  margin-left: auto;
`;

export interface BottomSheetProps {
  title?: React.ReactNode;
  openButton?: React.ReactNode;
  children?: React.ReactNode;
}

export default function BottomSheetInternals({
  title,
  openButton,
  children,
}: BottomSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {openButton && <div onClick={() => setOpen(true)}>{openButton}</div>}

      <StyledBottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={
          <Header>
            {title}
            <CloseContainer onClick={() => setOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseContainer>
          </Header>
        }
        snapPoints={({ maxHeight, minHeight }) => [
          Math.min(
            isTouchDevice()
              ? maxHeight -
                  (+getComputedStyle(document.documentElement)
                    .getPropertyValue("--sat")
                    .slice(0, -2) + 8 || 0)
              : maxHeight - maxHeight / 15,
            minHeight
          ),
        ]}
        expandOnContentDrag
        initialFocusRef={false}
      >
        {children}
      </StyledBottomSheet>
    </>
  );
}