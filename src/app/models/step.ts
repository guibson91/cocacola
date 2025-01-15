export interface Step {
  id: StepId;
  title: string;
  stepIndex: number;
}
export type StepId = "personalInfo" | "companyName" | "personalInfo" | "contactInfo" | "confirmation" | "password" | "company" | "documents" | "logistics";

export const getSteps = (stepsId: StepId[], isClientDb) => {
  if (!stepsId || stepsId.length === 0) {
    return [];
  }

  const steps: Step[] = [
    {
      id: "companyName",
      title: "Cadastro",
      stepIndex: 0,
    },
    {
      id: "personalInfo",
      title: "Cadastro",
      stepIndex: 0,
    },
    {
      id: "contactInfo",
      title: "Cadastro",
      stepIndex: 1,
    },
    {
      id: "confirmation",
      title: "Cadastro Confirmação",
      stepIndex: isClientDb ? 2 : 1,
    },
    {
      id: "password",
      title: "Cadastro",
      stepIndex: isClientDb ? 2 : 1,
    },
    {
      id: "company",
      title: "Cadastro Empresa",
      stepIndex: 2,
    },
    {
      id: "documents",
      title: "Documentação",
      stepIndex: 2,
    },
    {
      id: "logistics",
      title: "Visita e Entrega",
      stepIndex: 3,
    },
  ];
  return steps.filter((step) => stepsId.includes(step.id));
};

export const getNoRegisterStepsId = (isCpf: boolean): StepId[] => {
  return isCpf
    ? ["personalInfo", "contactInfo", "confirmation", "password", "company", "documents", "logistics"]
    : ["companyName", "personalInfo", "contactInfo", "confirmation", "password", "company", "documents", "logistics"];
};

export const getDbClientStepsId = (isCpf: boolean): StepId[] => {
  return isCpf ? ["personalInfo", "contactInfo", "confirmation", "password"] : ["companyName", "personalInfo", "contactInfo", "confirmation", "password"];
};
