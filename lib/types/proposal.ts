export interface ProposalBinderPayload {
  orderId: string;
  version: string;
  metadata: {
    solicitationNumber: string;
    solicitationTitle: string;
    issuingAgency: string;
    submittalDeadline: string;
  };
  contractor: {
    legalName: string;
    sunbizNumber: string;
    fein: string;
    licenseNumber: string;
    primarySigner: {
      name: string;
      title: string;
      email: string;
    };
  };
  tabs: {
    tab1_transmittal: {
      executiveSummary: string;
      complianceAcknowledgment: boolean;
    };
    tab2_scope: {
      technicalApproach: string;
      equipmentList: string[];
      qualityAssurancePlan: string;
    };
    tab3_staffing: {
      supervisoryRatio: string;
      chainOfCommand: string;
      replacementSLA: string;
    };
    tab4_pricing: {
      unitPricingSchedule: Array<{ item: string; unit: string; rate: number }>;
      officerVerificationSigned: boolean;
    };
    tab5_statutory: {
      publicEntityCrimesFiling: boolean;
      drugFreeWorkplaceFiling: boolean;
      nonCollusionAffidavit: boolean;
      eVerifyRegistrationId: string;
    };
  };
}
