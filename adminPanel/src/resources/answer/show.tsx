import React from 'react';
import {
  ReferenceField,
  TextField,
  BooleanField,
  DateField,
  Show,
  SimpleShowLayout,
  RichTextField
} from "react-admin"

export const AnswerShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="author" />
      <RichTextField source="content" />
      <DateField source="created_at" />
      <TextField source="id" />
      <BooleanField source="published" />
      <ReferenceField source="question_id" reference="faq_question"><TextField source="content" /></ReferenceField>
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);