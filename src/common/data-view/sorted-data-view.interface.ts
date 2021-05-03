export interface SortedDataView<Sort extends string> {
  sort?: Sort;
}

export type SortFields<Field extends string> = Field | `-${Field}`;

export function toSortValidFields<Field extends string>(
  ...fields: Field[]
): SortFields<Field>[] {
  return [...fields, ...fields.map((field) => `-${field}` as const)];
}
