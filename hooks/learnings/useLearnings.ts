import {
  GetApiV1CardsLearning200Response,
  GetApiV1CardsLearning200ResponseData,
} from '../../types/api';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { buildApiClient } from '../../lib/apiClient';

const useLearnings = () => {
  const apiClient = buildApiClient();
  const [learnings, setLearnings] =
    useState<GetApiV1CardsLearning200ResponseData>();

  const loadLearningStatistic = async () => {
    const response: AxiosResponse<GetApiV1CardsLearning200Response> =
      await apiClient.getApiV1CardsLearning();
    setLearnings(response.data.data);
  };

  return { learnings, loadLearningStatistic };
};

export { useLearnings };
