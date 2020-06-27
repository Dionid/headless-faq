import React from 'react';
import { List, Datagrid, BooleanInput, DateInput, Create, SimpleForm, ReferenceInput, TextInput, SelectInput } from 'react-admin';
// @ts-ignore
import RichTextInput from "ra-input-rich-text"

export const AnswerCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="author" initialValue={"David Shekunts"}/>
            <RichTextInput source="content" />
            <BooleanInput source="published" />
            <ReferenceInput source="question_id" reference="faq_question">
                <SelectInput optionText="content" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);