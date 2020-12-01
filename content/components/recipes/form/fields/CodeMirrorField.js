import PropTypes from "prop-types";
import React from "react";
import { ControlLabel, FormGroup, HelpBlock } from "rsuite";

import CodeMirror from "devtools/components/common/CodeMirror";
import {
  ACTION_UPDATE_DATA,
  useRecipeDetailsData,
  useRecipeDetailsDispatch,
  useRecipeDetailsErrors,
} from "devtools/contexts/recipeDetails";

export default function CodeMirrorField({ name, label, options, required }) {
  const data = useRecipeDetailsData();
  const dispatch = useRecipeDetailsDispatch();
  const value = data[name];
  const { serverErrors } = useRecipeDetailsErrors();

  const { [name]: fieldErrors = [] } = serverErrors;
  let errMessages;
  if (fieldErrors.length) {
    errMessages = (
      <HelpBlock className="text-red">
        {fieldErrors.map((err) => {
          return <li key={err}>{err}</li>;
        })}
      </HelpBlock>
    );
  }

  let helpBlock = null;
  if (required) {
    helpBlock = <HelpBlock>Required</HelpBlock>;
  }

  const handleChange = (value) => {
    dispatch({
      type: ACTION_UPDATE_DATA,
      data: {
        ...data,
        [name]: value,
      },
    });
  };

  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <CodeMirror
        options={{
          mode: "javascript",
          lineNumbers: true,
          ...options,
        }}
        value={value}
        onBeforeChange={(editor, data, value) => {
          handleChange(value);
        }}
      />
      {errMessages}
      {helpBlock}
    </FormGroup>
  );
}

CodeMirrorField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.object,
  required: PropTypes.bool,
};
