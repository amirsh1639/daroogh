import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';

const useClasses = makeStyles((theme) =>
  createStyles({
    ribbon: {
      zIndex: 100,
      opacity: 0.9,
      width: '150px',
      height: '150px',
      overflow: 'hidden',
      position: 'absolute',
      '&::before &::after': {
        position: 'absolute',
        zIndex: -1,
        content: '',
        display: 'block',
        border: '5px solid #2980b9',
      },
      '& span': {
        position: 'absolute',
        display: 'block',
        width: '225px',
        padding: '15px 0',
        backgroundColor: 'white',
        boxShadow: '0 5px 10px rgba(0,0,0,.1)',
        color: '#4a4a4a',
        textShadow: '0 1px 1px rgba(0,0,0,.2)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 10,
      },
    },
    toolbarRibbon: {
      zIndex: 100,
      opacity: 0.9,
      width: '150px',
      height: '64px',
      overflow: 'hidden',
      position: 'absolute',
      '&::before &::after': {
        position: 'absolute',
        zIndex: -1,
        content: '',
        display: 'block',
        border: '5px solid #2980b9',
      },
      '& span': {
        position: 'absolute',
        display: 'block',
        width: '225px',
        padding: '15px 0',
        backgroundColor: 'white',
        boxShadow: '0 5px 10px rgba(0,0,0,.1)',
        color: '#4a4a4a',
        textShadow: '0 1px 1px rgba(0,0,0,.2)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 10,
      },
    },
    toolbarRibbonTopLeft: {
      top: '0',
      right: '0',
      '&::before &::after': {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
      },
      '&::before': {
        top: 0,
        left: 0,
      },
      '&::after': {
        bottom: 0,
        right: 0,
      },
      '& span': {
        left: -15,
        top: 10,
        transform: 'rotate(45deg)',
        height: 30,
        margin: 5,
        padding: 0,
        paddingLeft: 27,
      },
    },
    ribbonTopLeft: {
      top: '-10px',
      right: '-10px',
      '&::before &::after': {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
      },
      '&::before': {
        top: 0,
        left: 0,
      },
      '&::after': {
        bottom: 0,
        right: 0,
      },
      '& span': {
        left: -15,
        top: 10,
        transform: 'rotate(45deg)',
        height: 30,
        margin: 5,
        padding: 0,
        paddingLeft: 27,
      },
    },
  })
);

interface RibbonPI {
  text: string;
  isExchange?: boolean;
  isToolbar?: boolean;
}

const Ribbon = (props: RibbonPI): JSX.Element => {
  const {
    ribbon,
    ribbonTopLeft,
    toolbarRibbon,
    toolbarRibbonTopLeft,
  } = useClasses();
  const { text, isExchange = true, isToolbar = false } = props;

  return (
    <div
      className={
        isToolbar
          ? `${toolbarRibbon} ${toolbarRibbonTopLeft}`
          : `${ribbon} ${ribbonTopLeft}`
      }
    >
      {isExchange ? (
        <span>
          {`${text} شده`}
          <br />
          توسط داروخانه مقابل
        </span>
      ) : (
        <span
          style={{
            color: 'red',
            fontWeight: 'bold',
            height: 17,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Ribbon;
