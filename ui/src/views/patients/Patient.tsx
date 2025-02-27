import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { Main } from "@daml.js/healthcare-claims-processing";
import { useStreamQueries } from "@daml/react";
import {
  FieldsRow,
  PageTitleDiv,
  PageTitleSpan,
  TabLink,
  PageSubTitleSpan,
} from "components/Common";

import ReferralModal from "components/modals/ReferralModal";
import { usePatients } from "hooks/patients";

/**
 * Single view for patient
 * The component containes routes for the tab views
 * */
const Patient: React.FC = () => {
  // get patient ID
  const { patientId } = useParams<{ patientId: string }>();

  /**
   * Fetch data about the patient through the "usePatients" hook
   * One param being passed
   */
  const { overviews, disclosed, disclosedRaw } = usePatients({
    patient: patientId,
  });

  const match = useRouteMatch();

  // Stream data about the provider
  const pcpResult = useStreamQueries(Main.Provider.Provider).contracts;
  const pcpContract = pcpResult[0];

  return (
    <>
      <PageTitleDiv>
        <PageTitleSpan title="Patient" />
        <PageSubTitleSpan title={patientId} />
      </PageTitleDiv>

      <div className="flex flex-col space-y-2">
        <div className="flex">
          <TabLink to={match.url + ""}> Summary </TabLink>
          <TabLink to={match.url + "/policies"}> Disclosed Policies </TabLink>
        </div>

        {overviews.length > 0 && (
          <div className="flex flex-col p-5 space-y-4 bg-white rounded shadow-lg">
            <Switch>
              <Route exact path={match.path + "/policies"}>
                <div className="flex flex-col space-y-4">
                  {disclosed.map((d, i) => (
                    <div key={d.receivers.join() + d.insuranceID}>
                      <FieldsRow
                        fields={[
                          { label: "Receivers", value: d.receivers.join(", ") },
                          { label: "Insurance ID", value: d.insuranceID },
                        ]}
                      />
                      {i === disclosed.length - 1 ? <></> : <hr />}
                    </div>
                  ))}
                </div>
              </Route>
              <Route exact path={match.path}>
                <ReferralModal
                  disclosedRaw={disclosedRaw}
                  pcpContract={pcpContract}
                />
                <hr />
                <FieldsRow
                  fields={[
                    { label: "Name", value: overviews[0]?.policy?.patientName },
                    {
                      label: "Insurance ID",
                      value: overviews[0]?.policy?.insuranceID,
                    },
                    {
                      label: "Primary Care Provider",
                      value: overviews[0]?.acceptance?.provider,
                    },
                  ]}
                />
              </Route>
              <Route>
                <Redirect to={match.url} />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    </>
  );
};

export default Patient;
