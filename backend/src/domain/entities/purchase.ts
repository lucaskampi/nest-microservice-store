import { PurchaseState } from '../value-objects/purchase-state';
import { Address } from '../value-objects/address';

export interface PurchaseProps {
  id: number;
  destinationAddress: Address;
  state: PurchaseState;
  orderId?: string | null;
  preparationTime?: number | null;
  deliveryDate?: Date | null;
  voucher?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePurchaseProps {
  destinationAddress: Address;
}

export class Purchase {
  private readonly _id: number;
  private readonly _destinationAddress: Address;
  private _state: PurchaseState;
  private _orderId: string | null;
  private _preparationTime: number | null;
  private _deliveryDate: Date | null;
  private _voucher: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private static idCounter = 0;

  private constructor(props: PurchaseProps) {
    this._id = props.id;
    this._destinationAddress = props.destinationAddress;
    this._state = props.state;
    this._orderId = props.orderId ?? null;
    this._preparationTime = props.preparationTime ?? null;
    this._deliveryDate = props.deliveryDate ?? null;
    this._voucher = props.voucher ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreatePurchaseProps): Purchase {
    const now = new Date();
    return new Purchase({
      id: ++Purchase.idCounter,
      destinationAddress: props.destinationAddress,
      state: PurchaseState.INITIAL,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PurchaseProps): Purchase {
    return new Purchase(props);
  }

  get id(): number {
    return this._id;
  }

  get destinationAddress(): Address {
    return this._destinationAddress;
  }

  get state(): PurchaseState {
    return this._state;
  }

  get orderId(): string | null {
    return this._orderId;
  }

  get preparationTime(): number | null {
    return this._preparationTime;
  }

  get deliveryDate(): Date | null {
    return this._deliveryDate;
  }

  get voucher(): string | null {
    return this._voucher;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  placeOrder(orderId: string, preparationTime: number): void {
    if (!PurchaseState.canTransitionTo(this._state, PurchaseState.ORDER_REQUESTED)) {
      throw new Error(`Cannot transition from ${this._state} to ORDER_REQUESTED`);
    }
    this._orderId = orderId;
    this._preparationTime = preparationTime;
    this._state = PurchaseState.ORDER_REQUESTED;
    this._updatedAt = new Date();
  }

  bookDelivery(voucher: string, deliveryDate: Date): void {
    if (!PurchaseState.canTransitionTo(this._state, PurchaseState.RESERVE_DELIVERED)) {
      throw new Error(`Cannot transition from ${this._state} to RESERVE_DELIVERED`);
    }
    this._voucher = voucher;
    this._deliveryDate = deliveryDate;
    this._state = PurchaseState.RESERVE_DELIVERED;
    this._updatedAt = new Date();
  }

  complete(): void {
    if (!PurchaseState.canTransitionTo(this._state, PurchaseState.COMPLETED)) {
      throw new Error(`Cannot transition from ${this._state} to COMPLETED`);
    }
    this._state = PurchaseState.COMPLETED;
    this._updatedAt = new Date();
  }

  isCompleted(): boolean {
    return PurchaseState.isFinal(this._state);
  }

  toPlainObject(): {
    id: number;
    destinationAddress: string;
    state: string;
    orderId: string | null;
    preparationTime: number | null;
    deliveryDate: Date | null;
    voucher: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      destinationAddress: this._destinationAddress.toString(),
      state: this._state,
      orderId: this._orderId,
      preparationTime: this._preparationTime,
      deliveryDate: this._deliveryDate,
      voucher: this._voucher,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
