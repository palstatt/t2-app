import { Observable } from 'rxjs-compat'
import { combineEpics, ofType } from 'redux-observable'
import { pipe } from 'rxjs'
import { flatMap, map, catchError, debounceTime, mergeMap, switchMap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

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
  Observable.from(errorQueryAction(error, type))
)

// THROW ERROR ON NULL OR REMOVE GETJSON CALL AND HANDLE REQUESTS
// AFTER FILTERING OUT 404 AND OTHER ERRORS

//epics
const loginRequestEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_REQUEST),
    flatMap(({payload, type}) =>
      ajax.getJSON(`${process.env.REACT_APP_API_URL}/users?id=${payload}`).pipe(
        map(res => loginFulfilledAction(res)),
        catchError(error => handleError(error, type))
      )
    )
  )

const loadAllIssuesEpic = action$ =>
  action$.pipe(
    ofType(LOAD_ALL_ISSUES),
    flatMap(({payload, type}) =>
      ajax.getJSON(`${process.env.REACT_APP_API_URL}/issues`).pipe(
        map(res => allIssuesLoadedAction(res)),
        catchError(error => handleError(error, type))
      )
    )
  )

const loadIssuesEpic = action$ =>
  action$.pipe(
    ofType(LOAD_ISSUES),
    debounceTime(500),
    flatMap(({payload, collectionName, type}) =>
      ajax.getJSON(`${process.env.REACT_APP_API_URL}/${payload}`).pipe(
        map(res => issuesLoadedAction(res, collectionName)),
        catchError(error => handleError(error, type))
      )
    )
  )

const loadAvatarsEpic = action$ =>
  action$.pipe(
    ofType(LOAD_USERS),
    flatMap(({payload, type}) =>
      ajax.getJSON(`${process.env.REACT_APP_API_URL}/users`).pipe(
        map(url => usersLoadedAction(url)),
        catchError(error => handleError(error, type))
      )
    )
  )

const resolveIssueEpic = action$ =>
   action$.pipe(
     ofType(RESOLVE_ISSUE),
     flatMap(({payload, type}) =>
        ajax.patch(
          `${process.env.REACT_APP_API_URL}/issues/${payload}`,
          { resolved: true },
          responseConfig
        ).pipe(
          map(({response}) => issueResolvedAction(response)),
          catchError(error => handleError(error, type))
        )
      )
  )

const claimIssueEpic = (action$, state$) =>
  action$.pipe(
    ofType(CLAIM_ISSUE),
    flatMap(({payload, type}) =>
      ajax.patch(
        `${process.env.REACT_APP_API_URL}/issues/${payload}`,
        { claimed: true, assigned_to: state$.value.currentUser.id },
        responseConfig
      ).pipe(
        mergeMap(({response}) =>
          Observable.of(
            issueClaimedAction(response),
            loadAllIssuesAction()
          )
        ),
        catchError(error => handleError(error, type))
      )
    )
  )

const assignIssueEpic = action$ =>
  action$.pipe(
    ofType(ASSIGN_ISSUE),
    switchMap(({payload, assignTo, type}) =>
      ajax.patch(`${process.env.REACT_APP_API_URL}/issues/${payload}`,
        { claimed: !(assignTo === 0), assigned_to: assignTo },
        responseConfig
      ).pipe(
      mergeMap(({response}) =>
        Observable.of(
          issueAssignedAction(response),
          loadAllIssuesAction()
        )
      ),
      catchError(error => handleError(error, type))
    )
  )
)

export const rootEpic = combineEpics(loginRequestEpic,
                                     loadAllIssuesEpic,
                                     loadIssuesEpic,
                                     loadAvatarsEpic,
                                     resolveIssueEpic,
                                     claimIssueEpic,
                                     assignIssueEpic)
