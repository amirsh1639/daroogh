import React, { useContext, useEffect, useState } from 'react';
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { default as MatButton } from '@material-ui/core/Button';
import NewCardContainer from '../exchange/NewCardContainer';
import NewExCardContent from '../exchange/NewExCardContent';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';
import sweetAlert from '../../../../../utils/sweetAlert';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { setTransferEnd } from '../../../../../redux/actions';

const style = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: 0,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    stickyToolbox: {
      position: 'sticky',
      marginTop: -15,
      marginBottom: 15,
      marginLeft: '1px !important',
      top: 140,
      zIndex: 999,
      backgroundColor: '#f3f3f3',
      boxShadow: '0px 0px 3px 3px silver',
    },
    stickyRecommendation: {
      position: 'sticky',
      margin: 0,
      padding: 10,
      paddingTop: 0,
      top: 60,
      zIndex: 999,
    },
    desktopCardContent: {
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: -87,
      },
    },
    actionContainer: {
      display: 'flex',
      marginTop: 5,
      width: '100%',
    },
    cancelButton: {
      width: '100%',
    },
    confirmButton: {
      width: '100%',
    },
    cancelButton4: {
      width: '50%',
      marginRight: 10,
    },
    confirmButton4: {
      width: '50%',
      marginLeft: 10,
    },
  })
);

const Tab2: React.FC = () => {
  const { getAllPharmacyDrug } = new PharmacyDrug();
  const { t } = useTranslation();

  const {
    activeStep,
    setActiveStep,
    uAllPharmacyDrug,
    orgUAllPharmacyDrug,
    setUAllPharmacyDrug,
    setOrgUAllPharmacyDrug,
    openDialog,
    setOpenDialog,
    uBasketCount,
    selectedPharmacyForTransfer,
    viewExhcnage,
    lockedAction,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { cancelExchange } = new PharmacyDrug();
  const dispatch = useDispatch();

  useEffect(() => {
    return (): void => {
      dispatch(setTransferEnd());
    };
  }, []);

  const [] = useMutation(cancelExchange, {
    onSuccess: async (res) => {
      if (res) {
        await sweetAlert({
          type: 'success',
          text: res.message,
        });
      } else {
        await sweetAlert({
          type: 'error',
          text: 'عملیات ناموفق',
        });
      }
    },
  });

  const { paper, stickyToolbox } = style();

  const [listPageNo] = useState(0);
  const [pageSize] = useState(100);
  const [isSelected, setIsSelected] = React.useState(false);

  const handleChange = (event: any): any => {
    setIsSelected(event.target.checked);
    if (event.target.checked && lockedAction) refetch();
    else setUAllPharmacyDrug([]);
  };

  const { isLoading, refetch } = useQuery(
    ['key'],
    () => {
      return getAllPharmacyDrug('', listPageNo, pageSize);
    },
    {
      onSuccess: (data) => {
        const items: AllPharmacyDrugInterface[] = data.items;
        const newItems: AllPharmacyDrugInterface[] = [];
        const packList = new Array<AllPharmacyDrugInterface>();
        items.forEach((item) => {
          let ignore = false;
          if (item.packID) {
            let totalAmount = 0;
            if (!packList.find((x) => x.packID === item.packID)) {
              if (!item.packDetails) item.packDetails = [];
              items
                .filter((x) => x.packID === item.packID)
                .forEach((p: AllPharmacyDrugInterface) => {
                  item.packDetails.push(p);
                  packList.push(p);
                  totalAmount += p.amount * p.cnt;
                });
              item.totalAmount = totalAmount;
              newItems.push(item);
            } else {
              ignore = true;
            }
          } else {
            if (!ignore) newItems.push(item);
          }
        });
        setUAllPharmacyDrug(newItems);
        setOrgUAllPharmacyDrug(newItems);
      },
      enabled: false,
    }
  );

  const location = useLocation();
  const params = queryString.parse(location.search);

  useEffect(() => {
    setActiveStep(2);
  }, []);

  useEffect(() => {
    uBasketCount.forEach((x) => {
      if (!x.packID) {
        const pharmacyDrug = uAllPharmacyDrug.find((a) => a.id === x.id);
        if (pharmacyDrug) {
          x.cnt = pharmacyDrug.cnt;
        }
      }
    });
  }, [uBasketCount]);

  const cardListGenerator = (): JSX.Element[] | null => {
    if (uAllPharmacyDrug.length > 0) {
      return (
        uAllPharmacyDrug
          // .filter(comparer(basketCount))
          // .sort((a, b) => (a.order > b.order ? 1 : -1))
          .map((item: AllPharmacyDrugInterface, index: number) => {
            // Object.assign(item, {
            //   order: index + 1,
            //   buttonName: 'افزودن به تبادل',
            //   cardColor: item.cardColor,
            // });

            if (uBasketCount.findIndex((x) => x.id == item.id) !== -1)
              Object.assign(item, {
                order: index + 1,
                buttonName: 'حذف از تبادل',
                cardColor: '#dff4ff',
              });
            else {
              Object.assign(item, {
                order: index + 1,
                buttonName: 'افزودن به تبادل',
                cardColor: 'white',
              });
            }

            debugger;
            return (
              <Grid item xs={12} sm={12} xl={12} key={index}>
                <div className={paper}>
                  {item.packID ? (
                    <NewCardContainer
                      basicDetail={
                        <NewExCardContent
                          formType={1}
                          pharmacyDrug={item}
                          isPack={true}
                        />
                      }
                      isPack={true}
                      pharmacyDrug={Object.assign(item, {
                        currentCnt: item.cnt,
                      })}
                      collapsableContent={
                        <NewExCardContent
                          formType={3}
                          packInfo={item.packDetails}
                          isPack={true}
                        />
                      }
                    />
                  ) : (
                    <NewCardContainer
                      basicDetail={
                        <NewExCardContent
                          formType={2}
                          pharmacyDrug={item}
                          isPack={false}
                        />
                      }
                      isPack={false}
                      pharmacyDrug={Object.assign(item, {
                        currentCnt: item.currentCnt
                          ? item.currentCnt
                          : item.cnt,
                      })}
                    />
                  )}
                </div>
              </Grid>
            );
          })
      );
    }

    return null;
  };

  const handleClose = (): any => {
    setOpenDialog(false);
  };

  const handleAgree = (): any => {
    setActiveStep(activeStep + 1);
  };

  const ConfirmDialog = (): JSX.Element => {
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>{'انتخاب دارو از سبد خود'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              آیا تمایل دارید از لیست داروهای خود ، اقلامی را انتخاب نمایید؟
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MatButton autoFocus onClick={handleClose} color="primary">
              خیر
            </MatButton>
            <MatButton onClick={handleAgree} color="primary" autoFocus>
              بلی
            </MatButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid container item spacing={1} xs={12}>
          <Grid item xs={12} md={12}>
            <Grid container item spacing={1} xs={12} className={stickyToolbox}>
              <Grid item xs={12} sm={7} md={7} style={{ padding: 0 }}>
                <SearchInAList />
              </Grid>
            </Grid>
            {(!viewExhcnage ||
              (viewExhcnage &&
                !viewExhcnage.lockSuggestion &&
                (viewExhcnage.state === 1 ||
                  viewExhcnage.state === 2 ||
                  viewExhcnage.state === 12))) && (
                <Grid
                  item
                  xs={12}
                  md={12}
                  style={{ marginTop: -7, marginRight: 5, paddingBottom: 10 }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isSelected}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="انتخاب دارو از سبد عرضه خود"
                  />
                </Grid>
              )}
            {isLoading && <CircleLoading />}
            <Grid container spacing={1}>
              <>
                {/* {basketCardListGenerator()} */}
                {cardListGenerator()}
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ConfirmDialog />
    </>
  );
};

export default Tab2;