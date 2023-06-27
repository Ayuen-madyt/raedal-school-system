import React, { Fragment } from "react";
import { Sidebar } from "./Sidebar";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  layout: {
    paddingTop: 0,
    overflowX: "auto", // Enable horizontal scrolling
    overflowY: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: theme.colors.gray[2] + " " + theme.colors.gray[4], // Set the scrollbar color
    "&::-webkit-scrollbar": {
      height: theme.spacing.xs, // Set the height of the scrollbar
      backgroundColor: theme.colors.gray[4], // Set the background color of the scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: theme.radius.sm, // Set the border radius of the scrollbar thumb
      backgroundColor: theme.colors.gray[2], // Set the color of the scrollbar thumb
    },
    // Add any other styling for the navbar
    backgroundColor: theme.colorScheme.background,
    flex: 1,
    position: "fixed",
    top: 20,
    bottom: 0,
    right: 0,
    left: 200,
  },
  titleBarContainer: {
    position: 'absolute',
    top: 'env(titlebar-area-y, 0)',
    height: 'env(titlebar-area-height, var(--fallback-title-bar-height))',
    width: '100%',
    backgroundColor: 'white',
    position: "fixed",
    zIndex: 99999,
    userSelect: 'none',
    /* Pre-fix app-region during standardization process */
    WebkitAppRegion: 'drag',
    marginLeft:-8,
    borderBottom: '1px solid whitesmoke'
  },
  
  titleBar: {  
    display: 'block',
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[6],
    lineHeight: 1,
    cursor: 'pointer',
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
    fontSize:13,
    marginTop:4
  },
  
  titleBarContent: {
    margin: 'auto',
    padding: '0 16px',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
  },
  
}));

const Layout = ({ children }) => {
  const { classes } = useStyles();
  return (
    <Fragment>
      <div className={classes.titleBarContainer}>
        <div id="titleBar" className={classes.titleBarContent}>
          <span className={classes.titleBar}>Example PWA</span>
          <span className={classes.titleBar}>Raedal School Management System</span>
          <span className={classes.titleBar}></span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className={classes.layout} >
          {children}
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
