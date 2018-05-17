import { Observable } from 'rxjs-compat'
import { combineEpics } from 'redux-observable'

import {
  ASSIGN_ISSUE,
  CLAIM_ISSUE,
  LOAD_ALL_ISSUES,
  LOAD_ISSUES,
  LOAD_USERS,
  LOGIN_REQUEST,
  RESOLVE_ISSUE,
  allIssuesLoadedAction,
  errorQueryAction,
  issueAssignedAction,
  issueClaimedAction,
  issueResolvedAction,
  issuesLoadedAction,
  loadAllIssuesAction,
  loginFulfilledAction,
  usersLoadedAction
} from '../actions';

const defaultErrorMessage = {
  text: 'Unknown Error',
  name: 'Caught unknown error'
}

const responseConfig = { 'Content-Type': 'application/json' }

const handleError = (error, type) => (
  Observable.of(errorQueryAction(error, type))
)

//epics
const loginRequestEpic = action$ =>
  action$.ofType(LOGIN_REQUEST)
    .flatMap(({payload, type}) =>
      Observable.ajax(`${process.env.REACT_APP_API_URL}/users?id=${payload}`)
        .map(res => loginFulfilledAction(res))
        .catch(error => handleError(error, type))
      )

const loadAllIssuesEpic = action$ =>
  action$.ofType(LOAD_ALL_ISSUES)
    .flatMap(({payload, type}) =>
      Observable.ajax(`${process.env.REACT_APP_API_URL}/issues`)
        .map(res => allIssuesLoadedAction(res))
        .catch(error => handleError(error, type))
      )

const loadIssuesEpic = action$ =>
  action$.ofType(LOAD_ISSUES)
    .debounceTime(500)
    .flatMap(({payload, collectionName, type}) =>
      Observable.ajax(`${process.env.REACT_APP_API_URL}/${payload}`)
        .map(res => issuesLoadedAction(res, collectionName))
        .catch(error => handleError(error, type))
      )

const loadAvatarsEpic = action$ =>
  action$.ofType(LOAD_USERS)
    .flatMap(({payload, type}) =>
      Observable.ajax(`${process.env.REACT_APP_API_URL}/users`)
        .map(url => usersLoadedAction(url))
        .catch(error => handleError(error, type))
      )

const resolveIssueEpic = action$ =>
   action$.ofType(RESOLVE_ISSUE)
    .flatMap(({payload, type}) =>
      Observable.ajax.patch(
        `${process.env.REACT_APP_API_URL}/issues/${payload}`,
        { resolved: true },
        responseConfig
      )
        .map(({response}) => issueResolvedAction(response))
        .catch(error => handleError(error, type))
  )

const claimIssueEpic = (action$, state$) =>
  action$.ofType(CLAIM_ISSUE)
    .flatMap(({payload, type}) =>
      Observable.ajax.patch(
        `${process.env.REACT_APP_API_URL}/issues/${payload}`,
        { claimed: true, assigned_to: state$.value.currentUser.id },
        responseConfig
      )
        .mergeMap(({response}) =>
          Observable.of(
            issueClaimedAction(response),
            loadAllIssuesAction()
          )
        )
        .catch(error => handleError(error, type))
  )

const assignIssueEpic = action$ =>
  action$.ofType(ASSIGN_ISSUE)
    .switchMap(({payload, assignTo, type}) =>
      Observable.ajax.patch(`${process.env.REACT_APP_API_URL}/issues/${payload}`,
        { claimed: !(assignTo === 0), assigned_to: assignTo },
        responseConfig
      )
      .mergeMap(({response}) =>
        Observable.of(
          issueAssignedAction(response),
          loadAllIssuesAction()
        )
      )
      .catch(error => handleError(error, type))
  )

export const rootEpic = combineEpics(loginRequestEpic,
                                     loadAllIssuesEpic,
                                     loadIssuesEpic,
                                     loadAvatarsEpic,
                                     resolveIssueEpic,
                                     claimIssueEpic,
                                     assignIssueEpic)
