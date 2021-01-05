import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Hidden,
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTranslation } from 'react-i18next';
import { ViewExchangeInterface, CardInfo } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import { DaroogTabPanel, TextLine } from '../../../../public';
import { Convertor, isNullOrEmpty } from '../../../../../utils';
import { ColorEnum } from '../../../../../enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarPlus,
  faCalendarTimes,
  faMoneyBillAlt,
} from '@fortawesome/free-regular-svg-icons';
import { faListOl } from '@fortawesome/free-solid-svg-icons';
import moment from 'jalali-moment';
import {
  getExpireDateTitle,
  getExpireDate,
  ViewExchangeInitialState,
} from '../../../../../utils/ExchangeTools';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { JsxEmit } from 'typescript';

interface Props {
  exchange: ViewExchangeInterface | undefined;
  onClose?: () => void;
  showActions?: boolean;
  isModal?: boolean;
}

const ExCalculator: React.FC<Props> = (props) => {
  const exchange: ViewExchangeInterface =
    props.exchange == undefined ? ViewExchangeInitialState : props.exchange;
  const { onClose, showActions = true, isModal = true } = props;
  // if (showActions === undefined) showActions = true;

  const { t } = useTranslation();
  const {
    ltr,
    rtl,
    spacing3,
    spacingVertical3,
    faIcons,
    darkText,
  } = useClasses();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    activeStep,
    is3PercentOk,
    setIs3PercentOk,
    basketCount,
    uBasketCount,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  let expireDate: string = '';
  let expireDateText: string = '';

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ): void => {
    setCurrentTabIndex(newValue);
  };

  const reCheckData = (): any => {
    expireDate = getExpireDate(exchange);
    expireDateText = t(getExpireDateTitle(exchange.state));
  };

  // useEffect(() => {
  reCheckData();
  // }, [exchange, basketCount, uBasketCount]);

  let totalPriceA = 0;
  let totalPriceB = 0;

  useEffect(() => {
    const threePercent = totalPriceA * 0.03;
    const diff = Math.abs(totalPriceA - totalPriceB);
    if (setIs3PercentOk) setIs3PercentOk(diff < threePercent);
  }, [totalPriceA, totalPriceB]);

  const getOneSideData = (you: boolean): JSX.Element => {
    let card;
    const totalPourcentage = exchange.currentPharmacyIsA
      ? exchange.totalPourcentageA
      : exchange.totalPourcentageB;
    if (you) {
      card = uBasketCount; // exchange.cartA;
    } else {
      card = basketCount; // exchange.cartB;
    }
    let totalCount = 0;
    let totalPrice = 0;

    return (
      <>
        {card && card.length > 0 && (
          <>
            <TableContainer component={Paper} className={darkText}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className={darkText}>
                      {t('drug.drug')}
                    </TableCell>
                    <TableCell align="center" className={darkText}>
                      {t('general.number')}
                    </TableCell>
                    <TableCell align="center" className={darkText}>
                      {t('general.price')} ({t('general.rial')})
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {card.map((row) => {
                    totalCount += row.currentCnt;
                    const price =
                      row.packID == undefined
                        ? row.amount * row.currentCnt
                        : row.totalAmount;
                    totalPrice += price;
                    console.log('row: ', row);
                    return (
                      <TableRow key={row.drug.name}>
                        <TableCell scope="row" className={darkText}>
                          {row.drug.name}
                        </TableCell>
                        <TableCell align="center" className={darkText}>
                          {row.currentCnt}
                        </TableCell>
                        <TableCell align="center" className={darkText}>
                          {Convertor.thousandsSeperatorFa(price)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {you &&
                    ((): any => {
                      totalPriceA = totalPrice;
                    })()}
                  {!you &&
                    ((): any => {
                      totalPriceB = totalPrice;
                    })()}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <div className={spacing3}>&nbsp;</div>
        {!isNullOrEmpty(totalCount) && (
          <Grid item xs={12} className={spacingVertical3}>
            <TextLine
              backColor={ColorEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={faListOl}
                    size="lg"
                    className={faIcons}
                  />
                  {t('general.number')}
                </>
              }
              leftText={totalCount.toLocaleString()}
            />
          </Grid>
        )}
        {!isNullOrEmpty(totalPrice) && (
          <Grid item xs={12} className={spacingVertical3}>
            <TextLine
              backColor={ColorEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={faListOl}
                    size="lg"
                    className={faIcons}
                  />
                  {t('exchange.totalPrice')}
                </>
              }
              leftText={Convertor.zeroSeparator(totalPrice)}
            />
          </Grid>
        )}
        {!isNullOrEmpty(totalPourcentage) && totalPourcentage > 0 && (
          <Grid item xs={12} className={spacingVertical3}>
            <TextLine
              backColor={ColorEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={faMoneyBillAlt}
                    className={faIcons}
                    size="lg"
                  />
                  {t('exchange.commission')}
                </>
              }
              leftText={totalPourcentage}
            />
          </Grid>
        )}
      </>
    );
  };

  const CalcConternt = (): JSX.Element => {
    return (
      <Grid container>
        {/* separate data */}
        <Grid item xs={12}>
          <Tabs
            value={currentTabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            centered
          >
            <Tab label={t('exchange.you')} />
            <Tab label={t('exchange.otherSide')} />
          </Tabs>
          {/* <SwipeableViews
              enableMouseEvents
              index={ currentTabIndex }
              onChangeIndex={ (index: number): void => setCurrentTabIndex(index) }
            > */}
          <DaroogTabPanel value={currentTabIndex} index={0}>
            {getOneSideData(true)}
          </DaroogTabPanel>
          <DaroogTabPanel value={currentTabIndex} index={1}>
            {getOneSideData(false)}
          </DaroogTabPanel>
          {/* </SwipeableViews> */}
        </Grid>
        <Divider />
        {/* common data */}
        <Grid item xs={12}>
          {!isNullOrEmpty(exchange?.sendDate) && (
            <Grid item xs={12} className={spacingVertical3}>
              <TextLine
                backColor={ColorEnum.White}
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={faCalendarPlus}
                      size="lg"
                      className={faIcons}
                    />
                    {t('exchange.sendDate')}
                  </>
                }
                leftText={
                  exchange?.sendDate == null
                    ? ''
                    : moment(exchange?.sendDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')
                }
              />
            </Grid>
          )}
          {!isNullOrEmpty(expireDate) && (
            <Grid item xs={12} className={spacingVertical3}>
              <TextLine
                backColor={ColorEnum.White}
                rightText={
                  <>
                    <FontAwesomeIcon
                      icon={faCalendarTimes}
                      size="lg"
                      className={faIcons}
                    />
                    {expireDateText}
                  </>
                }
                leftText={
                  expireDate == null
                    ? ''
                    : moment(expireDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')
                }
              />
            </Grid>
          )}
          {!is3PercentOk && (
            <Grid item xs={12} className={spacingVertical3}>
              <b>{t('general.warning')}</b>:<br />
              {t('exchange.threePercentWarning')}
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  };

  const [dialogOpen, setDialogOpen] = useState(true);
  return (
    <>
      {isModal ? (
        <Dialog open={dialogOpen} fullScreen={fullScreen}>
          <DialogTitle>{t('exchange.exCalculator')}</DialogTitle>
          <Divider />
          <DialogContent className={darkText}>
            <CalcConternt />
          </DialogContent>
          {showActions && (
            <DialogActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={(): void => {
                  setDialogOpen(false);
                  if (onClose) onClose();
                }}
              >
                {t('general.ok')}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      ) : (
        <CalcConternt />
      )}
    </>
  );
};

export default ExCalculator;