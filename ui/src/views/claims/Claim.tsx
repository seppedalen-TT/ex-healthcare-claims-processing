import React from "react";
import { useParams } from "react-router-dom";
import { Main } from "@daml.js/healthcare-claims-processing";
import { CalendarBlank } from "phosphor-react";
import { Message } from "components/Common";
import { FormModal } from "components/modals/FormModal";
import SingleItemView from "components/SingleItemView";
import { useParty } from "@daml/react";
import { useClaim } from "hooks/claims";

/**
 * function that is passed in the Claim component
 * which retrieves claim data through the useClaim hook.
 * See "hooks/claim" for more details
 */

const useClaimData = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const overview = useClaim({ claimId })[0];
  return [{ claimId, overview: overview }];
};

/**
 * Component to render single claim of the authorized party
 * Component uses a table to display the claim and passes a modal to pay the claim
 */
const Claim: React.FC = () => {
  const role = useParty();
  const dollars = (n: any) => (n ? "$" + n : "");
  return (
    <SingleItemView
      title="Claim"
      useData={useClaimData}
      fields={[
        [
          {
            label: "Allowed Amount",
            getter: (o) =>
              dollars(
                o?.overview?.claim?.payload?.encounterDetails?.allowedAmount
              ),
          },
          {
            label: "CoPay",
            getter: (o) =>
              dollars(o?.overview?.claim?.payload?.encounterDetails?.coPay),
          },
          {
            label: "Patient Responsibility",
            getter: (o) =>
              dollars(
                o?.overview?.claim?.payload?.encounterDetails
                  ?.patientResponsibility
              ),
          },
          {
            label: "Claim Amount",
            getter: (o) => dollars(o?.overview?.claim?.payload?.amount),
          },
        ],
        [
          {
            label: "Procedure Code",
            getter: (o) =>
              o?.overview?.claim?.payload?.encounterDetails.procedureCode,
          },
          {
            label: "Diagnosis Code",
            getter: (o) =>
              o?.overview?.claim?.payload?.encounterDetails.diagnosisCode,
          },
          {
            label: "Site Service Code",
            getter: (o) =>
              o?.overview?.claim?.payload?.encounterDetails.siteServiceCode,
          },
        ],
        [
          {
            label: "Provider",
            getter: (o) => o?.overview?.claim?.payload?.provider,
          },
          {
            label: "Patient",
            getter: (o) =>
              o?.overview?.claim?.payload?.encounterDetails?.patient,
          },
          {
            label: "Appointment Priority",
            getter: (o) =>
              o?.overview?.claim?.payload?.encounterDetails.appointmentPriority,
          },
        ],
      ]}
      tableKey={(o) => o.overview?.claim?.contractId}
      itemUrl={(o) => ""}
      choices={(d) =>
        d.overview?.claim?.payload?.payer === role ? (
          <FormModal
            className="flex flex-col space-y-6 w-170 mt-3"
            choice={Main.Claim.Claim.PayClaim}
            contract={d.overview?.claim?.contractId}
            submitTitle="Pay Claim Now"
            buttonTitle="Pay Claim"
            icon={<CalendarBlank size={20} />}
            initialValues={{}}
          >
            <Message
              title="Pay Claim"
              content={`This claim is approved and ready to be paid?`}
            />
          </FormModal>
        ) : (
          <></>
        )
      }
    />
  );
};

export default Claim;
