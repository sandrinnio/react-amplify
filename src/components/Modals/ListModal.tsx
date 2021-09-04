import { Dispatch, FC, useState } from "react";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API, graphqlOperation } from "aws-amplify";
import { Button, Form, Modal } from "semantic-ui-react";
import { CreateListMutation, UpdateListItemMutation } from "../../types/API";
import { InitialStateType } from "../../App";
import { createList, updateList } from "../../graphql/mutations";
import { ActionType } from "../../state/action-types";
import { Action } from "../../state/actions";
import UploadImage from "../HandleImages/UploadImage";
import { useUploadImage } from "../../hooks/useUploadImage";

type ListModalProps = {
  state: InitialStateType;
  dispatch: Dispatch<Action>;
};

const ListModal: FC<ListModalProps> = ({ state, dispatch }) => {
  const uploadToS3 = useUploadImage();
  const [fileToUpload, setFileToUpload] = useState<File>();

  const saveList = async () => {
    const imageKey = await uploadToS3(fileToUpload);
    (await API.graphql(
      graphqlOperation(createList, {
        input: { title: state.title, description: state.description, imageKey },
      })
    )) as GraphQLResult<CreateListMutation>;
    dispatch({ type: ActionType.CLOSE_MODAL });
  };

  const editList = async () => {
    (await API.graphql(
      graphqlOperation(updateList, {
        input: {
          id: state.id,
          title: state.title,
          description: state.description,
        },
      })
    )) as GraphQLResult<UpdateListItemMutation>;
    dispatch({ type: ActionType.CLOSE_MODAL });
  };

  return (
    <Modal open={state.isModalOpen} dimmer="blurring">
      <Modal.Header>
        {state.modalType === "add" ? "Create your list" : "Edit your list"}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            error={true ? false : { content: "Please add title" }}
            label="List Title"
            placeholder="Title"
            value={state.title}
            onChange={(e) =>
              dispatch({
                type: ActionType.TITLE_CHANGED,
                value: e.target.value,
              })
            }
          />
          <Form.TextArea
            label="List Description"
            placeholder="Description"
            value={state.description}
            onChange={(e) =>
              dispatch({
                type: ActionType.DESCRIPTION_CHANGED,
                value: e.target.value,
              })
            }
          />
          <UploadImage setFileToUpload={setFileToUpload} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          onClick={() => dispatch({ type: ActionType.CLOSE_MODAL })}
        >
          Cancel
        </Button>
        <Button
          positive
          onClick={state.modalType === "add" ? saveList : editList}
        >
          {state.modalType === "add" ? "Save" : "Update"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ListModal;
