import React from 'react';
import { List, Datagrid, ReferenceField, TextField, BooleanInput, DateInput, Edit, SimpleForm, ReferenceInput, TextInput, SelectInput } from 'react-admin';
// @ts-ignore
import RichTextInput from "ra-input-rich-text"

const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['code', 'bold', 'italic', 'underline', 'strike'],        // toggled buttons

    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

export const AnswerEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="author" />
            <RichTextInput source="content" toolbar={toolbarOptions}/>
            <BooleanInput source="published" />
            {/*<ReferenceInput disabled source="question_id" reference="question">*/}
            {/*    <SelectInput optionText="content" />*/}
            {/*</ReferenceInput>*/}
            <ReferenceField disabled source="question_id" reference="faq_question">
                <TextField source="content" />
            </ReferenceField>
            <DateInput disabled source="updated_at" />
            <DateInput disabled source="created_at" />
            <TextInput disabled source="id" />
        </SimpleForm>
    </Edit>
);