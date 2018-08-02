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
    CHANGE_STATUS,
    CLAIM_ISSUE,
    CLEAR_MESSAGES,
    LOAD_ALL_ISSUES,
    LOAD_FOLLOW_UP_ISSUES,
    LOAD_ISSUES,
    LOAD_USERS,
    LOGIN_REQUEST,
    MARK_FOLLOW_UP,
    RESOLVE_ISSUE,
    UNASSIGN_ISSUE,
    allIssuesLoadedAction,
    errorQueryAction,
    followUpIssuesLoadedAction,
    followUpMarkedAction,
    issueAssignedAction,
    issueClaimedAction,
    issueResolvedAction,
    issueUnassignedAction,
    issuesLoadedAction,
    loadAllIssuesAction,
    loadFollowUpIssuesAction,
    loadUsersAction,
    loginFulfilledAction,
    loginRequestAction,
    messageClearedAction,
    statusChangedAction,
    usersLoadedAction
} from '../actions';
import { bugMessage } from '../api';

const baseUrl = document.getElementsByTagName('base')[0].href

const debounceInterval = 100

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
        flatMap(({ payload, type }) =>
            ajax({
                url: `${baseUrl}employees/current`,
                ...requestConfig
            }).pipe(
                pluck('response'),
                map(user => loginFulfilledAction(user)),
                catchError(error => handleError(error, type))
            )
        )
    )

const loadAllIssuesEpic = action$ =>
    action$.pipe(
        ofType(LOAD_ALL_ISSUES),
        debounceTime(debounceInterval),
        switchMap(({ payload, type }) =>
            ajax({
                url: `${baseUrl}tier2/issues/current`,
                ...requestConfig
            }).pipe(
                pluck('response'),
                pluck('data'),
                map(issues => allIssuesLoadedAction(issues)),
                catchError(error => handleError(error, type))
            )
        )
    )

const loadIssuesEpic = action$ =>
    action$.pipe(
        ofType(LOAD_ISSUES),
        debounceTime(debounceInterval),
        flatMap(({ payload, collectionName, type }) =>
            ajax({
                url: `${baseUrl}tier2/issues/unresolved${payload}`,
                ...requestConfig
            }).pipe(
                pluck('response'),
                pluck('data'),
                map(issues => issuesLoadedAction(issues, collectionName)),
                catchError(error => handleError(error, type))
            )
        )
    )

const loadFollowUpIssuesEpic = action$ =>
    action$.pipe(
        ofType(LOAD_FOLLOW_UP_ISSUES),
        debounceTime(debounceInterval),
        switchMap(({ payload, type }) =>
            ajax({
                url: `${baseUrl}tier2/issues/needsfollowup`,
                ...requestConfig
            }).pipe(
                pluck('response'),
                pluck('data'),
                map(issues => followUpIssuesLoadedAction(issues)),
                catchError(error => handleError(error, type))
            )
        )
    )

const loadUsersEpic = action$ =>
    action$.pipe(
        ofType(LOAD_USERS),
        flatMap(({ type }) =>
            ajax({
                url: `${baseUrl}employees/status/tier2`,
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
        flatMap(({ payload, issueId, type }) =>
            ajax.post(
                `${baseUrl}tier2/issues/${issueId}/resolve?async=true&notes=${payload}`,
            ).pipe(
                pluck('response'),
                mergeMap(issue =>
                    of(
                        issueResolvedAction(issue),
												loginRequestAction(),
                        loadAllIssuesAction(),
                        loadFollowUpIssuesAction(),
                        loadUsersAction()
                    )
                ),
                catchError(error => handleError(error, type))
            )
        )
    )

const markFollowUpEpic = action$ =>
    action$.pipe(
        ofType(MARK_FOLLOW_UP),
        flatMap(({ issueId, payload, type }) =>
            ajax.post(
                `${baseUrl}tier2/issues/${issueId}/needsfollowup?async=true&notes=${payload}`,
            ).pipe(
                pluck('response'),
                mergeMap(issue =>
                    of(
                        followUpMarkedAction(issue),
												loginRequestAction(),
                        loadAllIssuesAction(),
                        loadUsersAction()
                    )
                ),
                catchError(error => handleError(error, type))
            )
        )
    )

const claimIssueEpic = (action$, state$) =>
    action$.pipe(
        ofType(CLAIM_ISSUE),
        flatMap(({ payload, type }) =>
            ajax.post(
                `${baseUrl}tier2/issues/${payload}/claim?async=true`,
            ).pipe(
                pluck('response'),
                mergeMap(issue =>
                    of(
                        issueClaimedAction(issue),
												loginRequestAction(),
                        loadAllIssuesAction(),
                        loadUsersAction()
                    )
                ),
                catchError(error => handleError(error, type))
            )
        )
    )

const assignIssueEpic = action$ =>
    action$.pipe(
        ofType(ASSIGN_ISSUE),
        switchMap(({ payload, assignTo, type }) =>
            ajax.post(
                `${baseUrl}tier2/issues/${payload}/assign/${assignTo}?async=true`,
                responseConfig
            ).pipe(
                pluck('response'),
                mergeMap(issue =>
                    of(
                        issueAssignedAction(issue),
												loginRequestAction(),
                        loadAllIssuesAction(),
                        loadUsersAction()
                    )
                ),
                catchError(error => handleError(error, type))
            )
        )
    )

const unassignIssueEpic = action$ =>
    action$.pipe(
        ofType(UNASSIGN_ISSUE),
        switchMap(({ payload, type }) =>
            ajax.post(
                `${baseUrl}tier2/issues/${payload}/unassign?async=true`,
                responseConfig
            ).pipe(
                pluck('response'),
                mergeMap(issue =>
                    of(
                        issueUnassignedAction(issue),
												loginRequestAction(),
                        loadAllIssuesAction(),
                        loadUsersAction()
                    )
                ),
                catchError(error => handleError(error, type))
            )
        )
    )

const clearMessagesEpic = (action$, state$) =>
    action$.pipe(
        ofType(CLEAR_MESSAGES),
        switchMap(({ type }) =>
            from(state$).pipe(
                pluck('messages'),
                distinctUntilChanged(),
                concatMap(message =>
                    from(message).pipe(
                        mergeMap(message =>
                            ajax.post(
                                process.env.REACT_APP_SLACK_URL,
                                bugMessage(message.text.name, message.actionSource, state$.value.currentUser.FullName),
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

const changeStatusEpic = (action$, state$) =>
    action$.pipe(
        ofType(CHANGE_STATUS),
        debounceTime(debounceInterval),
        switchMap(({ payload, type }) =>
            ajax.post(
                `${baseUrl}employees/${state$.value.currentUser.ID}/status/${payload}?async=true`,
                responseConfig
            ).pipe(
                pluck('response'),
                mergeMap(() =>
                    of(
                        statusChangedAction(),
                        loginRequestAction(),
                        loadUsersAction()
                    )
                ),
                catchError(error => handleError(error, type))
            )
        )
    )

export const rootEpic = combineEpics(loginRequestEpic,
    loadAllIssuesEpic,
    loadFollowUpIssuesEpic,
    loadIssuesEpic,
    loadUsersEpic,
    resolveIssueEpic,
    markFollowUpEpic,
    claimIssueEpic,
    assignIssueEpic,
    unassignIssueEpic,
    clearMessagesEpic,
    changeStatusEpic)