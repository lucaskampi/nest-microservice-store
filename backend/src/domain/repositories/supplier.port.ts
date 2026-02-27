export interface ProviderInfo {
  address: string;
  name: string;
}

export interface OrderInfo {
  id: string;
  preparationTime: number;
}

export interface ISupplierPort {
  getInfoProviderByState(state: string): Promise<ProviderInfo>;
  placeOrder(items: Array<{ id: number; amount: number }>): Promise<OrderInfo>;
}
