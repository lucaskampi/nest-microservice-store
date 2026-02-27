export class MockFactory {
  static create<T>(overrides?: Partial<T>): T {
    return {
      ...overrides,
    } as T;
  }

  static createMany<T>(count: number, factory: () => T): T[] {
    return Array.from({ length: count }, factory);
  }
}

export class RepositoryMock<T> {
  private entities: T[] = [];
  private idCounter = 0;

  findMany = jest.fn(async (): Promise<T[]> => {
    return [...this.entities];
  });

  findUnique = jest.fn(async (where: { id: number }): Promise<T | null> => {
    return this.entities.find((e) => (e as { id: number }).id === where.id) || null;
  });

  create = jest.fn(async (data: unknown): Promise<T> => {
    const entity = {
      id: ++this.idCounter,
      ...(data as object),
    } as T;
    this.entities.push(entity);
    return entity;
  });

  update = jest.fn(async (params: { where: { id: number }; data: unknown }): Promise<T> => {
    const index = this.entities.findIndex((e) => (e as { id: number }).id === params.where.id);
    if (index === -1) throw new Error('Entity not found');
    this.entities[index] = { ...this.entities[index], ...(params.data as object) } as T;
    return this.entities[index];
  });

  delete = jest.fn(async (where: { id: number }): Promise<void> => {
    const index = this.entities.findIndex((e) => (e as { id: number }).id === where.id);
    if (index !== -1) this.entities.splice(index, 1);
  });

  reset(): void {
    this.entities = [];
    this.idCounter = 0;
    jest.clearAllMocks();
  }

  setEntities(entities: T[]): void {
    this.entities = [...entities];
    this.idCounter = entities.length;
  }
}
