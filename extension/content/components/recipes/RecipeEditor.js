import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  InputPicker,
} from "rsuite";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useLocation } from "react-router-dom";

export default function RecipeEditor() {
  const location = useLocation();

  let recipe = location.state.recipe;
  let [data, setData] = useState({});
  useEffect(() => {
    if (recipe) {
      const {
        name,
        experimenter_slug,
        filter_expression,
        arguments: arguments_,
      } = recipe;
      const action_id = recipe.action.id;
      setData({
        name,
        experimenter_slug,
        filter_expression,
        action_id,
        arguments: JSON.stringify(arguments_, null, 2),
      });
    }
  }, []);

  const handleChange = (key, value) => {
    setData({ ...data, [key]: value });
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
          name="filter_expression"
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
          value={data.filter_expression}
          onBeforeChange={(editor, data, value) =>
            handleChange("filter_expression", value)
          }
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Actions</ControlLabel>
        <FormControl
          name={"action_id"}
          defaultValue={"elksaljfa"}
          placeholder={"Actions"}
          data={[
            { label: "Todo", value: 1 },
            { label: "Open", value: 2 },
            { label: "Close", value: 3 },
            { label: "Error", value: 4 },
            { label: "Processing", value: 5 },
            { label: "Done", value: 6 },
          ]}
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
