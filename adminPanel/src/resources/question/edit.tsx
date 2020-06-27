import React from 'react';
import { List, Datagrid, BooleanInput, DateInput, Edit, SimpleForm, ReferenceInput, TextInput, SelectInput } from 'react-admin';

export const QuestionEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput multiline source="content" />
            <TextInput source="creator" />
            <BooleanInput source="additional.canPublish" />
            <TextInput disabled source="id" />
            <DateInput disabled source="updated_at" />
            <DateInput disabled source="created_at" />
        </SimpleForm>
    </Edit>
);