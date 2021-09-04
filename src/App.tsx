import { useEffect, useReducer } from "react";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Aplify, { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Button, Container, Icon } from "semantic-ui-react";
import Observable from "zen-observable-ts";
import awsConfig from "./aws-exports";
import { listLists } from "./graphql/queries";
import { deleteList } from "./graphql/mutations";
import {
  onCreateList,
  onDeleteList,
  onUpdateList,
} from "./graphql/subscriptions";
import {
  List,
  ListListsQuery,
  OnCreateListSubscription,
  OnDeleteListSubscription,
  OnUpdateListSubscription,
} from "./types/API";
import { MainHeader, Lists, ListModal } from "./components";
import { ActionType } from "./state/action-types";
import { Action } from "./state/actions";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

Aplify.configure(awsConfig);

export type InitialStateType = {
  id: string;
  title: string;
  description?: string;
  lists: List[];
  isModalOpen: boolean;
  modalType: "add" | "edit";
};

const initialState: InitialStateType = {
  id: "",
  title: "",
  description: "",
  lists: [],
  isModalOpen: false,
  modalType: "add",
};

const listReducer = (
  state = initialState,
  action: Action
): InitialStateType => {
  switch (action.type) {
    case ActionType.DESCRIPTION_CHANGED:
      return { ...state, description: action.value };
    case ActionType.TITLE_CHANGED:
      return { ...state, title: action.value };
    case ActionType.UPDATE_LISTS:
      return { ...state, lists: [...action.value, ...state.lists] };
    case ActionType.UPDATE_LIST_RESULT:
      const index = state.lists.findIndex(
        (item) => item.id === action.value.id
      );
      const editedList = [...state.lists];
      delete action.value.listItems;
      editedList[index] = action.value;
      return { ...state, lists: editedList };
    case ActionType.OPEN_MODAL:
      return { ...state, isModalOpen: true, modalType: "add" };
    case ActionType.CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
        id: "",
        title: "",
        description: "",
      };
    case ActionType.DELETE_LIST:
      removeList(action.value);
      return { ...state };
    case ActionType.DELETE_LIST_RESULT:
      const newList = state.lists.filter((item) => item.id !== action.value);
      return { ...state, lists: newList };
    case ActionType.EDIT_LIST:
      const newValue = { ...action.value };
      delete newValue.listItems;
      return {
        ...state,
        isModalOpen: true,
        modalType: "edit",
        id: newValue.id,
        title: newValue.title,
        description: newValue.description,
      };
    default:
      return state;
  }
};

const removeList = async (id: string) => {
  await API.graphql(graphqlOperation(deleteList, { input: { id } }));
};

const App = () => {
  const [state, dispatch] = useReducer(listReducer, initialState);

  const fetchList = async () => {
    const { data } = (await API.graphql(
      graphqlOperation(listLists)
    )) as GraphQLResult<ListListsQuery>;
    data &&
      dispatch({ type: ActionType.UPDATE_LISTS, value: data.listLists.items });
  };

  useEffect(() => {
    fetchList();
    const createListSub = (
      API.graphql(
        graphqlOperation(onCreateList)
      ) as Observable<OnCreateListSubscription>
    ).subscribe({
      next: ({ onCreateList }) =>
        onCreateList &&
        dispatch({ type: ActionType.UPDATE_LISTS, value: [onCreateList] }),
    });
    const updateListSub = (
      API.graphql(
        graphqlOperation(onUpdateList)
      ) as Observable<OnUpdateListSubscription>
    ).subscribe({
      next: ({ onUpdateList }) =>
        onUpdateList &&
        dispatch({
          type: ActionType.UPDATE_LIST_RESULT,
          value: onUpdateList,
        }),
    });
    const deleteListSub = (
      API.graphql(
        graphqlOperation(onDeleteList)
      ) as Observable<OnDeleteListSubscription>
    ).subscribe({
      next: ({ onDeleteList }) =>
        onDeleteList &&
        dispatch({
          type: ActionType.DELETE_LIST_RESULT,
          value: onDeleteList.id,
        }),
    });
    return () => {
      createListSub.unsubscribe();
      updateListSub.unsubscribe();
      deleteListSub.unsubscribe();
    };
  }, []);

  return (
    <AmplifyAuthenticator>
      <Container style={{ height: "100vh" }}>
        <AmplifySignOut />
        <Button
          className="floating_button"
          onClick={() => dispatch({ type: ActionType.OPEN_MODAL })}
        >
          <Icon name="plus" className="floating_button_icon" />
        </Button>
        <MainHeader />
        <Lists lists={state.lists} dispatch={dispatch} />
      </Container>
      <ListModal state={state} dispatch={dispatch} />
    </AmplifyAuthenticator>
  );
};

export default App;
