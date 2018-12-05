import { combineReducers } from "redux-immutable";
import * as Immutable from "immutable";

import {
  makeKernelspec,
  makeKernelspecsByRefRecord,
  makeKernelspecsRecord
} from "@nteract/types";
import * as actionTypes from "@nteract/actions";

const byRef = (
  state = Immutable.Map(),
  action: actionTypes.FetchKernelspecsFulfilled
) => {
  switch (action.type) {
    case actionTypes.FETCH_KERNELSPECS_FULFILLED:
      return state.set(
        action.payload.kernelspecsRef,
        makeKernelspecsByRefRecord({
          hostRef: action.payload.hostRef,
          defaultKernelName: action.payload.defaultKernelName,
          byName: Immutable.Map(
            Object.keys(action.payload.kernelspecs).reduce((r, k) => {
              r[k] = makeKernelspec(action.payload.kernelspecs[k]);
              return r;
            }, {})
          )
        })
      );
    default:
      return state;
  }
};

const refs = (
  state = Immutable.List(),
  action: actionTypes.FetchKernelspecsFulfilled
) => {
  switch (action.type) {
    case actionTypes.FETCH_KERNELSPECS_FULFILLED:
      return state.includes(action.payload.kernelspecsRef)
        ? state
        : state.push(action.payload.kernelspecsRef);
    default:
      return state;
  }
};

export const kernelspecs = combineReducers(
  { byRef, refs },
  makeKernelspecsRecord
);
