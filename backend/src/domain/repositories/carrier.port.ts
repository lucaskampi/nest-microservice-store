export interface DeliveryInfo {
  orderId: string;
  deliveryDate: Date;
  originAddress: string;
  destinationAddress: string;
}

export interface VoucherInfo {
  number: string;
  deliveryForecast: Date;
}

export interface ICarrierPort {
  bookDelivery(info: DeliveryInfo): Promise<VoucherInfo>;
}
