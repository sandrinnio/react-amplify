import { Dispatch, FC } from "react";
import { Item } from "semantic-ui-react";
import { Action } from "../../state/actions";
import { List } from "../../types/API";
import ListItem from "../List/List";

type ListsProps = {
  lists?: List[];
  dispatch: Dispatch<Action>;
};

const Lists: FC<ListsProps> = ({ lists, dispatch }) => {
  return (
    <div>
      <Item.Group>
        {lists?.map((list) => (
          <ListItem key={list.id} list={list} dispatch={dispatch} />
        ))}
      </Item.Group>
    </div>
  );
};

export default Lists;
