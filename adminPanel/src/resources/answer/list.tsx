import React from 'react';
import {
    List,
    Datagrid,
    ReferenceField,
    ShowButton,
    TextField,
    BooleanField,
    DateField,
    EditButton,
    DeleteButton,
    FunctionField,
} from "react-admin"

export const AnswerList = (props: any) => (
    <List {...props}>
        <Datagrid>
            <FunctionField label={"Content"} render={(record: any) => `${record.content.substr(0, 400)}${record.content.length>400 ?  "..." : ""}`} />
            <BooleanField source="published" />
            <ReferenceField source="question_id" reference="faq_question">
                <FunctionField label={"Content"} render={(record: any) => `${record.content.substr(0, 400)}${record.content.length>400 ?  "..." : ""}`} />
            </ReferenceField>
            <DateField source="created_at" />
            <DateField source="updated_at" />
            <TextField source="author" />
            <ShowButton label=""/>
            <EditButton label=""/>
        </Datagrid>
    </List>
);