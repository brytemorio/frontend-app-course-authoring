import React, { useEffect } from 'react';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Button } from '@edx/paragon';

import CourseStepper from '../../generic/course-stepper';
import {
  getCurrentStage, getDownloadPath, getError, getLoadingStatus, getSuccessDate,
} from '../data/selectors';
import { fetchExportStatus } from '../data/thunks';
import { EXPORT_STAGES } from '../data/constants';
import { getFormattedSuccessDate } from '../utils';
import { RequestStatus } from '../../data/constants';
import messages from './messages';

const ExportStepper = ({ intl, courseId }) => {
  const currentStage = useSelector(getCurrentStage);
  const downloadPath = useSelector(getDownloadPath);
  const successDate = useSelector(getSuccessDate);
  const loadingStatus = useSelector(getLoadingStatus);
  const { msg: errorMessage } = useSelector(getError);
  const dispatch = useDispatch();
  const isStopFetching = currentStage === EXPORT_STAGES.SUCCESS
    || loadingStatus === RequestStatus.FAILED
    || errorMessage;

  useEffect(() => {
    const id = setInterval(() => {
      if (isStopFetching) {
        clearInterval(id);
      } else {
        dispatch(fetchExportStatus(courseId));
      }
    }, 3000);
    return () => clearInterval(id);
  });

  let successTitle = intl.formatMessage(messages.stepperSuccessTitle);
  const formattedSuccessDate = getFormattedSuccessDate(successDate);
  if (formattedSuccessDate && currentStage === EXPORT_STAGES.SUCCESS) {
    successTitle += formattedSuccessDate;
  }
  const steps = [
    {
      title: intl.formatMessage(messages.stepperPreparingTitle),
      description: intl.formatMessage(messages.stepperPreparingDescription),
      key: EXPORT_STAGES.PREPARING,
    }, {
      title: intl.formatMessage(messages.stepperExportingTitle),
      description: intl.formatMessage(messages.stepperExportingDescription),
      key: EXPORT_STAGES.EXPORTING,
    }, {
      title: intl.formatMessage(messages.stepperCompressingTitle),
      description: intl.formatMessage(messages.stepperCompressingDescription),
      key: EXPORT_STAGES.COMPRESSING,
    }, {
      title: successTitle,
      description: intl.formatMessage(messages.stepperSuccessDescription),
      key: EXPORT_STAGES.SUCCESS,
    },
  ];

  return (
    <div>
      <h3 className="mt-4">{intl.formatMessage(messages.stepperHeaderTitle)}</h3>
      <hr />
      <CourseStepper
        courseId={courseId}
        steps={steps}
        activeKey={currentStage}
        errorMessage={errorMessage}
        hasError={!!errorMessage}
      />
      {downloadPath && currentStage === EXPORT_STAGES.SUCCESS && <Button href={`${getConfig().STUDIO_BASE_URL}${downloadPath}`}>{intl.formatMessage(messages.downloadCourseButtonTitle)}</Button>}
    </div>
  );
};

ExportStepper.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(ExportStepper);
