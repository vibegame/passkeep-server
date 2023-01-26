import { Clue, Field, User } from '@prisma/client';

import { FieldsSerializer } from '../fields/fields.serializer';
import { UsersSerializer } from './../users/users.serializer';

type CluesSerializerInput = Clue & { user?: User; fields?: Field[] };

export class CluesSerializer {
  id: string;
  name: string;
  user?: UsersSerializer;
  fields?: FieldsSerializer[];

  constructor(clue: CluesSerializerInput) {
    this.id = clue.id;
    this.name = clue.name;
    this.user = clue.user ? new UsersSerializer(clue.user) : undefined;
    this.fields = clue.fields
      ? clue.fields.map(FieldsSerializer.factory)
      : undefined;
  }

  static factory(clue: CluesSerializerInput) {
    return new CluesSerializer(clue);
  }
}
