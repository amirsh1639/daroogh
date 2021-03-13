export interface SettingsAiInterface {
  id?: number;
  _date?: Date;
  pharmacyDrugScore: number;
  pharmacyDrugIsFavorite: number;
  pharmacyDrugIsCategoryFavorite: number;
  pharmacyDrugSearchCount: number;
  pharmacyDrugAddToBasketCount: number;
  pharmacyDrugOpenListCount: number;
  pharmacyDrugIsSimilarFavorite: number;
  pharmacyDrugExchangeBasketCount: number;
  pharmacyDrugRemoveFromExchangeBasketCount: number;
  pharmacyDrugCanceledExchangeBasketCount: number;
  drugScore: number;
  drugAdditionalCount: number;
  drugFavoriteCount: number;
  drugSearchCount: number;
  drugExchangeCount: number;
  pharmacyPharmacyScore: number;
  pharmacyPharmacyAvgScore: number;
  pharmacyPharmacyExchangeCount: number;
  pharmacyPharmacyCanceledExchangeCount: number;
  pharmacyPharmacyOpenListCount: number;
  pharmacyPharmacyIsSameProvince: number;
  pharmacyPharmacyIsSameCity: number;
  pharmacyPharmacyIsCloseDistance: number;
  pharmacyPharmacyNeighboringDistanceMeters: number;
  pharmacyScore: number;
  pharmacyAvgScore: number;
  pharmacyExchangeCount: number;
  pharmacyCanceledExchangeCount: number;
  pharmacySumOfExchangePrice: number;
  pharmacyFavoriteCount: number;
  pharmacyOpenListCount: number;
  pharmacyWarrantyAmount: number;
  pharmacyPeopleResponseCount: number;
  pharmacyEmployeeRequestCount: number;
  pharmacyFillSurveyCount: number;
  pharmacyActionCount: number;
  pharmacyFillProfileInfo: number;
  pharmacyPaymentDaleyCount: number;
  pharmacySelectedForceDrugsInExchange: number;
  pharmacyForceDrugDaysCount: number;
  pharmacyOfferRatio: number;
  pharmacyPriceDifAvg: number;
  pharmacyExpRemainDays: number;
}