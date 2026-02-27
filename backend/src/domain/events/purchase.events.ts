export type DomainEventProps<T> = {
  eventId: string;
  occurredAt: Date;
  aggregateId: number;
} & T;

export interface PurchaseCreatedEvent {
  purchaseId: number;
  items: Array<{ id: number; amount: number }>;
  address: { street: string; number: number; state: string };
}

export interface OrderPlacedEvent {
  purchaseId: number;
  orderId: string;
  preparationTime: number;
}

export interface DeliveryBookedEvent {
  purchaseId: number;
  orderId: string;
  voucherNumber: string;
  deliveryForecast: Date;
}

export interface PurchaseCompletedEvent {
  purchaseId: number;
  state: string;
}
