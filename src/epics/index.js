import { Observable } from 'rxjs-compat'
import { combineEpics } from 'redux-observable'

import {
  CLAIM_ISSUE,
  LOAD_USERS,
  LOAD_ISSUES,
  RESOLVE_ISSUE,
  usersLoadedAction,
  errorLoadIssuesAction,
  issueResolvedAction,
  issuesLoadedAction,
  issueClaimedAction
} from '../actions';

//ajax functions
const avatarAPI = (techName) => {
  return `${process.env.REACT_APP_API_URL}/users?name=${techName}`
}

const fetchIssueData = (target) => {

}

//epics
const loadIssuesEpic = action$ =>
  action$.ofType(LOAD_ISSUES)
    .mergeMap(({payload, collectionName}) =>
      Observable.ajax.getJSON(`${process.env.REACT_APP_API_URL}/${payload}`)
        .map(res => issuesLoadedAction(res, collectionName))
        .catch(error =>
          Observable.of(errorLoadIssuesAction(error.xhr.response))
        )
    )


const loadAvatarsEpic = action$ =>
  action$.ofType(LOAD_USERS)
    .switchMap(({payload}) =>
      Observable.ajax.getJSON(`${process.env.REACT_APP_API_URL}/users`)
        .switchMap(res =>
          Observable.from(res)
            .map(url => usersLoadedAction(url))
        )
    )


const resolveIssueEpic = action$ =>
   action$.ofType(RESOLVE_ISSUE)
    .switchMap(({payload}) =>
      Observable.ajax.patch(`${process.env.REACT_APP_API_URL}/issues/${payload}`, {"resolved": "true"})
        .map(({response}) =>
          issueResolvedAction(response)
        )
    )

const claimIssueEpic = action$ =>
  action$.ofType(CLAIM_ISSUE)
    .switchMap(({payload}) =>
      Observable.ajax.patch(`${process.env.REACT_APP_API_URL}/issues/${payload}`, {"claimed": "true"})
        .map(({response}) =>
          issueClaimedAction(response)
      )
  )


export const rootEpic = combineEpics(loadIssuesEpic, loadAvatarsEpic, resolveIssueEpic, claimIssueEpic)
