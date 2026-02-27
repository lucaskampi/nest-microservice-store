export interface AddressProps {
  street: string;
  number: number;
  state: string;
}

export class Address {
  readonly street: string;
  readonly number: number;
  readonly state: string;

  private constructor(props: AddressProps) {
    this.street = props.street;
    this.number = props.number;
    this.state = props.state;
  }

  static create(props: AddressProps): Address {
    return new Address({
      street: props.street.trim(),
      number: props.number,
      state: props.state.trim().toUpperCase(),
    });
  }

  static fromDto(dto: { street: string; number: number; state: string }): Address {
    return Address.create({
      street: dto.street,
      number: dto.number,
      state: dto.state,
    });
  }

  toString(): string {
    return `${this.street}, ${this.number}, ${this.state}`;
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.number === other.number &&
      this.state === other.state
    );
  }
}
