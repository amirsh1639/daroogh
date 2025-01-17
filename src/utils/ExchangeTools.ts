import { isNullOrEmpty } from '.';
import { ColorEnum, ExchangeStateEnum } from '../enum';
import moment from 'jalali-moment';
import {
  AllPharmacyDrugInterface,
  LabelValue,
  ViewExchangeInterface,
} from '../interfaces';
import { Convertor } from './';
import i18n from 'i18n';

export const isExchangeCompleteddOrCancelled = (state: number): boolean => {
  return (
    [
      ExchangeStateEnum.NOCONFIRMB,
      ExchangeStateEnum.CONFIRMB_AND_NOCONFIRMA,
      ExchangeStateEnum.CANCELLED,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
      ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
      ExchangeStateEnum.NOCONFIRMB_FORB,
      ExchangeStateEnum.CONFIRMB_AND_NOCONFIRMA_FORB,
      ExchangeStateEnum.CANCELLED_FORB,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
      ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
    ].indexOf(state) > -1
  );
};

export const CompletedExchangeForAList: ExchangeStateEnum[] = [
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
];

export const CompletedExchangeForBList: ExchangeStateEnum[] = [
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
];

export const isExchangeCompleted = (
  state: number,
  isA: boolean | undefined = undefined
): boolean => {
  if (isA == undefined) {
    return (
      CompletedExchangeForAList.indexOf(state) > -1 ||
      CompletedExchangeForBList.indexOf(state) > -1
    );
  } else {
    return isA
      ? CompletedExchangeForAList.indexOf(state) > -1
      : CompletedExchangeForBList.indexOf(state) > -1;
  }
};

export const isStateCommon = (state: number): boolean => {
  return (
    [
      ExchangeStateEnum.UNKNOWN,
      ExchangeStateEnum.NOSEND,
      ExchangeStateEnum.CANCELLED,
      ExchangeStateEnum.CONFIRMA_AND_B,
      ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL
    ].indexOf(state) >= 0
  );
};

export const getExpireDate = (item: any): string => {
  let expireDate: string = '';
  if (item?.currentPharmacyIsA) {
    expireDate = item?.expireDateA == null ? '' : item?.expireDateA;
  } else {
    expireDate = item?.expireDateB == null ? '' : item?.expireDateB;
  }
  if (isExchangeCompleteddOrCancelled(item?.state)) {
    expireDate =
      expireDate > (item?.cancelDate == undefined ? '' : item?.cancelDate)
        ? expireDate
        : item?.cancelDate;
  }
  expireDate = isNullOrEmpty(expireDate)
    ? ''
    : moment(expireDate, 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD');
  return expireDate;
};

export const getExpireDateTitle = (state: number): string => {
  return isExchangeCompleteddOrCancelled(state)
    ? 'exchange.completionDate'
    : 'exchange.expirationDate';
};

/// Checks if a list of LavelValue has x value
export const hasLabelValue = (list: LabelValue[], x: any): boolean => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].value == x) return true;
  }

  return false;
};

export const ViewExchangeInitialState: ViewExchangeInterface = {
  id: 0,
  state: 1,
  currentPharmacyIsA: true,
  numberA: '',
  numberB: '',
  expireDateA: '',
  expireDateB: '',
  expireDate: '',
  canceller: 0,
  stateString: '',
  pharmacyKeyA: '',
  pharmacyKeyB: '',
  pharmacyCityA: '',
  pharmacyProvinceA: '',
  pharmacyCityB: '',
  pharmacyProvinceB: '',
  pharmacyGradeA: 0,
  pharmacyGradeB: 0,
  pharmacyStarA: 0,
  pharmacyStarB: 0,
  pharmacyWarrantyA: 0,
  pharmacyWarrantyB: 0,
  totalPourcentageA: 0,
  totalPourcentageB: 0,
  totalAmountA: 0,
  totalAmountB: 0,
  confirmA: false,
  confirmB: false,
  sendDate: '',
  confirmDateA: '',
  confirmDateB: '',
  paymentDateA: '',
  paymentDateB: '',
  cancelDate: '',
  description: '',
  lockSuggestion: false,
  allowShowPharmacyInfo: false,
  cartA: [],
  cartB: [],
  totalPriceA: 0,
  totalPriceB: 0,
  viewDateA:'',
  viewDateB:'',
};

export interface DifferenceCheckInterface {
  exchange: ViewExchangeInterface;
  // totalPriceA?: number;
  // totalPriceB?: number;
  percent: number;
  cartA?: AllPharmacyDrugInterface[];
  cartB?: AllPharmacyDrugInterface[];
}

export interface DifferenceCheckOutputInterface {
  // amount of difference in prices
  difference: number;
  // Maximum between to diff percents
  diffPercent: number;
  // if the difference is less than allowed?
  isDiffOk: boolean;
  // Message to show to the user
  message: string;
}

const calcPrice = (cart: AllPharmacyDrugInterface[]): any => {
  return (
    cart.length > 0
      ? cart.map((i: any) => {
        if (i.packID !== null && i.packDetails && i.packDetails.length > 0) {
          return i.packDetails.map((p: any) => {
            return (
              (
                (isNullOrEmpty(p.confirmed) || p.confirmed) &&
                (
                  isNullOrEmpty(p.cardColor) 
                  || p.cardColor === ColorEnum.AddedByB
                  || p.cardColor === ColorEnum.Confirmed
                )
              )
                ? p.currentCnt
                  ? p.currentCnt * p.amount
                  : p.cnt * p.amount
                : 0
            )
          }).reduce((sum: number, price: number) => sum + price)
        } else {
          return (
            (
              (isNullOrEmpty(i.confirmed) || i.confirmed) &&
              (
                isNullOrEmpty(i.cardColor) 
                || i.cardColor === ColorEnum.AddedByB
                || i.cardColor === ColorEnum.Confirmed
              )
            )
              ? i.currentCnt
                ? i.currentCnt * i.amount
                : i.cnt * i.amount
              : 0
          )
        }
      }).reduce((sum, price) => sum + price)
      : 0
  );
}

/// Checks the difference between total price of two baskets
/// and returns proper values and a suitable message
export const differenceCheck = (
  params: DifferenceCheckInterface
): DifferenceCheckOutputInterface => {
  const { exchange, percent, cartA = [], cartB = [] } = params;
  // let { totalPriceA = 0, totalPriceB = 0 } = params;
  let { totalPriceA = 0, totalPriceB = 0 } = exchange;
  const currency = i18n.t('general.defaultCurrency');

  // if (totalPriceA !== 0 ) {
  if (cartA.length > 0) {
    totalPriceA = calcPrice(cartA);
  } else {
    totalPriceA = 0;
  }
  /* else if (exchange.cartA && exchange.cartA.length > 0) {
    totalPriceA = exchange.cartA
      .map((i: any) => {
        return (
          // i.packID !== null
          //   ? i.totalAmount :
          (
            (isNullOrEmpty(i.confirmed) || i.confirmed) &&
            (
              isNullOrEmpty(i.cardColor) 
              || i.cardColor === ColorEnum.AddedByB
              || i.cardColor === ColorEnum.Confirmed
            )
          ) ? i.cnt * i.amount : 0
        )
      })
      .reduce((sum, price) => sum + price);
  } */
  // }

  // if (totalPriceB !== 0) {
  if (cartB.length > 0) {
    totalPriceB = calcPrice(cartB);
  } else {
    totalPriceB = 0;
  }
  /* else if (exchange.cartB && exchange.cartB.length > 0) {
    totalPriceB = exchange.cartB
      .map((i: any) => {
        return (
          // i.packID !== null
          //   ? i.totalAmount :
          (
            (isNullOrEmpty(i.confirmed) || i.confirmed) &&
            (
              isNullOrEmpty(i.cardColor)
              || i.cardColor === ColorEnum.AddedByB
              || i.cardColor === ColorEnum.Confirmed
            )
          ) ? i.cnt * i.amount : 0
        )
      })
      .reduce((sum, price) => sum + price);
  } */
  // }

  let difference: number = 0;
  let diffPercent: number = 0;
  let isDiffOk: boolean = true;
  let message: string = '';

  const { l } = Convertor;

  // const l = (v: string | number): string => {
  //   return v.toLocaleString('fa-IR');
  // };

  // diff percent of each side
  const a3p = totalPriceA * percent;
  const b3p = totalPriceB * percent;

  difference = Math.abs(totalPriceA - totalPriceB);
  // setDifference(difference);
  diffPercent = Math.floor(
    (difference * 100) / Math.max(totalPriceA, totalPriceB)
  );
  // Maximum between to diff percents
  const diffPercentValue = Math.max(a3p, b3p);
  //setDiffPercent(diffPercent);

  // if the difference is less than allowed?
  isDiffOk = difference < diffPercentValue;
  //if (setIs3PercentOk) setIs3PercentOk(isDiffOk);

  // difference to amend for A
  const diffA =
    totalPriceA > totalPriceB
      ? totalPriceB + b3p - totalPriceA
      : totalPriceB - (totalPriceA + b3p);

  // difference to amend for B
  const diffB =
    totalPriceA > totalPriceB
      ? totalPriceA - (totalPriceB + a3p)
      : totalPriceA + a3p - totalPriceB;

  const lockMessage =
    'از آنجا که طرف مقابل سبدها را قفل کرده است شما می‌توانید \
    تبادل را رد یا تایید نمایید. سبدها قابل ویرایش نیستند.';

  if (exchange.currentPharmacyIsA && totalPriceA === 0 && totalPriceB !== 0) {
    message = `اگر قصد دارید از سبد خود پیشنهادی ارائه دهید \
      حدود ${l(
      totalPriceB
    )} ${ currency } از سبد خود انتخاب کنید تا اختلاف سبدها به حد مجاز برسد.\
      در غیر این صورت داروخانه مقابل از سبد شما انتخاب خواهد کرد.`;
  } else {
    // TODO: if diffA or diffB === 0 hide message

    // set messages:
    const diffAabs = l(Math.abs(diffA));
    const diffBabs = l(Math.abs(diffB));
    if (diffA !== 0 && diffB !== 0) {
      message = '';
      if (exchange.currentPharmacyIsA) {
        if (diffA > 0) {
          message += `لطفا حدود ${diffAabs} ${ currency } به سبد خود اضافه کنید `;
          message +=
            diffB < 0
              ? `یا حدود ${diffBabs} ${ currency } از سبد طرف مقابل کم کنید `
              : `یا حدود ${diffBabs} ${ currency } به سبد طرف مقابل اضافه کنید `;
        } else {
          message +=
            diffB > 0
              ? `لطفا حدود ${diffBabs} ${ currency } به سبد طرف مقابل اضافه کنید `
              : `لطفا حدود ${diffBabs} ${ currency } از سبد طرف مقابل کم کنید `;
          message += `یا حدود ${diffAabs} ${ currency } از سبد خود کم کنید `;
        }
        // message = diffA > 0
        //   ? `لطفا حدود ${diffAabs} ${ currency } به سبد خود اضافه کنید `
        //   : `لطفا حدود ${diffAabs} ${ currency } از سبد خود کم کنید `
        // message += diffB > 0
        //   ? `یا حدود ${diffBabs} ${ currency } به سبد طرف مقابل اضافه کنید `
        //   : `یا حدود ${diffBabs} ${ currency } از سبد طرف مقابل کم کنید `
      } else {
        if (diffB > 0) {
          message += `لطفا حدود ${diffBabs} ${ currency } به سبد خود اضافه کنید `;
          message +=
            diffA < 0
              ? `یا حدود ${diffAabs} ${ currency } از سبد طرف مقابل کم کنید `
              : `یا حدود ${diffAabs} ${ currency } به سبد طرف مقابل اضافه کنید `;
        } else {
          message +=
            diffA > 0
              ? `لطفا حدود ${diffAabs} ${ currency } به سبد طرف مقابل اضافه کنید `
              : `لطفا حدود ${diffAabs} ${ currency } از سبد طرف مقابل کم کنید `;
          message += `یا حدود ${diffBabs} ${ currency } از سبد خود کم کنید `;
        }
        // message = diffB > 0
        //   ? `لطفا حدود ${diffBabs} ${ currency } به سبد خود اضافه کنید `
        //   : `لطفا حدود ${diffBabs} ${ currency } از سبد خود کم کنید `
        // message += diffA > 0
        //   ? `یا حدود ${diffAabs} ${ currency } به سبد طرف مقابل اضافه کنید `
        //   : `یا حدود ${diffAabs} ${ currency } از سبد طرف مقابل کم کنید `
      }
      message += ' تا اختلاف قیمت سبدها به حد مجاز برسد.';
    }

    if (exchange.lockSuggestion && !exchange.currentPharmacyIsA) {
      if (isDiffOk) {
        message = lockMessage;
      } else {
        message += `\n${lockMessage}`;
      }
    }
  }

  if (isDiffOk && exchange.currentPharmacyIsA) {
    message = '';
  }

  if (isNaN(diffPercent)) {
    diffPercent = 0;
  }

  return {
    difference,
    diffPercent,
    isDiffOk,
    message,
  };

  //setDifferenceMessage(message);
};

export interface CalcTotalPricesInterface {
  exchange: ViewExchangeInterface;
  uBasketCount?: AllPharmacyDrugInterface[];
  basketCount?: AllPharmacyDrugInterface[];
}

/// Calculates total price of two (A & B) baskets for an exchange
export const calcTotalPrices = (
  params: CalcTotalPricesInterface
): ViewExchangeInterface => {
  const { exchange, uBasketCount = [], basketCount = [] } = params;
  if (exchange.currentPharmacyIsA) {
    exchange.totalPriceA = (uBasketCount.length > 0)
      ? uBasketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
    exchange.totalPriceB = (basketCount.length > 0)
      ? basketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
  } else {
    exchange.totalPriceA = (basketCount.length > 0)
      ? basketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
    exchange.totalPriceB = (uBasketCount.length > 0)
      ? uBasketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
  }

  return exchange;
};

/// Reads max difference percent from localStorage (settings)
export const percentAllowed = (): number => {
  try {
    const settings = localStorage.getItem('settings') || '{}';
    const { diffrenceAllowPercentageInExchange } = JSON.parse(settings);
    return diffrenceAllowPercentageInExchange / 100;
  } catch (e) {
    return 0.03;
  }
};

export const getColor = (currentPharmacyIsA: any, item: any): string => {
  const color =
    currentPharmacyIsA
      ? item.addedByB
        ? ColorEnum.AddedByB
        : item.confirmed !== undefined && item.confirmed === false
        ? ColorEnum.NotConfirmed
        : ColorEnum.Confirmed
      : ColorEnum.Confirmed

  return color
}

/// Gets a cart (from viewExchange) and returns a basket usable in exchange steps
export const fillFromCart = async (cart: any, isA: boolean = true): Promise<any> => {
  if (cart == undefined) return []
  const basket: AllPharmacyDrugInterface[] = []
  cart.forEach((item: any) => {
    if (
      item.confirmed !== undefined &&
      item.confirmed === false
    ) return
    basket.push({
      packDetails: [],
      id: item.pharmacyDrugID,
      packID: item.packID,
      packName: item.packName,
      drugID: item.drugID,
      drug: item.drug,
      cnt: item.cnt,
      batchNO: '',
      expireDate: item.expireDate,
      amount: item.amount,
      buttonName: 'حذف از تبادل',
      cardColor: getColor(isA, item),
      currentCnt: item.cnt,
      offer1: item.offer1,
      offer2: item.offer2,
      order: 0,
      totalAmount: 0,
      totalCount: 0,
    })
  })

  const newItemsA: AllPharmacyDrugInterface[] = []
  const packListA = new Array<AllPharmacyDrugInterface>()

  basket.forEach((item) => {
    let ignore = false
    if (item.packID) {
      let totalAmount = 0
      if (!packListA.find((x) => x.packID === item.packID)) {
        if (!item.packDetails) item.packDetails = []
        basket
          .filter((x) => x.packID === item.packID)
          .forEach((p: AllPharmacyDrugInterface) => {
            item.packDetails.push(p)
            packListA.push(p)
            totalAmount += p.amount * p.cnt
          })
        item.totalAmount = totalAmount
        newItemsA.push(item)
      } else {
        ignore = true
      }
    } else {
      if (!ignore) newItemsA.push(item)
    }
  })

  return basket
}
