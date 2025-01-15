export interface Document {
  title: string;
  subtitle: string;
  file?: string;
  showError: boolean;
  type: "identification" | "addressProof" | "storeFront" | "storeInterior";
}
