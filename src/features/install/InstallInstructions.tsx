import styled from "@emotion/styled";
import { isInApp, isThirdPartyIosBrowser } from "../../helpers/device";
import ShareIcon from "./share.svg?react";
import AddIcon from "./add.svg?react";
import CopyLink from "./CopyLink";

const Container = styled.div`
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AppSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const AppIcon = styled.img`
  height: 4rem;
  margin: 0 1rem;
  border-radius: 1rem;
`;

const AppTitle = styled.div`
  font-size: 1.2rem;
`;

const AppAuthor = styled.div`
  opacity: 0.7;
  font-size: 0.9rem;
`;

const List = styled.ol`
  margin-bottom: 0;

  li {
    margin-bottom: 0.5rem;
  }
`;

const StyledShareIcon = styled(ShareIcon)`
  height: 1.25rem;
  padding: 0 0.25rem;
  color: #007aff;
`;

const StyledAddIcon = styled(AddIcon)`
  height: 1rem;
`;

const AddToHomescreenContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 3px 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
`;

const Description = styled.p`
  margin: 1rem;
`;

export default function InstallInstructions() {
  const thirdPartyIosBrowser = isThirdPartyIosBrowser();
  const isSafari = !(isInApp() || thirdPartyIosBrowser);

  const browserType = (() => {
    if (thirdPartyIosBrowser) return "not using Safari";

    return "using an in-app browser";
  })();

  function renderSafariInstallInstructions() {
    return (
      <List>
        <li>
          Tap on <StyledShareIcon /> in the Safari tab bar
        </li>
        <li>
          Scroll and tap{" "}
          <AddToHomescreenContainer>
            Add to Home Screen <StyledAddIcon />
          </AddToHomescreenContainer>
        </li>
      </List>
    );
  }

  function renderInAppBrowserInstallInstructions() {
    return (
      <>
        <Description>
          It looks like you&apos;re {browserType}. To install PPG.report, open
          this link in <strong>Safari</strong>.
        </Description>
        <CopyLink />
      </>
    );
  }

  return (
    <Container>
      <AppSummary>
        <AppIcon src="/manifest-icon-512.png" />
        <div>
          <AppTitle>PPG.report</AppTitle>
          <AppAuthor>by Alexander Harding</AppAuthor>
        </div>
      </AppSummary>
      {isSafari
        ? renderSafariInstallInstructions()
        : renderInAppBrowserInstallInstructions()}
    </Container>
  );
}
