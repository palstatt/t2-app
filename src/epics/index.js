import { Observable } from 'rxjs-compat'
import { combineEpics } from 'redux-observable'

import {
  ASSIGN_ISSUE,
  CLAIM_ISSUE,
  LOAD_ISSUES,
  LOAD_USERS,
  RESOLVE_ISSUE,
  errorLoadIssuesAction,
  issueAssignedAction,
  issueClaimedAction,
  issueResolvedAction,
  issuesLoadedAction,
  loadIssuesAction,
  usersLoadedAction
} from '../actions';

//replace with logic to get current user login
const currentTechID = 37

//ajax functions
const avatarAPI = (techName) => {
  return `${process.env.REACT_APP_API_URL}/users?name=${techName}`
}

const fetchIssueData = (target) => {

}

//epics
const loadIssuesEpic = action$ =>
  action$.ofType(LOAD_ISSUES)
    .switchMap(({payload, collectionName}) =>
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
      Observable.ajax.patch(`${process.env.REACT_APP_API_URL}/issues/${payload}`, {
        "claimed": "true",
        "assigned_to": currentTechID
      })
        .map(({response}) =>
          issueClaimedAction(response)
      )
  )

const assignIssueEpic = action$ =>
  action$.ofType(ASSIGN_ISSUE)
    .switchMap(({payload, assignTo}) =>
      Observable.ajax.patch(`${process.env.REACT_APP_API_URL}/issues/${payload}`, {
        "claimed": `${assignTo === 0 ? 'false' : 'true'}`,
        "assigned_to": assignTo
      })
      .mergeMap(({response}) =>
        Observable.of(
          issueAssignedAction(response),
          loadIssuesAction('claimed=false', 'unclaimedIssues'),
          loadIssuesAction('claimed=true', 'claimedIssues')
        )
      )
  )

export const rootEpic = combineEpics(loadIssuesEpic,
                                     loadAvatarsEpic,
                                     resolveIssueEpic,
                                     claimIssueEpic,
                                     assignIssueEpic)
