import React from "react";
import {
  useEnvironmentState,
  useSelectedNormandyEnvironmentAPI,
  environmentContext,
} from "devtools/contexts/environment";
import { PendingReviews } from "../overview/PendingReviews";
import { Loader } from "rsuite";

export const OverviewPage: React.FC<any> = ({}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { selectedKey: environmentKey } = useEnvironmentState();
  const normandyApi = useSelectedNormandyEnvironmentAPI();
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setIsLoading(true);
    normandyApi.fetchAllRecipes().then((recipeData) => {
      console.log(recipeData);
      setData(recipeData);
      setIsLoading(false);
    });
  }, [environmentKey]);

  if (!isLoading) {
    return (
      <div className="page-wrapper">
        <PendingReviews data={data} />
      </div>
    );
  } else {
    return <Loader />;
  }
};
