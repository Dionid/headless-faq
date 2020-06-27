import React from 'react';
import {
  ReferenceField,
  TextField,
  BooleanField,
  DateField,
  Show,
  SimpleShowLayout
} from "react-admin"

export const QuestionShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <BooleanField source="additional.canPublish" />
      <TextField source="content" />
      <DateField source="created_at" />
      <TextField source="creator" />
      <TextField source="id" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);