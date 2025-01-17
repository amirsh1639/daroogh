import React, { useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import {
  createStyles,
  Divider,
  Grid,
  Input as SelectInput,
  FormControl,
  Select,
  Checkbox,
  ListItemText,
  MenuItem,
  Container,
  Hidden,
  DialogContent,
  DialogTitle,
  DialogContentText,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Switch,
  Fab,
  Paper,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import Input from '../../../public/input/Input';
import { makeStyles } from '@material-ui/core/styles';
import {
  ActionInterface,
  DataTableCustomActionInterface,
  TableColumnInterface,
} from 'interfaces';
import { RoleType, TextMessage } from 'enum';
import {
  errorHandler,
  tSuccess,
  tError,
  confirmSweetAlert,
} from 'utils';
import { useTranslation } from 'react-i18next';
import { InitialNewUserInterface, NewUserData } from '../../../../interfaces/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '../../../public/datepicker/DatePicker';
import Modal from '../../../public/modal/Modal';
import { PharmacyUsersEnum, RoleQueryEnum, UserQueryEnum } from '../../../../enum/query';
import DataTable from '../../../public/datatable/DataTable';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { NewPharmacyUserData } from '../../../../model';
import { Role, User } from 'services/api';
import RoleForm from '../user/RoleForm';
import CardContainer from './user/CardContainer';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import { debounce } from 'lodash';
import CDialog from 'components/public/dialog/Dialog';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: 500,
      width: '100%',
      maxWidth: 1000,
      '& > .MuiCardContent-root': {
        padding: 0,
      },
      '& > .MuiCardHeader-root': {
        padding: '10px 10px 2px 10px',
      },
      '& > .MuiCardHeader-content': {
        marginTop: '-10px !important',
        color: 'red',
      },
    },
    gridEditForm: {
      margin: theme.spacing(2, 0, 2),
    },
    formContent: {
      overflow: 'hidden',
      overflowY: 'auto',
      display: 'flex',
    },
    cancelButton: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    submitBtn: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    checkIcon: {
      color: theme.palette.success.main,
    },
    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
    },
    titleContainer: {
      padding: theme.spacing(2),
    },
    formTitle: {
      margin: 0,
    },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    box: {
      '& > .MuiFormControl-root': {
        flexGrow: 1,
      },
    },
    userRoleIcon: {
      color: '#7036e7',
    },
    createUserBtn: {
      background: `${theme.palette.pinkLinearGradient.main} !important`,
      color: '#fff',
      float: 'left',
    },
    buttonContainer: {
      marginBottom: theme.spacing(2),
      alignItems: 'left',
    },

    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
      zIndex: 1,
    },

    searchIconButton: {
      display: 'none',
    },
    blankCard: {
      minHeight: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    contentContainer: {
      marginTop: 15,
    },
  })
);

const initialState: NewPharmacyUserData = {
  id: 0,
  name: '',
  family: '',
  mobile: '',
  email: '',
  userName: '',
  nationalCode: '',
  birthDate: '',
  smsActive: false,
  notifActive: false,
  gender: 0,
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
    case 'name':
      return {
        ...state,
        name: value,
      };
    case 'family':
      return {
        ...state,
        family: value,
      };
    case 'mobile':
      return {
        ...state,
        mobile: value,
      };

    case 'email':
      return {
        ...state,
        email: value,
      };
    case 'userName':
      return {
        ...state,
        userName: value,
      };
    case 'nationalCode':
      return {
        ...state,
        nationalCode: value,
      };
    case 'birthDate':
      return {
        ...state,
        birthDate: value,
      };
    case 'smsActive':
      return {
        ...state,
        smsActive: value,
      };
    case 'notifActive':
      return {
        ...state,
        notifActive: value,
      };
    case 'gender':
      return {
        ...state,
        gender: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const UsersList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [isOpenRoleModal, setIsOpenRoleModal] = useState<boolean>(false);
  const [idOfSelectedUser, setIdOfSelectedUser] = useState<number>(0);
  const [isOpenModalOfCreateUser, setIsOpenModalOfCreateUser] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const fullScreen =  true
  
  const toggleIsOpenModalOfUser = (): void => setIsOpenModalOfCreateUser((v) => !v);
  const toggleIsOpenRoleModal = (): void => setIsOpenRoleModal((v) => !v);
  
  const { getCurrentPharmacyUsers, addPharmacyUser } = new User();
  const { getAllRoles, removeUserRoles } = new Role();

  const { isLoading: roleListLoading, data: roleListData } = useQuery(
    RoleQueryEnum.GET_ALL_ROLES,
    () => getAllRoles(RoleType.PHARMACY)
  );

  const queryCache = useQueryCache();
  const resetListRef = () => {
    listRef.current = [];
    setList([]);
    setPageRef(0);
    setNoDataRef(false);
    getList();
  };

  const [_addPharmacyUser, { isLoading: isLoadingNewUser }] = useMutation(addPharmacyUser, {
    onSuccess: async (data) => {
      const { message } = data;
      if (showError) {
        setShowError(false);
      }
      dispatch({ type: 'reset' });
      toggleIsOpenModalOfUser();
      ref.current?.onQueryChange();
      tSuccess(message || t('alert.successfulCreateTextMessage'));
      resetListRef();
    },
    onError: async (data: any) => {
      tError(data || t('error.save'));
    },
  });

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);

  const {
    formContent,
    userRoleIcon,
    fab,
    blankCard,
    contentContainer,
  } = useClasses();

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const inputValuesValidation = (): boolean => {
    const { name, family, mobile, email, userName, nationalCode } = state;

    return (
      name.trim().length < 2 ||
      userName.trim().length < 1 ||
      family.trim().length < 2 ||
      mobile.trim().length < 11 ||
      (email !== '' && !emailRegex.test(email.toLowerCase())) ||
      (nationalCode !== '' && nationalCode.length !== 10)
    );
  };

  const formHandler = async (): Promise<any> => {
    if (inputValuesValidation()) {
      setShowError(true);
      return;
    }
    if (selectedRoles.length == 0) {
      tError('لطفا حداقل یک نقش را انتخاب نمایید.');
      return;
    }
    const data: any = {
      id: state.id,
      name: state.name,
      family: state.family,
      mobile: state.mobile,
      email: state.email,
      userName: state.userName,
      nationalCode: state.nationalCode,
      birthDate: state.birthDate,
      roleUser: selectedRoles.map((item) => ({ roleID: item })),
      smsActive: state.smsActive,
      notifActive: state.notifActive,
      gender: state.gender,
    };

    await _addPharmacyUser(data);
  };

  const editRoleHandler = (item: any): void => {
    const { id } = item;
    setIdOfSelectedUser(id);
    toggleIsOpenRoleModal();
  };

  const [_remove, { isLoading: isLoadingRemove }] = useMutation(removeUserRoles, {
    onSuccess: async (result) => {
      ref.current?.onQueryChange();

      resetListRef();
      tSuccess(result.message);
    },
  });

  const removeAllRoles = async (row: any): Promise<any> => {
    const confirmed = await confirmSweetAlert('آیا از حدف همه نقش های کاربر مطمدن هستید؟')
    if (confirmed) {
      try {
        await _remove(row.id);
        ref.current?.onQueryChange();
      } catch (e) {
        errorHandler(e);
      }
    }
  };

  const rolesListGenerator = (): any => {
    if (roleListData !== undefined && !roleListLoading) {
      return (
        roleListData.items
          // filter role of 'all-users' from array
          .filter((item: any) => item.id !== 1)
          .map((item: { id: number; name: string }) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={selectedRoles.indexOf(item.id) !== -1} />
                <ListItemText primary={item.name} />
              </MenuItem>
            );
          })
      );
    }

    return <MenuItem />;
  };

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>): Promise<any> => {
    setSelectedRoles(event.target.value as number[]);
  }

  const contentGenerator = (): any[] | null => {
    if (!isLoading && list !== undefined && isFetched) {
      return React.Children.toArray(
        listRef.current.map((item: any) => {
          return (
            <Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ item.id }>
              <CardContainer
                data={ item }
                editRoleHandler={ editRoleHandler }
                removeRolesHandler={ removeAllRoles }
              />
            </Grid>
          )
        })
      );
    }

    return null;
  }

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
  const { isLoading, data, isFetched } = useQuery(
    UserQueryEnum.GET_ALL_USERS,
    () => getCurrentPharmacyUsers(pageRef.current, 10, [], searchRef.current),
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

  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };

  async function getList(refresh: boolean = false): Promise<any> {
    const result = await getCurrentPharmacyUsers(pageRef.current, 10, [], searchRef.current);
    if (result == undefined || result.items.length == 0) {
      setNoDataRef(true);
    }
    if (result != undefined) {
      setListRef(result.items, refresh);
      return result;
    }
  }
  const [noData, setNoData] = useState<boolean>(false);
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
      getList();
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
  return (
    <Container maxWidth="lg">
      <h1 className="txt-md">{t('user.users-list')}</h1>

      <br />

      <Grid container spacing={3} className={contentContainer}>
        <Hidden xsDown>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={blankCard} onClick={toggleIsOpenModalOfUser}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('user.create-user')}</span>
            </Paper>
          </Grid>
        </Hidden>

        <Hidden smUp>
          <Fab onClick={toggleIsOpenModalOfUser} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>
        {true && contentGenerator()}
        {true && <CircleBackdropLoading isOpen={isLoading} />}
      </Grid>

      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenRoleModal}
        onClose={(): void => setIsOpenRoleModal(false)}
        onOpen={(): void => setIsOpenRoleModal(true)}
        fullWidth
        hideSubmit={true}
      >
        <DialogTitle className="text-sm">{t('user.edit-role')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <RoleForm
                      userId={idOfSelectedUser}
                      toggleForm={toggleIsOpenRoleModal}
                      roleType={RoleType.PHARMACY}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </CDialog>
      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenModalOfCreateUser}
        onClose={(): void => setIsOpenModalOfCreateUser(false)}
        onOpenAltenate={(): void => setIsOpenModalOfCreateUser(true)}
        modalAlt={true}
        formHandler={formHandler}
        fullWidth
      >
        <DialogTitle className="text-sm">
          {state?.id === 0 ? t('action.create') : t('action.edit')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام کاربر</label>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      error={state.name.trim().length < 2 && showError}
                      label="نام کاربر"
                      className="w-100"
                      value={state.name}
                      onChange={(e): void => dispatch({ type: 'name', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام خانوادگی کاربر</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      className="w-100"
                      error={state.family.trim().length < 2 && showError}
                      value={state.family}
                      onChange={(e): void => dispatch({ type: 'family', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>موبایل</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      className="w-100"
                      error={state.mobile.trim().length < 11 && showError}
                      type="number"
                      value={state.mobile}
                      onChange={(e): void => dispatch({ type: 'mobile', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>ایمیل</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      error={state?.email?.length > 0 && !emailRegex.test(state.email) && showError}
                      className="w-100"
                      type="email"
                      value={state.email}
                      onChange={(e): void => dispatch({ type: 'email', value: e.target.value })}
                    ></Input>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نام کاربری</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      error={state?.userName?.length < 1 && showError}
                      className="w-100"
                      value={state.userName}
                      onChange={(e): void => dispatch({ type: 'userName', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>کد ملی</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      error={
                        state?.nationalCode !== '' && state?.nationalCode?.length < 10 && showError
                      }
                      className="w-100"
                      type="text"
                      value={state.nationalCode}
                      onChange={(e): void =>
                        dispatch({
                          type: 'nationalCode',
                          value: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>تاریخ تولد</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      readOnly={true}
                      className="w-100"
                      type="text"
                      value={state?.birthDate}
                      onClick={toggleIsOpenDatePicker}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label>نقش های کاربر:</label>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl size="small" className="w-100" variant="outlined">
                      <Select
                        labelId="user-roles-list"
                        id="roles-list"
                        multiple
                        input={<SelectInput />}
                        label="نقش های کاربر:"
                        MenuProps={MenuProps}
                        value={selectedRoles}
                        onChange={handleChange}
                        renderValue={(selected: any): string => {
                          const items = roleListData?.items
                            .filter((item: any) => selected.indexOf(item.id) !== -1)
                            .map((item: any) => item.name);

                          return ((items as string[]) ?? []).join(', ');
                        }}
                      >
                        {rolesListGenerator()}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.smsActive}
                      onChange={(e): void =>
                        dispatch({
                          type: 'smsActive',
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t('user.smsActive')}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.notifActive}
                      onChange={(e): void =>
                        dispatch({
                          type: 'notifActive',
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t('user.notifActive')}
                />
              </Grid>
            </Grid>
            <Grid xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">{t('general.gender')}</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={state.gender}
                  onChange={(e: any): void => dispatch({ type: 'gender', value: e.target.value })}
                >
                  <FormControlLabel
                    value="0"
                    checked={state.gender == 0}
                    control={<Radio />}
                    label={t('GenderType.Male')}
                  />
                  <FormControlLabel
                    value="1"
                    checked={state.gender == 1}
                    control={<Radio />}
                    label={t('GenderType.Female')}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Divider />
      </CDialog>
      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker} zIndex={2000}>
        <DateTimePicker
          selectedDateHandler={(e): void => {
            dispatch({ type: 'birthDate', value: e });
            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </Container>
  );
};

export default UsersList;
