import React from "react";
import PropTypes from "prop-types";
import {
  InputPicker,
  InputNumber,
  FormGroup,
  ControlLabel,
  Row,
  Col,
  TagPicker,
} from "rsuite";

const options = [
  { label: "Bucket", value: "bucketSample" },
  { label: "Stable", value: "stableSample" },
  { label: "None", value: null },
];
export default function SamplingOptions(props) {
  const { filterValues, handleTypeChange, handleFieldChange } = props;
  const getSelectedOption = () => {
    if (filterValues.stableSample) {
      return "stableSample";
    }

    if (filterValues.bucketSample) {
      return "bucketSample";
    }

    return null;
  };

  const SampleMethodOptions = () => {
    if (filterValues && filterValues.stableSample) {
      return (
        <StableSampleOptions
          filterValues={filterValues.stableSample}
          handleChange={handleFieldChange}
        />
      );
    }

    if (filterValues && filterValues.bucketSample) {
      return (
        <BucketSampleOptions
          filterValues={filterValues.bucketSample}
          handleChange={handleFieldChange}
        />
      );
    }

    return null;
  };

  return (
    <FormGroup>
      <ControlLabel>Sampling Type</ControlLabel>
      <InputPicker
        data={options}
        value={getSelectedOption()}
        onChange={(value, _) => handleTypeChange(value)}
      />
      <SampleMethodOptions filterValues={filterValues} />
    </FormGroup>
  );
}

function StableSampleOptions(props) {
  const { handleChange, filterValues } = props;

  return (
    <Row>
      <Col xs={12}>
        <FormGroup>
          <ControlLabel>Rate</ControlLabel>
          <InputNumber
            defaultValue={filterValues.rate ? filterValues.rate * 100 : null}
            postfix="%"
            onBlur={(event) => {
              handleChange("stableSample", "rate", event.target.value / 100);
            }}
            onChange={(value, event) =>
              event.target.click
                ? handleChange("stableSample", "rate", value)
                : null
            }
          />
        </FormGroup>
      </Col>
      <Col xs={12}>
        <SamplingInput
          handleChange={handleChange}
          inputValues={filterValues.input}
          sampleType="stableSample"
        />
      </Col>
    </Row>
  );
}

function BucketSampleOptions(props) {
  const { handleChange, filterValues } = props;

  return (
    <Row>
      <BucketSamplingNumberPicker
        filterValues={filterValues}
        handleChange={handleChange}
        sampleField="start"
      />
      <BucketSamplingNumberPicker
        filterValues={filterValues}
        handleChange={handleChange}
        sampleField="count"
      />
      <BucketSamplingNumberPicker
        filterValues={filterValues}
        handleChange={handleChange}
        sampleField="total"
      />
      <Col xs={8}>
        <SamplingInput
          handleChange={handleChange}
          inputValues={filterValues.input}
          sampleType="bucketSample"
        />
      </Col>
    </Row>
  );
}

function BucketSamplingNumberPicker(props) {
  const { sampleField, filterValues, handleChange } = props;
  return (
    <Col xs={4}>
      <FormGroup>
        <ControlLabel style={{ textTransform: "capitalize" }}>
          {sampleField}
        </ControlLabel>
        <InputNumber
          defaultValue={filterValues ? filterValues[sampleField] : null}
          onBlur={(event) =>
            handleChange("bucketSample", sampleField, event.target.value)
          }
          onChange={(value, event) =>
            event.target.click
              ? handleChange("bucketSample", sampleField, value)
              : null
          }
        />
      </FormGroup>
    </Col>
  );
}

function SamplingInput(props) {
  const { handleChange, inputValues, sampleType } = props;
  const defaultInputs = ["normandy.recipe.id", "normandy.userId"];
  const currentInputs = inputValues ? inputValues : [];
  const totalInputs = [...new Set([...currentInputs, ...defaultInputs])];
  const inputOptions = totalInputs.map((entry) => {
    return { label: entry, value: entry };
  });

  const handleInputChange = (value) => {
    const diff = value.filter((entry) => !totalInputs.includes(entry));
    if (diff.length) {
      const inputs = [...currentInputs, `"${diff}"`];
      handleChange(sampleType, "input", inputs);
    } else {
      handleChange(sampleType, "input", value);
    }
  };

  return (
    <FormGroup>
      <ControlLabel>Input</ControlLabel>
      <TagPicker
        block
        creatable
        data={inputOptions}
        value={currentInputs}
        onChange={handleInputChange}
      />
    </FormGroup>
  );
}

BucketSamplingNumberPicker.propTypes = {
  sampleField: PropTypes.string,
  filterValues: PropTypes.object,
  handleChange: PropTypes.func,
};

SamplingOptions.propTypes = {
  filterValues: PropTypes.object,
  handleTypeChange: PropTypes.func,
  handleFieldChange: PropTypes.func,
};

SamplingInput.propTypes = {
  handleChange: PropTypes.func,
  inputValues: PropTypes.array,
  sampleType: PropTypes.string,
};

BucketSampleOptions.propTypes = {
  handleChange: PropTypes.func,
  filterValues: PropTypes.object,
};

StableSampleOptions.propTypes = {
  handleChange: PropTypes.func,
  filterValues: PropTypes.object,
};
