import { ActionType } from "../action-types";
import { List } from "../../types/API";

export interface DescriptionChangedAction {
  type: ActionType.DESCRIPTION_CHANGED;
  value: string;
}

export interface TitleChangedAction {
  type: ActionType.TITLE_CHANGED;
  value: string;
}

export interface UpdateListsAction {
  type: ActionType.UPDATE_LISTS;
  value: List[];
}

export interface UpdateListResultAction {
  type: ActionType.UPDATE_LIST_RESULT;
  value: List;
}

export interface EditListAction {
  type: ActionType.EDIT_LIST;
  value: List;
}

export interface OpenModalAction {
  type: ActionType.OPEN_MODAL;
}

export interface CloseModalAction {
  type: ActionType.CLOSE_MODAL;
}

export interface DeleteListAction {
  type: ActionType.DELETE_LIST;
  value: string;
}

export interface DeleteListResultAction {
  type: ActionType.DELETE_LIST_RESULT;
  value: string;
}

export type Action =
  | DescriptionChangedAction
  | TitleChangedAction
  | UpdateListsAction
  | UpdateListResultAction
  | OpenModalAction
  | CloseModalAction
  | DeleteListAction
  | EditListAction
  | DeleteListResultAction;
