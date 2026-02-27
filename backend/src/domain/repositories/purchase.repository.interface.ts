import { Purchase } from '../entities/purchase';

export interface IPurchaseRepository {
  findAll(): Promise<Purchase[]>;
  findById(id: number): Promise<Purchase | null>;
  save(purchase: Purchase): Promise<Purchase>;
  update(purchase: Purchase): Promise<Purchase>;
  delete(id: number): Promise<void>;
}
