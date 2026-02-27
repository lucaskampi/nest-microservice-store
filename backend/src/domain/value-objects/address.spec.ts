import { Address } from './address';

describe('Address', () => {
  describe('constructor', () => {
    it('should create address with all fields', () => {
      const address = Address.create({ street: 'Main St', number: 123, state: 'SP' });
      expect(address.street).toBe('Main St');
      expect(address.number).toBe(123);
      expect(address.state).toBe('SP');
    });

    it('should format to string correctly', () => {
      const address = Address.create({ street: 'Main St', number: 123, state: 'SP' });
      expect(address.toString()).toBe('Main St, 123, SP');
    });
  });

  describe('equality', () => {
    it('should be equal to same values', () => {
      const address1 = Address.create({ street: 'Main St', number: 123, state: 'SP' });
      const address2 = Address.create({ street: 'Main St', number: 123, state: 'SP' });
      expect(address1.equals(address2)).toBe(true);
    });

    it('should NOT be equal to different values', () => {
      const address1 = Address.create({ street: 'Main St', number: 123, state: 'SP' });
      const address2 = Address.create({ street: 'Other St', number: 456, state: 'RJ' });
      expect(address1.equals(address2)).toBe(false);
    });
  });

  describe('fromDto', () => {
    it('should create from DTO object', () => {
      const dto = { street: 'Main St', number: 123, state: 'SP' };
      const address = Address.fromDto(dto);
      expect(address.street).toBe('Main St');
      expect(address.number).toBe(123);
      expect(address.state).toBe('SP');
    });
  });
});
