import autobind from "autobind-decorator";
import yaml from "js-yaml";
import PropTypes from "prop-types";
import React from "react";

import { Link } from "react-router-dom";

import { Button, Icon, Panel, Tag, ButtonToolbar } from "rsuite";
import { convertToV1Recipe } from "devtools/utils/recipes";

import Highlight from "devtools/components/common/Highlight";

const normandy = browser.experiments.normandy;

@autobind
class RecipeListing extends React.PureComponent {
  static propTypes = {
    environmentName: PropTypes.string,
    recipe: PropTypes.object.isRequired,
    copyRecipeToArbitrary: PropTypes.func.isRequired,
    showRecipe: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      filterMatches: null,
      running: false,
    };
  }

  async componentDidMount() {
    const { environmentName, recipe } = this.props;
    let filterMatches = await normandy.checkRecipeFilter(
      convertToV1Recipe(recipe, environmentName),
    );
    this.setState({ filterMatches });
  }

  handleCopyToArbitraryButtonClick(ev) {
    this.props.copyRecipeToArbitrary(this.props.recipe);
  }

  renderCopyToArbitraryButton() {
    return (
      <Button onClick={this.handleCopyToArbitraryButtonClick}>
        <Icon icon="edit" /> Copy to Arbitrary Editor
      </Button>
    );
  }

  async handleRunButtonClick(ev) {
    const { environmentName, recipe } = this.props;
    this.setState({ running: true });
    await normandy.runRecipe(convertToV1Recipe(recipe, environmentName));
    this.setState({ running: false });
  }

  renderRunButton() {
    const { running } = this.state;

    return (
      <Button onClick={this.handleRunButtonClick} disabled={running}>
        {running ? <Icon icon="reload" spin /> : <Icon icon="play" />} Run
      </Button>
    );
  }

  renderEnabledIcon() {
    const { recipe } = this.props;
    const {
      latest_revision: { enabled },
    } = recipe;

    if (enabled) {
      return <Icon icon="check-circle" size="lg" className="text-success" />;
    }

    return <Icon icon="close-circle" size="lg" className="text-danger" />;
  }

  renderFilterIcon() {
    const { filterMatches } = this.state;

    if (filterMatches) {
      return <Icon icon="filter" size="lg" className="text-success" />;
    }

    return <Icon icon="filter" size="lg" className="text-danger" />;
  }

  renderHeader() {
    const { recipe } = this.props;
    const {
      id,
      latest_revision: { name },
    } = recipe;

    return (
      <React.Fragment>
        <span className="pull-right recipe-actions">
          {this.renderCopyToArbitraryButton()}
          {this.renderRunButton()}
          {this.renderEnabledIcon()}
          {this.renderFilterIcon()}
        </span>
        <Tag color="cyan">{id}</Tag> {name}
      </React.Fragment>
    );
  }

  handleshowRecipeButton() {
    this.props.showRecipe(this.props.recipe);
  }

  renderRecipeButtonToolBar() {
    const { match, recipe } = this.props;

    return (
      <ButtonToolbar>
        <Link
          to={{
            pathname: `${match.path}/edit`,
            state: { recipe: recipe.latest_revision },
          }}
        >
          <Button>Edit Recipe</Button>
        </Link>

        <Button onClick={this.handleshowRecipeButton}>View Recipe</Button>
      </ButtonToolbar>
    );
  }

  render() {
    const { recipe } = this.props;

    const {
      latest_revision: { filter_expression, arguments: arguments_ },
    } = recipe;

    return (
      <Panel
        className="recipe-listing"
        header={this.renderHeader()}
        collapsible
        bordered
      >
        {this.renderRecipeButtonToolBar()}

        <h4>Filter</h4>
        <Highlight className="javascript">{filter_expression}</Highlight>

        <h4>Arguments</h4>
        <Highlight className="yaml">
          {yaml.safeDump(arguments_, {
            sortKeys: true,
            indent: 4,
            noRefs: true,
          })}
        </Highlight>
      </Panel>
    );
  }
}

export default RecipeListing;
