import { Header, Icon } from "semantic-ui-react";

const MainHeader = () => {
  return (
    <div>
      <Header as="h1" textAlign="center" icon className="mt-1 mb-3">
        <Icon name="user" />
        <Header.Content>Baro Sandro</Header.Content>
      </Header>
    </div>
  );
};

export default MainHeader;
