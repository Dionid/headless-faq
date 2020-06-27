import React from 'react';
import { Sidebar, Layout } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useSidebarStyles = makeStyles({
  drawerPaper: {
    backgroundColor: '#fff',
    margin: "15px",
    padding: "15px 5px",
    borderRadius: "10px",
    boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.10)",
  },
});

export const MySidebar = (props: any) => {
  const classes = useSidebarStyles();
  // style={{backgroundColor: '#fff', borderRight: "1px solid #e5e9ef"}}
  return (
    <Sidebar classes={classes} {...props} />
  );
}
