import { Field } from '@prisma/client';

type FieldsSerializerInput = Field;

export class FieldsSerializer {
  id: string;
  name: string;
  value: string;

  constructor(field: FieldsSerializerInput) {
    this.id = field.id;
    this.name = field.name;
    this.value = field.value;
  }

  static factory(clue: FieldsSerializerInput) {
    return new FieldsSerializer(clue);
  }
}
