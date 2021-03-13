import {
  Button,
  Checkbox,
  CheckboxProps,
  Container,
  createStyles,
  FormControlLabel,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  TextField,
  withStyles,
} from '@material-ui/core';
import React, { useContext, useReducer, useState } from 'react';
import {
  ExCardContentProps,
  ViewExchangeInterface,
} from '../../../../../interfaces';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import MoneyIcon from '@material-ui/icons/Money';
import moment from 'jalali-moment';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBoxes,
  faCalendarTimes,
  faExchangeAlt,
  faMoneyBillWave,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import { TextLine } from '../../../../public';
import { useTranslation } from 'react-i18next';
import Utils from '../../../../public/utility/Utils';
import Ribbon from '../../../../public/ribbon/Ribbon';
import { ColorEnum } from '../../../../../enum';
import drug from '../../../../../assets/images/drug.png';
import pack from '../../../../../assets/images/pack.png';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { green } from '@material-ui/core/colors';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useMutation } from 'react-query';
import PharmacyDrug from 'services/api/PharmacyDrug';
import sweetAlert from 'utils/sweetAlert';
import MuiAlert from '@material-ui/lab/Alert';
import errorHandler from 'utils/errorHandler';
import { AddDrog1, AddDrog2, AddPack1, AddPack2 } from 'model/exchange';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(1),
      padding: '0 !important',
    },
    paper: {
      textAlign: 'center',
    },
    containerDetailPack: {
      padding: 0,
      borderTop: '1px solid silver',
    },
    ulDetailPack: {
      padding: 0,
      textAlign: 'left',
      listStyleType: 'none',
      float: 'right',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    container: {
      minHeight: 170,
      alignItems: 'center',
      // fontSize: 11,
    },
    cardcontent: {
      borderRadius: 5,
      // backgroundColor: '#E4E4E4',
      width: '100%',
    },
    rowRight: {
      display: 'flex',
      alignItems: 'center',
    },
    rowLeft: {
      display: 'table',
      textAlign: 'right',
    },
    colLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    colLeftIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    ulCardName: {
      padding: 0,
      textAlign: 'left',
      listStyleType: 'none',
    },
    ulRightCardName: {
      padding: 0,
      textAlign: 'right',
      listStyleType: 'none',
    },
    avatar: {
      verticalAlign: 'middle',
      width: 80,
      height: 80,
      borderRadius: '10%',
      backgroundColor: 'silver',
    },
    ribbon: {
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
        color: 'silver',
        textShadow: '0 1px 1px rgba(0,0,0,.2)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 10,
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
        top: 25,
        transform: 'rotate(45deg)',
        height: 30,
        margin: 5,
        padding: 0,
        paddingLeft: 8,
      },
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
    horzintalLine: {
      marginRight: 3,
      marginLeft: 3,
      fontSize: 18,
      color: 'silver',
    },
  })
);

function NewExCardContent(props: ExCardContentProps): JSX.Element {
  const { pharmacyDrug, formType, packInfo, isPack } = props;
  const {
    root,
    paper,
    container,
    cardcontent,
    ulCardName,
    ulDetailPack,
    ulRightCardName,
    colLeftIcon,
    ribbon,
    ribbonTopLeft,
    avatar,
    counterButton,
    counterButtonRight,
    counterButtonLeft,
    textCounter,
    containerDetailPack,
    horzintalLine,
  } = useClasses();

  const {
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    activeStep,
    setRecommendationMessage,
    setExchangeId,
    selectedPharmacyForTransfer,
    viewExhcnage,
    setViewExchange,
    exchangeId,
    lockedAction,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { t } = useTranslation();
  const [drugInfo, setDrugInfo] = React.useState<AllPharmacyDrugInterface>();
  const [state, setState] = React.useState({
    checkedG: false,
  });

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setState({ ...state, [event.target.name]: event.target.checked });

    if (!isPack) {
      if (viewExhcnage && !viewExhcnage.currentPharmacyIsA) {
        await addDrug2Handle();
      } else {
        await addDrugHandle();
      }
    } else {
      if (viewExhcnage && !viewExhcnage.currentPharmacyIsA) {
        await pack2Handle();
        // setExpanded(false);
      } else {
        await packHandle();
        // setExpanded(false);
      }
    }
  };

  const { getViewExchange } = new PharmacyDrug();

  const {
    addDrug1,
    addPack1,
    removePack1,
    addDrug2,
    addPack2,
    removePack2,
  } = new PharmacyDrug();

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState<string>('');

  const [isLoading, setIsLoading] = React.useState(false);

  const snackBarHandleClick = (): any => {
    setOpen(true);
  };

  const snackBarHandleClose = (event: any, reason: any): any => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const Alert = (props: any): JSX.Element => {
    return (
      <MuiAlert
        style={{ zIndex: 99999 }}
        elevation={6}
        variant="filled"
        {...props}
      />
    );
  };

  const [_addDrug1] = useMutation(addDrug1, {
    onSuccess: async (res: any) => {
      if (res) {
        if (!exchangeId || exchangeId === 0) setExchangeId(res.data.exchangeId);
        setRecommendationMessage(res.data.recommendationMessage);
        setMessage(t('alert.successAddDrug'));
        snackBarHandleClick();

        if (!viewExhcnage) {
          const viewExResult = await getViewExchange(res.data.exchangeId);
          const result: ViewExchangeInterface | undefined = viewExResult.data;
          if (result) setViewExchange(result);
        }
      }
    },
  });

  const [_removeDrug1] = useMutation(addDrug1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddDrug'));
        snackBarHandleClick();
      }
    },
  });

  const [_addPack1] = useMutation(addPack1, {
    onSuccess: async (res) => {
      if (res) {
        if (!exchangeId || exchangeId === 0) setExchangeId(res.data.exchangeId);
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();

        if (!viewExhcnage) {
          const viewExResult = await getViewExchange(res.data.exchangeId);
          const result: ViewExchangeInterface | undefined = viewExResult.data;
          if (result) setViewExchange(result);
        }
      }
    },
  });

  const [_removePack1] = useMutation(removePack1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_addDrug2] = useMutation(addDrug2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_removeDrug2] = useMutation(addDrug2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_addPack2] = useMutation(addPack2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_removePack2] = useMutation(removePack2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const addDrugHandle = async (): Promise<any> => {
    const inputmodel = new AddDrog1();
    if (!pharmacyDrug) return;
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.pharmacyKey = selectedPharmacyForTransfer;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      pharmacyDrug.buttonName === 'افزودن به تبادل' &&
      (!pharmacyDrug.currentCnt || pharmacyDrug.currentCnt === 0)
    ) {
      await sweetAlert({
        type: 'error',
        text: 'مقدار وارد شده معتبر نمی باشد',
      });
      return;
    }

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug?.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug?.id))
    ) {
      inputmodel.count = 0;
    }

    setIsLoading(true);
    try {
      if (inputmodel.count > 0) {
        const res = await _addDrug1(inputmodel);
        if (res) {
          pharmacyDrug.currentCnt = inputmodel.count;
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        }
      } else {
        await _removeDrug1(inputmodel);
        pharmacyDrug.currentCnt = pharmacyDrug.cnt;
        if (
          (activeStep === 1 && basketCount.length === 1) ||
          (activeStep === 2 && uBasketCount.length === 1)
        ) {
          if (activeStep === 1) setBasketCount([]);
          else setUbasketCount([]);
        } else {
          if (activeStep === 1)
            setBasketCount([
              ...basketCount.filter((x) => x.id !== pharmacyDrug.id),
            ]);
          else
            setUbasketCount([
              ...uBasketCount.filter((x) => x.id !== pharmacyDrug.id),
            ]);
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorHandler(e);
    }
  };

  const addDrug2Handle = async (): Promise<any> => {
    const inputmodel = new AddDrog2();
    if (!pharmacyDrug) return;
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.exchangeID = exchangeId;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      pharmacyDrug.buttonName === 'افزودن به تبادل' &&
      (!pharmacyDrug.currentCnt || pharmacyDrug.currentCnt === 0)
    ) {
      await sweetAlert({
        type: 'error',
        text: 'مقدار وارد شده معتبر نمی باشد',
      });
      return;
    }

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug.id))
    ) {
      inputmodel.count = 0;
    }

    setIsLoading(true);
    try {
      if (inputmodel.count > 0) {
        const res = await _addDrug2(inputmodel);
        if (res) {
          pharmacyDrug.currentCnt = inputmodel.count;
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        }
      } else {
        await _removeDrug2(inputmodel);
        pharmacyDrug.currentCnt = pharmacyDrug.cnt;
        if (
          (activeStep === 1 && basketCount.length === 1) ||
          (activeStep === 2 && uBasketCount.length === 1)
        ) {
          if (activeStep === 1) setBasketCount([]);
          else setUbasketCount([]);
        } else {
          if (activeStep === 1)
            setBasketCount([
              ...basketCount.filter((x) => x.id !== pharmacyDrug.id),
            ]);
          else
            setUbasketCount([
              ...uBasketCount.filter((x) => x.id !== pharmacyDrug.id),
            ]);
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorHandler(e);
    }
  };

  const packHandle = async (): Promise<any> => {
    const inputmodel = new AddPack1();
    if (pharmacyDrug !== undefined && pharmacyDrug.packID !== undefined) {
      inputmodel.packID = pharmacyDrug.packID;
      inputmodel.pharmacyKey = selectedPharmacyForTransfer;

      setIsLoading(true);
      if (
        (activeStep === 1 &&
          !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
        (activeStep === 2 &&
          !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
      ) {
        try {
          const res = await _addPack1(inputmodel);
          if (res) {
            if (activeStep === 1)
              setBasketCount([...basketCount, pharmacyDrug]);
            else setUbasketCount([...uBasketCount, pharmacyDrug]);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      } else {
        try {
          await _removePack1(inputmodel);
          // dispatch({ type: 'reset' });
          if (activeStep === 1)
            setBasketCount([
              ...basketCount.filter((x) => x.packID !== pharmacyDrug.packID),
            ]);
          else
            setUbasketCount([
              ...uBasketCount.filter((x) => x.packID !== pharmacyDrug.packID),
            ]);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      }
    }
  };

  const pack2Handle = async (): Promise<any> => {
    const inputmodel = new AddPack2();
    if (pharmacyDrug !== undefined && pharmacyDrug.packID !== undefined) {
      inputmodel.packID = pharmacyDrug.packID;
      inputmodel.exchangeID = exchangeId;

      setIsLoading(true);
      if (
        (activeStep === 1 &&
          !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
        (activeStep === 2 &&
          !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
      ) {
        try {
          const res = await _addPack2(inputmodel);
          if (res) {
            if (activeStep === 1)
              setBasketCount([...basketCount, pharmacyDrug]);
            else setUbasketCount([...uBasketCount, pharmacyDrug]);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      } else {
        try {
          await _removePack2(inputmodel);
          // dispatch({ type: 'reset' });
          if (activeStep === 1)
            setBasketCount([
              ...basketCount.filter((x) => x.packID !== pharmacyDrug.packID),
            ]);
          else
            setUbasketCount([
              ...uBasketCount.filter((x) => x.packID !== pharmacyDrug.packID),
            ]);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      }
    }
  };

  const PackContent = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={12} md={6}>
          <Grid
            container
            style={{ display: 'flex', alignItems: 'center', paddingRight: 15 }}
          >
            <Grid item xs={3} style={{ direction: 'ltr' }}>
              <img src={pack} className={avatar} width="80" height="80" />
            </Grid>
            <Grid item xs={9}>
              <ul className={ulCardName} style={{ paddingRight: 10 }}>
                <li>
                  <span style={{ fontSize: 17, fontWeight: 'bold' }}>
                    پک {pharmacyDrug?.packName}
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 13 }}>دسته بندی: </span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {pharmacyDrug?.packCategoryName}
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 11 }}>
                    تعداد داروهای عرضه شده در این پک:{' '}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {pharmacyDrug?.cnt} عدد
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 13 }}>تاریخ انقضا: </span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {getExpireDate(pharmacyDrug?.expireDate)}
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 9.5, color: 'red' }}>
                    همه اقلام یک پک با هم و با تعداد مشخص شده قابل انتخاب هستند
                  </span>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={9}>
              <ul className={ulRightCardName} style={{ paddingRight: 10 }}>
                <li>
                  <span style={{ fontSize: 13 }}>قیمت کل اقلام این پک: </span>
                  <span
                    style={{ fontSize: 17, fontWeight: 'bold', color: 'green' }}
                  >
                    {Utils.numberWithCommas(pharmacyDrug?.totalAmount)}
                  </span>
                  <span
                    style={{ fontSize: 12, marginRight: 5, color: 'green' }}
                  >
                    تومان
                  </span>
                </li>
              </ul>
            </Grid>
            <Grid item xs={3}>
              <GreenCheckbox
                checked={state.checkedG}
                onChange={handleChange}
                name="checkedG"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getExpireDate = (date: any): string => {
    const faDate = moment(date, 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD');
    const eDate = moment.from(faDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    const fromDate = new Date(eDate);
    const today = new Date();

    const differenceInDays = Utils.getDifferenceInDays(today, fromDate);

    const res = `${faDate}`;

    return res;
  };

  const PackDetailContent = (): JSX.Element[] | any => {
    if (packInfo && packInfo.length > 0) {
      return packInfo.map((item: AllPharmacyDrugInterface) => {
        return (
          <div className={root}>
            <Paper className={paper}>
              <Grid container item spacing={0} style={{ padding: 2 }}>
                <Grid
                  item
                  xs={4}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <FontAwesomeIcon icon={faPills} size="1x" />
                  <span
                    style={{ marginRight: 5, fontSize: 11, fontWeight: 'bold' }}
                  >
                    {item.drug.name}
                    {item.drug.enName && `(${item.drug.enName})`}
                  </span>
                </Grid>
                <Grid item xs={8} style={{ textAlign: 'left', fontSize: 11 }}>
                  <ul className={ulDetailPack}>
                    <li className={colLeftIcon}>
                      <span>تاریخ انقضا: </span>
                      {getExpireDate(item.expireDate)}
                    </li>
                    <Hidden smDown>
                      <span className={horzintalLine}>|</span>
                    </Hidden>
                    <li className={colLeftIcon}>
                      <span>قیمت واحد: </span>
                      {Utils.numberWithCommas(item.amount)} تومان
                    </li>
                    <Hidden smDown>
                      <span className={horzintalLine}>|</span>
                    </Hidden>
                    <li className={colLeftIcon}>
                      <span>تعداد در این پک: </span>
                      {item.cnt} عدد
                    </li>
                    <Hidden smDown>
                      <span className={horzintalLine}>|</span>
                    </Hidden>
                    <li className={colLeftIcon}>
                      <span>قیمت کل: </span>
                      {Utils.numberWithCommas(item.amount * item.cnt)} تومان
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </Paper>
          </div>
        );
      });
    }
    return <></>;
  };

  const counterHandle = (e: string): void => {
    if (pharmacyDrug)
      switch (e) {
        case '+':
          if (pharmacyDrug.cnt > pharmacyDrug.currentCnt) {
            setDrugInfo({
              ...pharmacyDrug,
              currentCnt: pharmacyDrug.currentCnt += 1,
            });
          }
          break;
        case '-':
          if (pharmacyDrug.currentCnt > 1) {
            setDrugInfo({
              ...pharmacyDrug,
              currentCnt: pharmacyDrug.currentCnt -= 1,
            });
          }
          break;
        default:
          break;
      }
  };

  const counterButtonFunc = (): JSX.Element => {
    debugger;
    return pharmacyDrug?.buttonName === 'افزودن به تبادل' ? (
      <>
        <Button
          size="small"
          variant="outlined"
          className={`${counterButton} ${counterButtonRight}`}
          onClick={(): void => counterHandle('+')}
        >
          <AddIcon />
        </Button>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          className={textCounter}
          defaultValue={pharmacyDrug.currentCnt}
          onChange={(e): void => {
            pharmacyDrug.currentCnt = +e.target.value;
          }}
        >
          {pharmacyDrug.currentCnt}
        </TextField>
        <Button
          size="small"
          variant="outlined"
          className={`${counterButton} ${counterButtonLeft}`}
          onClick={(): void => counterHandle('-')}
        >
          <RemoveIcon />
        </Button>
      </>
    ) : (
      <>
        <span style={{ fontSize: 13 }}>تعداد اقلام انتخاب شده: </span>
        <span style={{ fontSize: 17, fontWeight: 'bold', color: 'green' }}>
          {pharmacyDrug?.currentCnt} عدد
        </span>
      </>
    );
  };

  const totalAmount = (): string => {
    let val = 0;
    if (pharmacyDrug) val = pharmacyDrug.amount * pharmacyDrug.currentCnt;
    return Utils.numberWithCommas(val);
  };

  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props: CheckboxProps) => (
    <Checkbox
      color="default"
      {...props}
      style={{
        transform: 'scale(2)',
      }}
    />
  ));

  const DrugInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        <Grid item xs={12} sm={12} md={6}>
          <Grid
            container
            style={{ display: 'flex', alignItems: 'center', paddingRight: 15 }}
          >
            <Grid item xs={3} style={{ direction: 'ltr' }}>
              <img src={drug} className={avatar} width="80" height="80" />
            </Grid>
            <Grid item xs={9}>
              <ul className={ulCardName} style={{ paddingRight: 10 }}>
                <li>
                  <span style={{ fontSize: 17, fontWeight: 'bold' }}>
                    {pharmacyDrug?.drug.name}
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 13 }}>
                    {pharmacyDrug?.drug.genericName}
                    {pharmacyDrug?.drug.enName &&
                      `(${pharmacyDrug?.drug.enName})`}
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 13 }}>موجودی عرضه شده: </span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {pharmacyDrug?.cnt} عدد
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: 13 }}>تاریخ انقضا: </span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {getExpireDate(pharmacyDrug?.expireDate)}
                  </span>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={9}>
              <ul className={ulRightCardName} style={{ paddingRight: 10 }}>
                <li>
                  <span style={{ fontSize: 13 }}>قیمت واحد: </span>
                  <span
                    style={{ fontSize: 17, fontWeight: 'bold', color: 'green' }}
                  >
                    {Utils.numberWithCommas(pharmacyDrug?.amount)}
                  </span>
                  <span
                    style={{ fontSize: 12, marginRight: 5, color: 'green' }}
                  >
                    تومان
                  </span>
                </li>
                <li>{counterButtonFunc()}</li>
                <li>
                  <span style={{ fontSize: 13 }}>جمع اقلام انتخاب شده: </span>
                  <span
                    style={{ fontSize: 17, fontWeight: 'bold', color: 'green' }}
                  >
                    {totalAmount()}
                    <span style={{ fontSize: 12, marginRight: 5 }}>تومان</span>
                  </span>
                </li>
              </ul>
            </Grid>
            <Grid item xs={3}>
              <GreenCheckbox
                checked={
                  activeStep === 1
                    ? basketCount.findIndex((x) => x.id == pharmacyDrug?.id) !==
                      -1
                    : uBasketCount.findIndex(
                        (x) => x.id == pharmacyDrug?.id
                      ) !== -1
                }
                onChange={handleChange}
                name={pharmacyDrug?.id.toString()}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container
      className={
        formType === 1 || formType === 2
          ? `${cardcontent}`
          : `${containerDetailPack}`
      }
    >
      {formType === 1 && <PackContent />}
      {formType === 2 && <DrugInfo />}
      {formType === 3 && <PackDetailContent />}
    </Container>
  );
}

export default NewExCardContent;