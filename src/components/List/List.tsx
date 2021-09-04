import { Dispatch, FC, useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { Dimmer, Icon, Image, Item, Loader } from "semantic-ui-react";
import { ActionType } from "../../state/action-types";
import { Action } from "../../state/actions";
import { List } from "../../types/API";

type ListProps = {
  list: List;
  dispatch: Dispatch<Action>;
};

const ListItem: FC<ListProps> = ({ list, dispatch }) => {
  const { id, title, description, imageKey, createdAt } = list;
  const [imageUrl, setImageUrl] = useState(
    "https://react.semantic-ui.com/images/wireframe/image.png"
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchImageUrl = async () => {
    if (imageKey) {
      const url = (await Storage.get(imageKey)) as string;
      setImageUrl(url);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImageUrl();
  }, []);

  const content = <Loader />;

  return (
    <Item>
      <Dimmer.Dimmable
        dimmed={isLoading}
        dimmer={{ active: isLoading, content }}
        as={Image}
        size="tiny"
        src={imageUrl}
      />
      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Description>{description}</Item.Description>
        <Item.Extra>
          {new Date(createdAt).toDateString()}
          <Icon
            name="edit"
            className="ml-3"
            onClick={() =>
              dispatch({ type: ActionType.EDIT_LIST, value: list })
            }
          />
          <Icon
            name="trash"
            className="ml-3"
            onClick={() =>
              dispatch({ type: ActionType.DELETE_LIST, value: id })
            }
          />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default ListItem;
