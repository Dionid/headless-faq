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
} from "react-admin"

export const QuestionList = (props: any) => (
    <List {...props} sort={{ field: 'updated_at', order: 'DESC' }}>
        <Datagrid>
            {/*<TextField source="id" />*/}
            <TextField source="content" />
            <TextField source="creator" />
            <BooleanField label="Can publish?" source="additional.canPublish" />
            <DateField source="created_at" />
            <DateField source="updated_at" />
            <ShowButton label=""/>
            <EditButton label=""/>
        </Datagrid>
    </List>
);