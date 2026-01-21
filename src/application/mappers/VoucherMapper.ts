import { Voucher, VoucherRules, VoucherType } from '../../domain/entities/Voucher';
import { VouchersResult } from '../../domain/repositories/HomeRepository';
import { VoucherDTO, VoucherRulesDTO, VouchersResponseDTO } from '../dto/VoucherDTO';

export class VoucherMapper {
  static toEntity(dto: VoucherDTO): Voucher {
    const rules = VoucherMapper.parseRules(dto.rules, dto.type as VoucherType);

    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      type: dto.type as VoucherType,
      description: dto.description,
      rules,
      canCombine: dto.can_combine === 1,
      startAt: new Date(dto.start_at),
      endAt: new Date(dto.end_at),
    };
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