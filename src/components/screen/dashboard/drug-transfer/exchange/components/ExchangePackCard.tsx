import {
  createStyles,
  CheckboxProps,
  Grid,
  Hidden,
  makeStyles,
  withStyles,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import Utils from 'components/public/utility/Utils';
import { ColorEnum } from 'enum';
import { AllPharmacyDrugInterface } from 'interfaces';
import moment from 'jalali-moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import pack from '../../../../../../assets/images/pack.png';

interface Props {
  pharmacyDrug?: AllPharmacyDrugInterface;
  // totalAmount: string;
  activeStep: number;
  basketCount: AllPharmacyDrugInterface[];
  uBasketCount: AllPharmacyDrugInterface[];
   lockedAction: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  // counterButtonFunc: JSX.Element;
}
const ExchangePackCard: React.FC<Props> = (props) => {
  const {
    pharmacyDrug,
    //   totalAmount,
    activeStep,
     basketCount,
    uBasketCount,
    lockedAction ,
    handleChange,
    // counterButtonFunc
  } = props;
  
  const { t } = useTranslation();
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
        transform: 'scale(1.5)',
      }}
    />
  ));

  const useStyle = makeStyles((theme) =>
    createStyles({
      root: {
        display: 'flex',
        verticalAlign: 'middle',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        padding: 16,
      },
      verticalAlign: {
        display: 'flex',
      },
      textC: {
        color: ColorEnum.DeepBlue,
        fontSize: '14px',
        verticalAlign: 'middle',
        lineHeight: '20px',
      },
      avatar: {
        verticalAlign: 'middle',
        width: 40,
        height: 40,
        borderRadius: '10%',
        backgroundColor: 'silver',
        // marginTop:'15%'
      },
      avatarContainer: {
        display: 'flex',
        verticalAlign: 'middle',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      detailsHolder: {
        borderLeft: '1px solid #f80501',
        paddingLeft: 8,
      },
      checkBoxContainer: {
        display: 'flex',
        // verticalAlign: 'middle',
        //  alignContent: 'center',
        //  alignItems: 'center',
        // justifyContent: 'right',
        flexDirection: 'row-reverse',
      },
    })
  );

  const {
    root,
    avatar,
    avatarContainer,
    detailsHolder,
    checkBoxContainer,
  } = useStyle();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container item xs={12} spacing={0} className={root}>
      
      <Grid item container xs={12}>
      <Hidden smDown>
        <Grid item xs={5}/>
      </Hidden>
        <Grid item xs={11} sm={6} style={{display:'flex' , justifyContent:`${fullScreen? 'flex-start':'flex-end'}`, alignItems:'center'}} >
          <span style={{ fontSize: 13 }}>قیمت کل اقلام این پک: </span>
            <span style={{ fontSize: 17, fontWeight: 'bold', color: 'green' }}>
              {Utils.numberWithCommas(pharmacyDrug?.totalAmount)}
            </span>
            <span style={{ fontSize: 12, marginRight: 5, color: 'green' }}>
              تومان
            </span></Grid>
            {lockedAction && (
              <Grid item xs={1} className={checkBoxContainer}>
          <GreenCheckbox
            checked={
              pharmacyDrug?.checked
            }
            onChange={handleChange}
            name={pharmacyDrug?.id.toString()}
          />
        </Grid>
            )}
        
      </Grid>
      <Grid item container xs={12} sm={12}>
        <Hidden smDown>
          <Grid item xs={1} className={avatarContainer}>
            <img src={pack} className={avatar} width="40" height="40" />
          </Grid>
        </Hidden>

        <Grid item container xs={12} sm={11} className={detailsHolder}>
          <Grid item xs={12}>
            <span style={{ fontSize: 12 }}>
              <TextWithTitle title="دسته بندی" body={pharmacyDrug?.packName} />
            </span>
          </Grid>
          <Grid item xs={12}>
            <TextWithTitle
              title="تعداد محصولات عرضه شده در این پک"
              body={pharmacyDrug?.packDetails.length}
              suffix="عدد"
            />
          </Grid>
          <Grid item xs={12}>
            <span style={{ fontSize: 9.5, color: 'red' }}>
              همه اقلام یک پک با هم و با تعداد مشخص شده قابل انتخاب هستند
            </span>
          </Grid>
        </Grid>
      </Grid>
    
    </Grid>
  );
};

export default ExchangePackCard;
