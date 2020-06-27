import React from 'react';
import { List, Datagrid, TextField, EmailField, Edit, SimpleForm, ReferenceInput, TextInput, SelectInput } from 'react-admin';

export const PostEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Edit>
);