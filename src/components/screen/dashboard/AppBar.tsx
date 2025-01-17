import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Toolbar,
  AppBar as MUIAppBar,
  makeStyles,
  IconButton,
  Typography,
  Hidden,
  Tooltip,
  Badge,
} from '@material-ui/core';
import clsx from 'clsx';
import Ribbon from '../../public/ribbon/Ribbon';
import { ColorEnum } from '../../../enum';
import SvgIcon from '../../public/picture/svgIcon';
import Context from './Context';
import routes from '../../../routes';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { Message } from '../../../services/api';
import Utils from '../../public/utility/Utils';
import NotificationMenu from './appbar/NotificationMenu';
import UserMenu from './appbar/UserMenu';
import { connect, ConnectedProps } from 'react-redux';
import { confirmSweetAlert, JwtData, sweetAlert } from '../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell, faPlusSquare, faBars } from '@fortawesome/free-solid-svg-icons';

const drawerWidth = 240;
const { getUserMessages } = new Message();

const isTrial = true;
const { userData } = new JwtData();
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  alert: {
    width: '100%',
    marginTop: 5,
    textAlign: 'center',
  },
  toolbar: {
    paddingRight: 24,
  },
  trialToolbar: {
    paddingRight: 70,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerBackground: {
    background: '#F6F6F6',
  },
  daroogLogo: {
    width: '77% !important',
    height: '35px !important',
  },
  headerHolder: {
    width: '100%',
    padding: '16px',
  },
  logoType: {
    height: '30px',
  },
  systemTitle: {
    textAlign: 'right',
    display: 'block',
    fontSize: 'large',
    width: '100%',
    color: '#4625B2',
  },
  logoTypeHolder: {
    width: '60%',
    float: 'left',
  },
  roundicon: {
    background: 'white',
    float: 'right',
  },
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    zIndex: 1040,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#4625B2',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    // color:
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  userContainer: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(3),
    },
  },
  largeSpacing: {
    padding: theme.spacing(2),
  },
  divider: {
    backgroundColor: '#9585C9',
    height: '1px',
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  largeAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paleText: {
    color: ColorEnum.PaleGray,
  },
}));

interface AppBarProps {
  showButtons?: boolean;
}

const mapStateToProps = (state: any) => ({
  transfer: state.transfer,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const AppBar: React.FC<AppBarProps & PropsFromRedux> = ({ showButtons = true, transfer: _transfer }) => {
  const {
    setIsOpenDrawer,
    isOpenDrawer,
    setcreditAnchorEl,
    debtValueState,
    setAnchorEl,
    setNotifEl,
    setActiveStep,
    genericMessages,
  } = useContext(Context);

  const { push } = useHistory();

  const { t } = useTranslation();
  const { transfer, dashboard } = routes;

  const { trialToolbar, toolbar, appBar, menuButton, menuButtonHidden, title } = useStyles();
  const handleDrawerOpen = (): void => setIsOpenDrawer(true);

  const handleUserIconButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleNotificationIconButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setNotifEl(e.currentTarget);
  };

  const newTransferHandler = async (): Promise<void> => {
    if (_transfer.isStarted) {
      const res = await confirmSweetAlert(
        'روند تبادل فعلی را حذف و دوباره شروع میکنید؟'
      )

      if (!res) {
        return;
      }
      window.location.reload();
    }
    push(transfer + '?step=0');
  };

  const [version, setVersion] = useState('');
  useEffect(() => {
    setVersion(localStorage.getItem('version') ?? '');
  }, []);

  return (
    <MUIAppBar elevation={0} position="absolute" className={appBar}>
      <Toolbar className={isTrial ? trialToolbar : toolbar}>
        {isTrial && (
          <div style={{ zIndex: 0, overflow: 'hidden' }}>
            <Ribbon text="نسخه آزمایشی" isExchange={false} isToolbar={true} />
          </div>
        )}
        {showButtons && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(menuButton, isOpenDrawer && menuButtonHidden)}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        )}

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={title}
          onClick={(e: any): void => {
            push(dashboard);
          }}
        >
          <Hidden xsDown>
            {/* {t('general.dashboard')} */}
            <span>{t('general.daroog')}</span>
            <span style={{ fontSize: 14, marginRight: 5 }}>
              {`( ${t('general.systemTitle')} )`}
              <span style={{ fontSize: 14, marginRight: 8 }}>{t('general.daroogLatin')}</span>
            </span>
          </Hidden>
          {version && (
            <span className="version-small">
              {t('general.version')} &nbsp;
              {version}
            </span>
          )}
        </Typography>
        {userData.pharmacyName != null && (
          <Fragment>
            <Tooltip
              style={{
                background: '#95D061',
                borderRadius: '30px',
                padding: '0px 4px 0px 24px',
              }}
              title={String(t('exchange.create'))}
            >
              <div>
                <span>
                  <IconButton
                    edge="end"
                    style={{ color: ColorEnum.White }}
                    onClick={newTransferHandler}
                  >
                    <FontAwesomeIcon size="xs" icon={faPlusSquare} />
                    <Hidden smDown>
                      <span style={{ fontSize: 14, paddingRight: 6 }}>
                        {t('exchange.create', {
                          var: _transfer.isStarted ? t('general.again.0') : '',
                        })}
                      </span>
                    </Hidden>
                  </IconButton>
                </span>
                <span></span>
              </div>
            </Tooltip>

            <Tooltip title="کیف پول">
              <IconButton
                edge="end"
                onClick={(e: any): void => setcreditAnchorEl(e.currentTarget)}
                style={{
                  color: `${
                    !debtValueState ? 'white' : debtValueState >= 0 ? '#f95e5e' : '#72fd72'
                  }`,
                }}
              >
                <CreditCardIcon />
                {debtValueState && (
                  <Hidden smDown>
                    <span style={{ fontSize: 14 }}>
                      {' '}
                      <b>{Utils.numberWithCommas(Math.abs(debtValueState))}</b>
                      <span style={{ fontSize: 10, marginRight: 2 }}>
                        {t('general.defaultCurrency')}
                      </span>
                    </span>
                  </Hidden>
                )}
              </IconButton>
            </Tooltip>
          </Fragment>
        )}
        {showButtons && (
          <>
            {genericMessages.length > 0 && (
              <Tooltip title={String(t('general.notifications'))}>
                <IconButton edge="end" color="inherit" onClick={handleNotificationIconButton}>
                  <Badge badgeContent={genericMessages.length} color="secondary">
                    <FontAwesomeIcon icon={faBell} />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserIconButton}
              color="inherit"
            >
              <FontAwesomeIcon icon={faUserCircle} />
            </IconButton>
          </>
        )}

        <UserMenu />

        <NotificationMenu messages={genericMessages} />
        
      </Toolbar>
    </MUIAppBar>
  );
};

export default connector(AppBar);
