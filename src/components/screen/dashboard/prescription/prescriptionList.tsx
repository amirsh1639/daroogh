import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { Prescription } from '../../../../services/api';
import CircleLoading from '../../../public/loading/CircleLoading';
import CardContainer from './CardContainer';
import { useClasses } from '../classes';
import { errorHandler, isNullOrEmpty, JwtData, tSuccess, tWarn, today } from 'utils';
import {
  ActionInterface,
  PrescriptionInterface,
  PrescriptionResponseInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { ColorEnum, PrescriptionEnum, PrescriptionResponseStateEnum } from '../../../../enum';
import {
  Container,
  createStyles,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Picture, PictureDialog } from '../../../public';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import { debounce } from 'lodash';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import CDialog from 'components/public/dialog/Dialog';
import { getBaseUrl } from 'config'

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    formItem: {
      display: 'flex',
      justifySelf: 'stretch',
      margin: theme.spacing(1),
    },
    smallImage: {
      maxWidth: '300px',
      maxHeight: '300px',
    },
    searchBar: {
      margin: '0 10px',
    },
    searchIconButton: {
      display: 'none',
    },

    contentContainer: {
      marginTop: 15,
    },
    detailsContainer: {
      border: `1px double ${ColorEnum.Borders}`,
      padding: 16,
      minHeight: 60,
      borderRadius: 5,
      margin: 8,
    },
    callButton: {
      fontSize: '11px',
      color: 'green',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      padding: '5px 15px',
      borderRadius: '4px',
      textDecoration: 'none',
      marginRight: '8px',
    },
    rootContainer: {},
  })
);

const initialStatePrescriptionResponse: PrescriptionResponseInterface = {
  prescriptionID: 0,
  isAccept: false,
  pharmacyComment: '',
  state: 3,
};

function reducer(state = initialStatePrescriptionResponse, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'prescriptionID':
      return {
        ...state,
        prescriptionID: value,
      };
    case 'isAccept':
      return {
        ...state,
        isAccept: value,
      };
    case 'pharmacyComment':
      return {
        ...state,
        pharmacyComment: value,
      };
    case 'state':
      return {
        ...state,
        state: value,
      };
    case 'comment':
      return {
        ...state,
        comment: value,
      };
    case 'fileKey':
      return {
        ...state,
        fileKey: value,
      };
    case 'reset':
      return initialStatePrescriptionResponse;
    default:
      console.error('Action type note defined');
      break;
  }
}

const PrescriptionList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialStatePrescriptionResponse);
  const { container } = useClasses();
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);
  const [isOpenPicture, setIsOpenPicture] = useState(false);
  const [fileKeyToShow, setFileKeyToShow] = useState('');
  const [currentItem, setCurrentItem] = useState<any>();
  const {
    root,
    smallImage,
    formItem,
    searchBar,
    searchIconButton,
    contentContainer,
    detailsContainer,
    rootContainer,
    callButton,
  } = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const fullScreen = true;
  const queryCache = useQueryCache();
  const { getList, save, urls } = new Prescription();
  const [_save, { isLoading }] = useMutation(save, {
    onSuccess: async () => {
      tSuccess(t('alert.successfulSave'));
      await getCardList(true);
      // await queryCache.invalidateQueries(PrescriptionEnum.GET_LIST);
      // ref.current?.onQueryChange();
      // dispatch({ type: 'reset' });
    },
  });

  const jwtData = new JwtData();
  const pharmacyName = jwtData.userData.pharmacyName;

  const pictureDialog = (fileKey: string): JSX.Element => {
    return (
      <PictureDialog
        fileKey={fileKey}
        title={t('prescription.peoplePrescription')}
        onClose={(): void => setIsOpenPicture(false)}
      />
    );
  };

  // const tableColumns = (): DataTableColumns[] => {
  //   return [
  //     {
  //       field: 'sendDate',
  //       title: t('prescription.sendDate'),
  //       type: 'string',

  //       render: (row: any): any => {
  //         return <>{getJalaliDate(row.sendDate)}</>;
  //       },
  //     },
  //     {
  //       field: 'contryDivisionName',
  //       title: t('countryDivision.city'),
  //       type: 'string',
  //     },
  //     {
  //       field: 'comment',
  //       title: t('general.comment'),
  //       type: 'string',
  //       searchable: true,
  //     },
  //     {
  //       field: 'expireDate',
  //       title: t('general.expireDate'),
  //       type: 'string',

  //       render: (row: any): any => {
  //         return <>{!isNullOrEmpty(row.expireDate) && getJalaliDate(row.expireDate)}</>;
  //       },
  //     },
  //     {
  //       field: 'fileKey',
  //       title: t('general.picture'),
  //       type: 'string',
  //       render: (row: any): any => {
  //         return (
  //           <>
  //             {!isNullOrEmpty(row.fileKey) && (
  //               <Button
  //                 onClick={(): any => {
  //                   setFileKeyToShow(row.fileKey);
  //                   setIsOpenPicture(true);
  //                 }}
  //               >
  //                 <FontAwesomeIcon icon={faImage} />
  //               </Button>
  //             )}
  //           </>
  //         );
  //       },
  //     },
  //     {
  //       field: 'responseDate',
  //       title: t('prescription.responseDate'),
  //       type: 'string',

  //       render: (row: any): any => {
  //         return (
  //           <>
  //             {!isNullOrEmpty(row.prescriptionResponse) &&
  //               !isNullOrEmpty(row.prescriptionResponse[0].responseDate) &&
  //               getJalaliDate(row.prescriptionResponse[0].responseDate)}
  //           </>
  //         );
  //       },
  //     },
  //     {
  //       field: 'prescriptionResponse.state',
  //       title: t('general.state'),
  //       type: 'string',
  //       render: (row: any): any => {
  //         const responses = row.prescriptionResponse.filter((i: any) => {
  //           return i.pharmacy.name === pharmacyName;
  //         });
  //         const thisState =
  //           PrescriptionResponseStateEnum[responses.length > 0 ? responses[0].state : 5];
  //         return (
  //           <span
  //             style={{
  //               color:
  //                 thisState == PrescriptionResponseStateEnum[PrescriptionResponseStateEnum.Accept]
  //                   ? ColorEnum.Green
  //                   : ColorEnum.Gray,
  //             }}
  //           >
  //             {!isNullOrEmpty(row.prescriptionResponse) &&
  //               t(`PrescriptionResponseStateEnum.${thisState}`)}
  //           </span>
  //         );
  //       },
  //     },
  //   ];
  // };

  const saveHandler = (item: PrescriptionInterface): void => {
    if (
      (item.cancelDate === null || item.cancelDate === undefined) &&
      item.expireDate >= today('-')
    ) {
      toggleIsOpenSaveModalForm();
      const { id, prescriptionResponse } = item;
      let pharmacyComment: string = '';
      let accept: boolean = false;
      let thisState: number = PrescriptionResponseStateEnum.Waiting;
      let responses: any;
      if (prescriptionResponse.length > 0) {
        responses = prescriptionResponse.filter((i: any) => {
          return i.pharmacy.name === pharmacyName;
        });
        if (responses.length > 0) {
          pharmacyComment = responses[0].pharmacyComment;
          accept = responses[0].state == PrescriptionResponseStateEnum.Accept;
          thisState = responses[0].state;
        }
      }
      setCurrentItem({
        ...item,
        prescriptionResponse: responses,
        state: thisState,
      });
      dispatch({ type: 'prescriptionID', value: id });
      dispatch({ type: 'isAccept', value: accept });
      dispatch({ type: 'pharmacyComment', value: pharmacyComment });
      dispatch({ type: 'state', value: thisState });
      dispatch({ type: 'comment', value: item.comment });
      dispatch({ type: 'fileKey', value: item.fileKey });
    } else {
      tWarn(t('prescription.cantEdit'));
    }
  };

  const detailHandler = (row: any): void => {
    setFileKeyToShow(row.fileKey);
    setIsOpenPicture(true);
  };

  const submitSave = async (el?: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el?.preventDefault();

    const { prescriptionID, isAccept, pharmacyComment } = state;

    try {
      toggleIsOpenSaveModalForm();
      await _save({
        prescriptionID,
        isAccept,
        pharmacyComment: isAccept ? pharmacyComment : '',
        state,
      });
      // dispatch({ type: 'reset' });
    } catch (e) {
      errorHandler(e);
    }
  };

  const [list, setList] = useState<any>([]);
  const listRef = React.useRef(list);

  const setListRef = (data: any, refresh: boolean = false) => {
    if (!refresh) {
      listRef.current = listRef.current.concat(data);
    } else {
      listRef.current = data;
    }
    setList(data);
  };
  const [search, setSearch] = useState<string>('');
  const searchRef = React.useRef(search);

  const setSearchRef = (data: any) => {
    searchRef.current = data;
    setSearch(data);
    getCardList(true);
  };

  const { data, isFetched } = useQuery(
    PrescriptionEnum.GET_LIST,

    () => getList(pageRef.current, 10, [], searchRef.current),
    {
      onSuccess: (result) => {
        if (result == undefined || result.count == 0) {
          setNoDataRef(true);
        } else {
          setListRef(result.items);
        }
      },
    }
  );
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  async function getCardList(refresh: boolean = false): Promise<any> {
    const result = await getList(pageRef.current, 10, [], searchRef.current);
    if (result == undefined || result.items.length == 0) {
      setNoDataRef(true);
    }
    if (result != undefined) {
      setListRef(result.items, refresh);
      return result;
    }
  }

  const noDataRef = React.useRef(noData);
  const setNoDataRef = (data: boolean) => {
    noDataRef.current = data;
    setNoData(data);
  };
  const screenWidth = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    tablet: 640,
    laptop: 1024,
    desktop: 1280,
  };
  const handleScroll = (e: any): any => {
    const el = e.target;
    const pixelsBeforeEnd = 200;
    const checkDevice =
      window.innerWidth <= screenWidth.sm
        ? el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight
        : el.scrollTop + el.clientHeight === el.scrollHeight;
    if (!noDataRef.current && checkDevice) {
      const currentpage = pageRef.current + 1;
      setPageRef(currentpage);
      getCardList();
    }
  };
  React.useEffect(() => {
    document.addEventListener('scroll', debounce(handleScroll, 100), {
      capture: true,
    });
    return (): void => {
      document.removeEventListener('scroll', debounce(handleScroll, 100), {
        capture: true,
      });
    };
  }, []);
  const contentGenerator = (): JSX.Element[] => {
    if (!isLoading && list !== undefined && isFetched) {
      return listRef.current.map((item: any) => {
        //const { user } = item;
        //if (user !== null) {
        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={item.id}
            style={{
              border: `${
                item.prescriptionResponse === null ? '1px solid #ccc' : '0px solid #ff123'
              }`,
            }}
          >
            <CardContainer data={item} saveHandler={saveHandler} detailHandler={detailHandler} />
          </Grid>
        );
        //}
      });
    }

    return [];
  };
  const editModal = (): JSX.Element => {
    return (
      <CDialog
        fullScreen={fullScreen}
        fullWidth
        isOpen={isOpenEditModal}
        onClose={(): void => setIsOpenSaveModal(false)}
        onOpen={(): void => setIsOpenSaveModal(true)}
        formHandler={submitSave}
        hideSubmit={currentItem.state !== PrescriptionResponseStateEnum.Waiting}
      >
        <DialogTitle>
          {state.pharmacyComment === '' ? t('prescription.response') : 'جزئیات'}
        </DialogTitle>
        <Divider />
        <DialogContent className={root}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                {!isNullOrEmpty(state.comment) && (
                  <Grid item xs={12} className={detailsContainer}>
                    <TextWithTitle title={t('prescription.comment')} body={state.comment} />
                  </Grid>
                )}

                {!isNullOrEmpty(state.fileKey) && (
                  <>
                    <Grid item xs={12} className={detailsContainer}>
                      <Grid item xs={12}>
                        <Picture fileKey={state.fileKey} className={smallImage} />
                      </Grid>
                      <Grid item xs={12}>
                        <a
                          className={callButton}
                          onClick={(e: any): any => {
                            e.stopPropagation();
                          }}
                          download=""
                          href={getBaseUrl() + '/File/GetFile?key=' + state.fileKey}
                        >
                          دانلود نسخه
                        </a>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            {currentItem.state !== PrescriptionResponseStateEnum.Waiting &&
              !(state.pharmacyComment === '' || state.pharmacyComment === null) && (
                <Grid xs={12} item className={detailsContainer}>
                  <TextWithTitle title="پاسخ شما" body={state.pharmacyComment} />
                </Grid>
              )}
            {currentItem.state === PrescriptionResponseStateEnum.Waiting && (
              <>
                <Grid xs={12} item style={{ margin: 4 }}>
                  <Divider />
                </Grid>
                <Grid xs={12} item>
                  <span>
                    در صورت تمایل نسخه را قبول نمایید. با قبول نسخه پیامکی برای بیمار ارسال میشود که
                    شامل آدرس و مشخصات دارو خانه شماست.
                  </span>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.isAccept}
                        onChange={(e): void => {
                          dispatch({ type: 'isAccept', value: e.target.checked });
                          dispatch({
                            type: 'state',
                            value: e.target.checked
                              ? PrescriptionResponseStateEnum.Accept
                              : PrescriptionResponseStateEnum.NotAccept,
                          });
                        }}
                      />
                    }
                    label="نسخه را میپذیرم"
                  />
                </Grid>
                <Grid item xs={12}>
                  {state.isAccept && (
                    <TextField
                      variant="outlined"
                      value={state.pharmacyComment}
                      label={t('general.comment')}
                      required
                      placeholder="توضیحات لازم را درج نمایید"
                      multiline
                      style={{ whiteSpace: 'pre-line' }}
                      rows="3"
                      className={formItem}
                      onChange={(e): void =>
                        dispatch({ type: 'pharmacyComment', value: e.target.value })
                      }
                    />
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <Divider />
      </CDialog>
    );
  };

  return (
    <Container maxWidth="lg" className={container}>
      <h1 className="txt-md">{t('prescription.peoplePrescriptions')}</h1>
      {/* false && (
        <DataTable
          tableRef={ref}
          columns={tableColumns()}
          editAction={(e: any, row: any): void => saveHandler(row)}
          queryKey={PrescriptionEnum.GET_LIST}
          queryCallback={getList}
          urlAddress={urls.getList}
          initLoad={false}
        />
      ) */}
      {/* {true && (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <SearchBar
              classes={{ searchIconButton: searchIconButton }}
              placeholder={t('general.search')}
              onChange={(newValue) => setSearchRef(newValue)}
            />
          </Grid>
        </Grid>
      )} */}
      <Grid container spacing={3} className={contentContainer}>
        {contentGenerator()}
      </Grid>
      {<CircleBackdropLoading isOpen={isLoading} />}
      {isLoading && <CircleLoading />}
      {isOpenEditModal && editModal()}
      {isOpenPicture && pictureDialog(fileKeyToShow)}
    </Container>
  );
};

export default PrescriptionList;
