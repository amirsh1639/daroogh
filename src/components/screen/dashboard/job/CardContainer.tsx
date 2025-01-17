import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Divider,
  Button,
} from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardJobInterface, NewUserData } from '../../../../interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BackDrop } from '../../../public';
import { getJalaliDate } from 'utils';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    span :{
      fontSize: '14px',
      
      padding: '8px',
  
    }
  })
);

const CardContainer: React.FC<CardJobInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root , span} = useStyle();

  const { data, toggleConfirmHandler, saveHandler } = props;

  const {
    id,
    maritalStatusStr,
    genderStr,
    hasReadingPrescriptionCertificateStr,
    minGradeOfReadingPrescriptionCertificateStr,
    minWorkExperienceYearStr,
    suggestedWorkShiftStr,
    pharmaceuticalSoftwareSkillStr,
    computerSkillStr,
    foreignLanguagesSkillStr,
    hasGuaranteeStr,
    jobPositionStr,
    educationStr,
    maxAge,
    livingInAreaStr,
    descriptions,
    cancelDate,
  } = data;

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={0}>
        <Detail
          id={id}
          maritalStatusStr={maritalStatusStr}
          genderStr={genderStr}
          hasReadingPrescriptionCertificateStr={
            hasReadingPrescriptionCertificateStr
          }
          minGradeOfReadingPrescriptionCertificateStr={
            minGradeOfReadingPrescriptionCertificateStr
          }
          minWorkExperienceYearStr={minWorkExperienceYearStr}
          suggestedWorkShiftStr={suggestedWorkShiftStr}
          pharmaceuticalSoftwareSkillStr={pharmaceuticalSoftwareSkillStr}
          computerSkillStr={computerSkillStr}
          foreignLanguagesSkillStr={foreignLanguagesSkillStr}
          jobPositionStr={jobPositionStr}
          educationStr={educationStr}
          maxAge={maxAge}
          livingInAreaStr={livingInAreaStr}
          descriptions={descriptions}
          hasGuaranteeStr={hasGuaranteeStr}
          cancelDate={cancelDate}
        />
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
      {' '}
        <Divider />
      </Grid>
        {!cancelDate &&
      <Grid item xs={12}  container spacing={0} justify="flex-end">
        <Button
          onClick={(): void => saveHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          ویرایش
        </Button>
        <Button
          onClick={(): Promise<any> => toggleConfirmHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          لغو درخواست
        </Button>
      </Grid> }
      {cancelDate &&
      <Grid item xs={12}  container spacing={0} justify="flex-end" >
        <span className= {span}>لغو شده در تاریخ { getJalaliDate(cancelDate)}
          </span>
      </Grid> }
      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;
