export interface VoucherDTO {
  id: number;
  code: string;
  name: string;
  type: string;
  description: string | null;
  rules: string;
  can_combine: number;
  start_at: string;
  end_at: string;
}

export interface VouchersResponseDTO {
  code: number;
  message: string;
  data: {
    store_id: number;
    vouchers: VoucherDTO[];
  };
}

export interface VoucherRulesDTO {
  amount?: string;
  percent?: string;
}