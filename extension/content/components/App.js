import React from "react";
import {
  HashRouter,
  Route,
  Redirect,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import ErrorBoundary from "react-error-boundary";

import AppHeader from "devtools/components/common/AppHeader";
import { AppSidebar } from "devtools/components/common/AppSidebar";
import RecipesPage from "devtools/components/pages/RecipesPage";
import FiltersPage from "devtools/components/pages/FiltersPage";
import PrefStudiesPage from "devtools/components/pages/PrefStudiesPage";
import AddonStudiesPage from "devtools/components/pages/AddonStudiesPage";
import { EnvironmentProvider } from "devtools/contexts/environment";
import RecipeFormPage from "devtools/components/pages/RecipeFormPage";
import { useHistoryRecorder } from "devtools/hooks/urls";
import RecipeDetailsPage from "devtools/components/pages/RecipeDetailsPage";

export default function App(props) {
  return (
    <HashRouter>
      <EnvironmentProvider>
        <div className="app-container">
          <AppHeader />
          <div className="content-wrapper">
            <AppSidebar />
            <Page />
          </div>
        </div>
      </EnvironmentProvider>
    </HashRouter>
  );
}

function Page() {
  const match = useRouteMatch();
  useHistoryRecorder();

  return (
    <div className="page-container">
      <ErrorBoundary>
        <Switch>
          <Route exact path={`${match.path}/`}>
            <Redirect to={`${match.url}/recipes`} />
          </Route>

          <Route exact component={RecipesPage} path={`${match.path}/recipes`} />
          <Route
            exact
            component={RecipeFormPage}
            path={`${match.path}/recipes/new`}
          />
          <Route
            exact
            component={RecipeDetailsPage}
            path={`${match.path}/recipes/:recipeId`}
          />
          <Route
            exact
            component={RecipeDetailsPage}
            path={`${match.path}/recipes/:recipeId/revision/:revisionId`}
          />
          <Route
            exact
            component={RecipeFormPage}
            path={`${match.path}/recipes/:recipeId/edit`}
          />
          <Route
            exact
            component={RecipeFormPage}
            path={`${match.path}/recipes/import/:experimenterSlug`}
          />
          <Route exact component={FiltersPage} path={`${match.path}/filters`} />
          <Route
            component={PrefStudiesPage}
            path={`${match.path}/pref-studies`}
          />
          <Route
            component={AddonStudiesPage}
            path={`${match.path}/addon-studies`}
          />

          <Route
            render={(args) => (
              <>
                <span>404</span>
                <pre>
                  <code>{JSON.stringify(args, null, 4)}</code>
                </pre>
              </>
            )}
          />
        </Switch>
      </ErrorBoundary>
    </div>
  );
}
