import React from 'react';
import {
    List,
    Datagrid,
    BooleanInput,
    DateInput,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    SelectInput,
    required
} from 'react-admin'

export const QuestionCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput multiline source="content" validate={required()}/>
            <BooleanInput source="additional.canPublish" initialValue={true}/>
            <TextInput source="creator"/>
        </SimpleForm>
    </Create>
);