import { PurchaseState } from './purchase-state';

describe('PurchaseState', () => {
  describe('transitions', () => {
    it('should allow transition from RECEIVED to ORDER_REQUESTED', () => {
      expect(PurchaseState.canTransitionTo(PurchaseState.RECEIVED, PurchaseState.ORDER_REQUESTED)).toBe(true);
    });

    it('should allow transition from ORDER_REQUESTED to RESERVE_DELIVERED', () => {
      expect(PurchaseState.canTransitionTo(PurchaseState.ORDER_REQUESTED, PurchaseState.RESERVE_DELIVERED)).toBe(true);
    });

    it('should allow transition from RESERVE_DELIVERED to COMPLETED', () => {
      expect(PurchaseState.canTransitionTo(PurchaseState.RESERVE_DELIVERED, PurchaseState.COMPLETED)).toBe(true);
    });

    it('should NOT allow transition from RECEIVED directly to COMPLETED', () => {
      expect(PurchaseState.canTransitionTo(PurchaseState.RECEIVED, PurchaseState.COMPLETED)).toBe(false);
    });

    it('should NOT allow transition from RECEIVED to RECEIVED', () => {
      expect(PurchaseState.canTransitionTo(PurchaseState.RECEIVED, PurchaseState.RECEIVED)).toBe(false);
    });

    it('should NOT allow transition from COMPLETED to any state', () => {
      expect(PurchaseState.canTransitionTo(PurchaseState.COMPLETED, PurchaseState.RECEIVED)).toBe(false);
      expect(PurchaseState.canTransitionTo(PurchaseState.COMPLETED, PurchaseState.ORDER_REQUESTED)).toBe(false);
      expect(PurchaseState.canTransitionTo(PurchaseState.COMPLETED, PurchaseState.RESERVE_DELIVERED)).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should have RECEIVED as initial state', () => {
      expect(PurchaseState.INITIAL).toBe(PurchaseState.RECEIVED);
    });

    it('should have COMPLETED as final state', () => {
      expect(PurchaseState.FINAL).toBe(PurchaseState.COMPLETED);
    });
  });
});
