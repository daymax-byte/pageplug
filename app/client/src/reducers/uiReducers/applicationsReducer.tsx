import { createReducer } from "utils/AppsmithUtils";
import {
  ReduxAction,
  ReduxActionTypes,
  ReduxActionErrorTypes,
  ApplicationPayload,
} from "constants/ReduxActionConstants";
import { ERROR_MESSAGE_CREATE_APPLICATION } from "constants/messages";

const initialState: ApplicationsReduxState = {
  isFetchingApplications: false,
  applicationList: [],
  creatingApplication: false,
};

const applicationsReducer = createReducer(initialState, {
  [ReduxActionTypes.FETCH_APPLICATION_LIST_INIT]: (
    state: ApplicationsReduxState,
  ) => ({ ...state, isFetchingApplications: true }),
  [ReduxActionTypes.FETCH_APPLICATION_LIST_SUCCESS]: (
    state: ApplicationsReduxState,
    action: ReduxAction<{ applicationList: ApplicationPayload[] }>,
  ) => ({
    ...state,
    applicationList: action.payload,
    isFetchingApplications: false,
  }),
  [ReduxActionTypes.CREATE_APPLICATION_INIT]: (
    state: ApplicationsReduxState,
  ) => ({
    ...state,
    creatingApplication: true,
    createApplicationError: undefined,
  }),
  [ReduxActionTypes.CREATE_APPLICATION_SUCCESS]: (
    state: ApplicationsReduxState,
    action: ReduxAction<ApplicationPayload>,
  ) => {
    return {
      ...state,
      creatingApplication: false,
      applicationList: [...state.applicationList, action.payload],
    };
  },
  [ReduxActionErrorTypes.CREATE_APPLICATION_ERROR]: (
    state: ApplicationsReduxState,
  ) => {
    return {
      ...state,
      creatingApplication: false,
      createApplicationError: ERROR_MESSAGE_CREATE_APPLICATION,
    };
  },
  [ReduxActionTypes.SEARCH_APPLICATIONS]: (
    state: ApplicationsReduxState,
    action: ReduxAction<{ keyword?: string }>,
  ) => {
    return {
      ...state,
      searchKeyword: action.payload.keyword,
    };
  },
});

export interface ApplicationsReduxState {
  applicationList: ApplicationPayload[];
  searchKeyword?: string;
  isFetchingApplications: boolean;
  creatingApplication: boolean;
  createApplicationError?: string;
}

export default applicationsReducer;
