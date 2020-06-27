import React from 'react';
import { List, Datagrid, TextField, EmailField, Create, SimpleForm, ReferenceInput, TextInput, SelectInput } from 'react-admin';

export const PostCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Create>
);