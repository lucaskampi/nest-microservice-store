import { Purchase, PurchaseProps } from './purchase';
import { PurchaseState } from '../value-objects/purchase-state';
import { Address } from '../value-objects/address';

describe('Purchase', () => {
  let props: PurchaseProps;

  beforeEach(() => {
    props = {
      id: 1,
      destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      state: PurchaseState.RECEIVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('create', () => {
    it('should create purchase with RECEIVED state', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });

      expect(purchase.state).toBe(PurchaseState.RECEIVED);
      expect(purchase.orderId).toBeNull();
      expect(purchase.voucher).toBeNull();
      expect(purchase.deliveryDate).toBeNull();
      expect(purchase.preparationTime).toBeNull();
    });

    it('should auto-generate id', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });
      expect(purchase.id).toBeDefined();
    });
  });

  describe('state transitions', () => {
    it('should transition from RECEIVED to ORDER_REQUESTED', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });

      purchase.placeOrder('ORDER-123', 3);

      expect(purchase.state).toBe(PurchaseState.ORDER_REQUESTED);
      expect(purchase.orderId).toBe('ORDER-123');
      expect(purchase.preparationTime).toBe(3);
    });

    it('should transition from ORDER_REQUESTED to RESERVE_DELIVERED', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });
      purchase.placeOrder('ORDER-123', 3);

      const deliveryDate = new Date();
      purchase.bookDelivery('VOUCHER-001', deliveryDate);

      expect(purchase.state).toBe(PurchaseState.RESERVE_DELIVERED);
      expect(purchase.voucher).toBe('VOUCHER-001');
      expect(purchase.deliveryDate).toBe(deliveryDate);
    });

    it('should transition from RESERVE_DELIVERED to COMPLETED', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });
      purchase.placeOrder('ORDER-123', 3);
      purchase.bookDelivery('VOUCHER-001', new Date());

      purchase.complete();

      expect(purchase.state).toBe(PurchaseState.COMPLETED);
    });

    it('should NOT allow invalid state transitions', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });

      expect(() => purchase.bookDelivery('VOUCHER-001', new Date())).toThrow();
    });

    it('should NOT allow transition from COMPLETED', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });
      purchase.placeOrder('ORDER-123', 3);
      purchase.bookDelivery('VOUCHER-001', new Date());
      purchase.complete();

      expect(() => purchase.placeOrder('ORDER-456', 5)).toThrow();
    });
  });

  describe('isCompleted', () => {
    it('should return false for RECEIVED', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });
      expect(purchase.isCompleted()).toBe(false);
    });

    it('should return true for COMPLETED', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });
      purchase.placeOrder('ORDER-123', 3);
      purchase.bookDelivery('VOUCHER-001', new Date());
      purchase.complete();

      expect(purchase.isCompleted()).toBe(true);
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object representation', () => {
      const purchase = Purchase.create({
        destinationAddress: Address.create({ street: 'Main St', number: 123, state: 'SP' }),
      });

      const plain = purchase.toPlainObject();

      expect(plain.state).toBe('RECEIVED');
      expect(plain.destinationAddress).toBe('Main St, 123, SP');
    });
  });
});
