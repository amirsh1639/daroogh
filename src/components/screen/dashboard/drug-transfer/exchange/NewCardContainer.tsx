import React, { useReducer, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  ActionInterface,
  CardPropsInterface,
} from 'interfaces';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import { AddDrugInterface } from '../../../../../interfaces';
import { useTranslation } from 'react-i18next';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircleBackdropLoading from '../../../../public/loading/CircleBackdropLoading';
import Ribbon from '../../../../public/ribbon/Ribbon';
import { ColorEnum } from '../../../../../enum';

const style = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: 110,
      borderRadius: '0px !important',
      display: 'inline-block',
      position: 'relative',
      margin: -8,
      // boxShadow: '0 0 5px #cecece',
      border:`1px solid #ccc`
    },
    button: {
      height: 32,
      width: 90,
      fontSize: 10,
      fontWeight: 'bold',
    },
    counterButton: {
      height: 32,
      width: 20,
      minWidth: 30,
      fontSize: 11,
      fontWeight: 'bold',
      backgroundColor: '#3f51b5',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#8787f5',
      },
    },
    counterButtonRight: {
      borderRadius: '5px 0 0 5px',
    },
    counterButtonLeft: {
      borderRadius: '0 5px 5px 0',
    },
    textCounter: {
      width: 60,
      fontWeight: 'bold',
      textAlign: 'center',
      '& > .MuiOutlinedInput-inputMarginDense': {
        textAlign: 'center !important',
      },
      '& > .MuiOutlinedInput-root': {
        height: 32,
        borderRadius: 0,
        fontSize: 11,
      },
      '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
      },
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    actionExpand: {
      display: 'flex',
      justifyContent: 'center',
      height: 16,
      '& > .MuiIconButton-root': {
        marginLeft: 0,
      },
      marginBottom: 5,
    },
    textBoxCounter: {
      fontSize: 12,
      border: '1px solid',
      height: 10,
      width: 20,
      textAlign: 'center',
    },
    action: {
      display: 'flex',
      height: 35,
      '& > .MuiIconButton-root': {
        marginLeft: 0,
      },
      marginBottom: 10,
      marginRight: 10,
      marginLeft: 10,
    },
    pack: {
      backgroundColor: '#00bcd430',
    },
    collapse: {
      // position: 'absolute',
      // height: 'auto'
    },
    orderCard: {
      backgroundColor: 'white',
    },
  })
);

const initialState: AddDrugInterface = {
  pharmacyDrugID: 0,
  count: 0,
  pharmacyKey: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'pharmacyDrugID':
      return {
        ...state,
        pharmacyDrugID: value,
      };
    case 'count':
      return {
        ...state,
        count: value,
      };
    case 'pharmacyKey':
      return {
        ...state,
        pharmacyKey: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const NewCardContainer: React.FC<CardPropsInterface> = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [, setDrugInfo] = useState<AllPharmacyDrugInterface>();
  const [] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState<string>('');

  const [isLoading, setIsLoading] = React.useState(false);

  const snackBarHandleClose = (event: any, reason: any): any => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const Alert = (props: any): JSX.Element => {
    return <MuiAlert style={{ zIndex: 99999 }} elevation={6} variant="filled" {...props} />;
  };

  const { isPack, collapsableContent, basicDetail, pharmacyDrug } = props;
  const { expand, expandOpen, root, actionExpand, pack, collapse } = style();

  const handleExpandClick = (): any => {
    setExpanded(!expanded);
  };

  return (
    <>
      <CircleBackdropLoading isOpen={isLoading} />
      <Card
        className={`${root} ${isPack ? pack : ''}`}
        style={{ backgroundColor: pharmacyDrug.cardColor }}
      >
        {(pharmacyDrug?.cardColor === ColorEnum.AddedByB ||
          pharmacyDrug?.cardColor === ColorEnum.NotConfirmed) && (
          <Ribbon text={pharmacyDrug?.cardColor === ColorEnum.AddedByB ? 'اضافه' : 'حذف'} />
        )}
        <CardContent style={{ padding: 0 }}>{basicDetail}</CardContent>
        {isPack && (
          <>
            {expanded ? (
              <span style={{ fontSize: 10, color: 'blue' }}>بستن</span>
            ) : (
              <span style={{ fontSize: 10, color: 'green' }}>مشاهده اقلام این پک</span>
            )}
            <CardActions disableSpacing className={actionExpand}>
              <IconButton
                className={clsx(expand, { [expandOpen]: expanded })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit className={collapse}>
              <div> {collapsableContent} </div>
            </Collapse>
          </>
        )}
        <Snackbar open={open} autoHideDuration={5000} onClose={snackBarHandleClose}>
          <Alert onClose={snackBarHandleClose} severity="success">
            {message}
          </Alert>
        </Snackbar>
      </Card>
    </>
  );
};

export default NewCardContainer;
