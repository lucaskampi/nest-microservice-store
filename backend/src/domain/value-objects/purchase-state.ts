export enum PurchaseState {
  RECEIVED = 'RECEIVED',
  ORDER_REQUESTED = 'ORDER_REQUESTED',
  RESERVE_DELIVERED = 'RESERVE_DELIVERED',
  COMPLETED = 'COMPLETED',
}

export const PurchaseStateTransitions: Record<PurchaseState, PurchaseState[]> = {
  [PurchaseState.RECEIVED]: [PurchaseState.ORDER_REQUESTED],
  [PurchaseState.ORDER_REQUESTED]: [PurchaseState.RESERVE_DELIVERED],
  [PurchaseState.RESERVE_DELIVERED]: [PurchaseState.COMPLETED],
  [PurchaseState.COMPLETED]: [],
};

export namespace PurchaseState {
  export const INITIAL = PurchaseState.RECEIVED;
  export const FINAL = PurchaseState.COMPLETED;

  export function canTransitionTo(from: PurchaseState, to: PurchaseState): boolean {
    return PurchaseStateTransitions[from]?.includes(to) ?? false;
  }

  export function isInitial(state: PurchaseState): boolean {
    return state === INITIAL;
  }

  export function isFinal(state: PurchaseState): boolean {
    return state === FINAL;
  }
}
