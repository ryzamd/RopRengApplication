import { PreOrder } from '../../domain/entities/PreOrder';
import { CreatePreOrderParams, PreOrderRepository } from '../../domain/repositories/PreOrderRepository';

export class CreatePreOrderUseCase {
  constructor(private readonly repository: PreOrderRepository) {}

  async execute(params: CreatePreOrderParams): Promise<PreOrder> {
    return await this.repository.create(params);
  }
}