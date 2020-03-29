import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  ButtonToolbar,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  InputPicker,
} from "rsuite";
import { Controlled as CodeMirror } from "react-codemirror2";
import api from "devtools/utils/api";

export default function RecipeEditor(props) {
  const { match, environment } = props;
  let [data, setData] = useState({});
  let [actions, setActions] = useState([]);
  const actionEndpoint = "api/v3/action/";

  async function getActionsOptions(environment) {
    let res = await api.fetchFromNormandy(environment, actionEndpoint);
    actions = res.results.map(action => ({
      label: action.name,
      value: action.id,
    }));
    setActions(actions);
  }

  async function getRecipe(environment, id) {
    const recipeEndpoint = `api/v3/recipe/${id}/`;
    let recipe = await api.fetchFromNormandy(environment, recipeEndpoint);

    const { latest_revision } = recipe;
    latest_revision.arguments = JSON.stringify(
      latest_revision.arguments,
      null,
      1,
    );
    setData({ latest_revision });
  }

  useEffect(() => {
    getActionsOptions(environment);
    if (match.params.id) {
      getRecipe(environment, match.params.id);
    }
  }, []);

  const handleChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handleSubmit = () => {
    const recipeEndpoint = `api/v3/recipe/${match.params.id}/`;
    const token = environment.authSession.authResult.accessToken;
    const requestBody = formatRequestBody();
    const requestSave = api.fetchFromNormandy(environment, recipeEndpoint, {
      method: "PUT",
      data: requestBody,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    requestSave
      .then(() => {
        //TODO must be a better way....
        location.replace("/content.html#");
        Alert.success("Changes Saved");
      })
      .catch(err => {
        Alert.error(`An Error Occured: ${JSON.stringify(err.data)}`);
      });
  };

  //kinda questionable :(
  const formatRequestBody = () => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    try {
      dataCopy.arguments = JSON.parse(dataCopy.arguments);
    } catch (err) {
      Alert.error("Arguments is not valid JSON");
    }
    return dataCopy;
  };

  return (
    <Form fluid formValue={data} onChange={data => setData(data)}>
      <FormGroup>
        <ControlLabel>Name</ControlLabel>
        <FormControl name="name" />
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Experiment Slug</ControlLabel>
        <FormControl name="experimenter_slug" />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Extra Filter Expression</ControlLabel>
        <CodeMirror
          name="extra_filter_expression"
          options={{
            mode: "javascript",
            theme: "neo",
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
          }}
          style={{
            height: "auto",
          }}
          value={data.extra_filter_expression}
          onBeforeChange={(editor, data, value) =>
            handleChange("filter_expression", value)
          }
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Actions</ControlLabel>
        <FormControl
          name={"action_id"}
          placeholder={"Actions"}
          data={actions}
          searchable={false}
          size="lg"
          block
          accepter={InputPicker}
        />
      </FormGroup>
      <ActionArgument
        name="arguments"
        value={data.arguments}
        handleChange={handleChange}
        action={data.action_id}
      />
      <ButtonToolbar>
        <Button appearance="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button appearance="default">Cancel</Button>
      </ButtonToolbar>
    </Form>
  );
}

function ActionArgument(props) {
  if (props.action) {
    return (
      <FormGroup>
        <ControlLabel>Action Arguments</ControlLabel>
        <CodeMirror
          name={props.name}
          options={{
            mode: "javascript",
            theme: "neo",
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
          }}
          style={{
            height: "auto",
          }}
          value={props.value}
          onBeforeChange={(editor, data, value) =>
            props.handleChange(props.name, value)
          }
        />
      </FormGroup>
    );
  }
  return "";
}

RecipeEditor.propTypes = {
  match: PropTypes.object,
  environment: PropTypes.object,
};
