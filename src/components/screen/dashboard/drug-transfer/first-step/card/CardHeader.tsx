import React, { useEffect, useState } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { CardHeaderInterface } from '../../../../../../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as solidStar,
  faStarHalfAlt,
  faMapMarkerAlt,
  faCalculator,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@material-ui/icons/Person';
import { RolesEnum } from 'enum';
import { confirmSweetAlert, Impersonation, JwtData } from 'utils'
import { Pharmacy, User } from 'services/api'
import routes from 'routes'
import { useHistory } from 'react-router-dom'
import { useStyle } from './style';

const CardHeader: React.FC<CardHeaderInterface> = (props) => {
  const { city, guaranty, province, star, itemsCount, userType, pharmacyKey = '' } = props;
  const [pharmacyTitle, setPharmacyTitle] = useState('')
  const [pharmacyId, setPharmacyId] = useState(0)

  const { roles } = new JwtData();
  let rolesArray = roles();
  if (!Array.isArray(rolesArray)) {
    rolesArray = [rolesArray];
  }
  const [showPharmacyInfo] = useState<boolean>(
    rolesArray?.indexOf(RolesEnum.ADMIN) >= 0
  )

  useEffect(() => {
    if (!showPharmacyInfo) return
    const { detailByKey } = new Pharmacy()
    const getPharmacyData = async (): Promise<any> => {
      const pharmacy = await detailByKey(pharmacyKey)
      setPharmacyTitle(pharmacy.name)
      setPharmacyId(pharmacy.id)
    }
    getPharmacyData()
  }, [showPharmacyInfo])

  const history = useHistory()

  const { impersonate } = new User()
  const impersonateHandler = (event: any, pharmacyId: any): void => {
    async function getNewToken(id: number | string): Promise<any> {
      const result = await impersonate(id)
      const impersonation = new Impersonation()
      impersonation.changeToken(result.data.token, result.data.pharmacyName)
      history.push(routes.supplyList)
    }
    getNewToken(pharmacyId)
  }

  const doImpersonate = async (): Promise<any> =>{
    const confirmImpersonate = await confirmSweetAlert(
      t('alert.impersonate'), {
        title: t('pharmacy.pharmacy') + ' ' + pharmacyTitle
      }
    )
    if (!confirmImpersonate) return
    impersonateHandler(null, pharmacyId)
  }

  const {
    userLevelContainer,
    starIcon,
    headerBack,
    logoType,
    pharmacyName,
  } = useStyle();

  const { t } = useTranslation();

  const handleUserType = (userType: number): any => {
    const getUserLevel =
      userType === 1
        ? t('user.goldUser')
        : userType === 2
        ? t('user.silverUser')
        : userType === 3
        ? t('user.boronzeUser')
        : t('user.platiniumUser');

    const getUserType =
      userType === 1
        ? 'gold'
        : userType === 2
        ? 'silver'
        : userType === 3
        ? 'boronze'
        : 'platinium';

    return (
      <div className={userLevelContainer}>
        <span className={`${getUserType}`}>
          <PersonIcon />
        </span>
        <span className="txt-xs">{getUserLevel}</span>
      </div>
    );
  };

  const stars = (_star: number): any => {
    let star = Math.floor(_star * 10) / 10;
    let flooredStar = Math.floor(star);
    let decimal = (star * 10) % 10;
    /*
    x < 4.3 => 4
    4.3 <= x < 4.7 => 4.5
    x > 4.7 => 5
    */
    decimal = decimal > 7 ? 1 : decimal >= 3 ? 0.5 : 0;
    star = flooredStar + decimal;
    if (decimal === 1) {
      flooredStar++;
    }

    const starsArray: JSX.Element[] = [];
    for (let i = 0; i < flooredStar; i++) {
      starsArray.push(
        <FontAwesomeIcon icon={solidStar} size="sm" className={starIcon} />
      );
    }
    if (decimal === 0.5) {
      starsArray.push(
        <FontAwesomeIcon icon={faStarHalfAlt} size="sm" className={starIcon} />
      );
      flooredStar++;
    }
    for (let i = flooredStar; i < 5; i++) {
      starsArray.push(
        <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
      );
    }
    return starsArray;
  };

  return (
    <Grid container className={headerBack} spacing={1}>
      <Hidden xsDown >
      <Grid container xs={2} alignItems="center" justify="center">
        <img className={logoType} src="pharmacy.png" />
      </Grid>
      </Hidden>

      <Grid item xs={7} lg={6} md={6}>
        <Grid item xs={12}>
          <span>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size="1x"
              style={{ marginLeft: '6px' }}
            />
          </span>
          <Hidden xsDown ><span className="txt-xs ">محل داروخانه: </span></Hidden>
          <span className={` ${pharmacyName} `}>{`${province} ${city}`}</span>

          {showPharmacyInfo && (
            <span onClick={() => doImpersonate()}>{'    '}
            <FontAwesomeIcon
              icon={faUser}
              size="1x"
              style={{ marginLeft: '6px' }}
            />
          </span>
          )}

        </Grid>
        <Grid item xs={12}>
          {handleUserType(userType)}
        </Grid>
        <Grid item xs={12}>
          <span>
            <FontAwesomeIcon
              icon={faCalculator}
              size="1x"
              style={{ marginLeft: '6px' }}
            />
          </span>
          <span className="txt-xs ">تعداد اقلام عرضه شده: </span>
          <span className={` ${pharmacyName} `}>{itemsCount} </span>
        </Grid>
        <Grid item xs={12}>
          {stars(Number(star))}
        </Grid>
      </Grid>
      <Grid item xs={5} lg={4} md={4}></Grid>
    </Grid>

  );
};

export default CardHeader;
