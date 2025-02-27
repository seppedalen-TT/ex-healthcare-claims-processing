import React from "react";
import TabularView from "components/TabularScreen";
import { useClaims } from "hooks/claims";

const useClaimsData = () => useClaims({});

// Component to render multiple claims within the scope of the authorized party
const Claims: React.FC = () => {
  return (
    <TabularView
      title="Claims"
      useData={useClaimsData}
      fields={[
        { label: "Provider", getter: (o) => o?.claim?.payload?.provider },
        {
          label: "Patient",
          getter: (o) => o?.claim?.payload?.encounterDetails?.patient,
        },
        {
          label: "Procedure Code",
          getter: (o) => o?.claim?.payload?.encounterDetails?.procedureCode,
        },
        { label: "Amount", getter: (o) => o?.claim?.payload?.amount },
      ]}
      tableKey={(o) => o?.claim?.contractId}
      itemUrl={(o) => o?.claim?.contractId}
    />
  );
};
export default Claims;
