export interface Qrcode {
  bytes: number[];
  cornerPoints: [number, number][];
  displayValue: string;
  format: string;
  rawValue: string;
  valueType: string;
}
