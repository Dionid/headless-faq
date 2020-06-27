import React from 'react';
import { Layout, AppBar } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { MySidebar } from "./sidebar"
// import MyAppBar from './MyAppBar';
// import MySidebar from './MySidebar';
// import MyMenu from './MyMenu';
// import MyNotification from './MyNotification';

const useStyles = makeStyles({
  toolbar: {
    // minHeight: 55
  },
});

const MyAppBar = (props: any) => {
  const classes = useStyles();
  // boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.10)"
  // return <AppBar classes={classes} style={{backgroundColor: '#fff', color: "#000", boxShadow: "none", borderBottom: "1px solid #e5e9ef"}} {...props} />;
  return <AppBar classes={classes} style={{boxShadow: "none", borderBottom: "1px solid #e5e9ef"}} color={"inherit"} {...props} />;
}

const MyLayout = (props:any) => <Layout
  {...props}
  appBar={MyAppBar}
  sidebar={MySidebar}
  // style={{backgroundColor: "#f2f4f7"}}
  // menu={MyMenu}
  // notification={MyNotification}
/>;

export default MyLayout;