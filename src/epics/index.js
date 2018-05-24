import { ajax } from 'rxjs/ajax'
import { combineEpics, ofType } from 'redux-observable'
import {
  flatMap,
  map,
  catchError,
  debounceTime,
  mergeMap,
  switchMap,
  pluck,
  distinctUntilChanged,
  concatMap,
} from 'rxjs/operators';
import { of, from } from 'rxjs';

import {
  ASSIGN_ISSUE,
  CLAIM_ISSUE,
  CLEAR_MESSAGES,
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
  messageClearedAction,
  usersLoadedAction
} from '../actions';
import { bugMessage } from '../api';


const requestConfig = {
  createXHR: () => new XMLHttpRequest(),
  responseType: 'json'
 }

const responseConfig = { 'Content-Type': 'application/json' }

const handleError = (error, type) => (
  of(errorQueryAction(error, type))
)

//epics
const loginRequestEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_REQUEST),
    flatMap(({payload, type}) =>
      ajax({
        url: `${process.env.REACT_APP_API_URL}/users?id=${payload}`,
        ...requestConfig
      }).pipe(
        pluck('response'),
        mergeMap(response => from(response).pipe(
          map(user => loginFulfilledAction(user))
        )),
        catchError(error => handleError(error, type))
      )
    )
  )

const loadAllIssuesEpic = action$ =>
  action$.pipe(
    ofType(LOAD_ALL_ISSUES),
    flatMap(({payload, type}) =>
      ajax({
        url: `${process.env.REACT_APP_API_URL}/issues`,
        ...requestConfig
      }).pipe(
        pluck('response'),
        map(issues => allIssuesLoadedAction(issues)),
        catchError(error => handleError(error, type))
      )
    )
  )

const loadIssuesEpic = action$ =>
  action$.pipe(
    ofType(LOAD_ISSUES),
    debounceTime(500),
    flatMap(({payload, collectionName, type}) =>
      ajax({
        url: `${process.env.REACT_APP_API_URL}/${payload}`,
        ...requestConfig
      }).pipe(
        pluck('response'),
        map(issues => issuesLoadedAction(issues, collectionName)),
        catchError(error => handleError(error, type))
      )
    )
  )

const loadAvatarsEpic = action$ =>
  action$.pipe(
    ofType(LOAD_USERS),
    flatMap(({payload, type}) =>
      ajax({
        url: `${process.env.REACT_APP_API_URL}/users`,
        ...requestConfig
      }).pipe(
        pluck('response'),
        map(users => usersLoadedAction(users)),
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
          pluck('response'),
          map(issue => issueResolvedAction(issue)),
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
        pluck('response'),
        mergeMap(issue =>
          of(
            issueClaimedAction(issue),
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
      ajax.patch(
        `${process.env.REACT_APP_API_URL}/issues/${payload}`,
        { claimed: !(assignTo === 0), assigned_to: assignTo },
        responseConfig
      ).pipe(
        pluck('response'),
        mergeMap(issue =>
          of(
            issueAssignedAction(issue),
            loadAllIssuesAction()
          )
        ),
        catchError(error => handleError(error, type))
      )
    )
  )

const clearMessagesEpic = (action$, state$) =>
  action$.pipe(
    ofType(CLEAR_MESSAGES),
    switchMap(({type}) =>
      from(state$).pipe(
        pluck('messages'),
        distinctUntilChanged(),
        concatMap(message =>
          from(message).pipe(
            mergeMap(message =>
              ajax.post(
                process.env.REACT_APP_SLACK_URL,
                bugMessage(message.text.name, message.actionSource, state$.value.currentUser.name),
              ).pipe(
                map(() => messageClearedAction(message)),
                catchError(error => handleError(error, type))
              )
            )
          )
        )
      )
    )
  )

export const rootEpic = combineEpics(loginRequestEpic,
                                     loadAllIssuesEpic,
                                     loadIssuesEpic,
                                     loadAvatarsEpic,
                                     resolveIssueEpic,
                                     claimIssueEpic,
                                     assignIssueEpic,
                                     clearMessagesEpic)
