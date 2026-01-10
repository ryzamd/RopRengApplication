import { Voucher, VoucherType, VoucherRules } from '../../domain/entities/Voucher';
import { VoucherDTO, VouchersResponseDTO, VoucherRulesDTO } from '../dto/VoucherDTO';
import { VouchersResult } from '../../domain/repositories/HomeRepository';

export class VoucherMapper {
  static toEntity(dto: VoucherDTO): Voucher {
    const rules = VoucherMapper.parseRules(dto.rules, dto.type as VoucherType);

    return new Voucher(
      dto.id,
      dto.code,
      dto.name,
      dto.type as VoucherType,
      dto.description,
      rules,
      dto.can_combine === 1,
      new Date(dto.start_at),
      new Date(dto.end_at)
    );
  }

  static toEntityList(dtos: VoucherDTO[]): Voucher[] {
    return dtos.map(dto => VoucherMapper.toEntity(dto));
  }
  static toVouchersResult(response: VouchersResponseDTO): VouchersResult {
    return {
      storeId: response.data.store_id,
      vouchers: VoucherMapper.toEntityList(response.data.vouchers),
    };
  }

  private static parseRules(rulesJson: string, type: VoucherType): VoucherRules {
    const rules: VoucherRules = {};

    try {
      const parsed: VoucherRulesDTO = JSON.parse(rulesJson);

      if (type === 'fixed' && parsed.amount) {
        rules.amount = parseFloat(parsed.amount);
      }

      if (type === 'percent' && parsed.percent) {
        rules.percent = parseFloat(parsed.percent);
      }
    } catch (error) {
      console.error('[VoucherMapper] Failed to parse rules JSON:', rulesJson, error);
    }

    return rules;
  }
}