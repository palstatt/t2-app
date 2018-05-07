export const LOAD_ISSUES = 'LOAD_ISSUES'
export const ERROR_LOAD_ISSUES = 'ERROR_LOAD_ISSUES'
export const RESOLVE_ISSUE = 'RESOLVE_ISSUE'
export const ISSUES_LOADED = 'ISSUES_LOADED'
export const ISSUE_RESOLVED = 'ISSUE_RESOLVED'
export const LOAD_USERS = 'LOAD_USERS'
export const USERS_LOADED = 'USERS_LOADED'
export const CLAIM_ISSUE = 'CLAIM_ISSUE'
export const ISSUE_CLAIMED = 'ISSUE_CLAIMED'

export const loadIssuesAction = (filter, collectionName) => (
  {
    type: LOAD_ISSUES,
    payload: `issues?${filter}`,
    collectionName: collectionName,
  }
)

export const errorLoadIssuesAction = (error) => (
  {
    type: ERROR_LOAD_ISSUES,
    payload: error.message,
  }
)


export const issuesLoadedAction = (issues, collectionName) => (
  {
    type: ISSUES_LOADED,
    payload: issues,
    collectionName: collectionName,
    loadedAt: Date.now(),
  }
)

export const resolveIssueAction = (id) => (
  {
    type: RESOLVE_ISSUE,
    payload: id
 }
)

export const issueResolvedAction = (issue) => (
  {
    type: ISSUE_RESOLVED,
    payload: issue
  }
)

export const loadUsersAction = (techName) => (
  {
    type: LOAD_USERS,
    payload: techName,
  }
)

export const usersLoadedAction = (user) => (
  {
    type: USERS_LOADED,
    payload: user
  }
)

export const claimIssueAction = (id) => (
  {
    type: CLAIM_ISSUE,
    payload: id
  }
)

export const issueClaimedAction = (issue) => (
  {
    type: ISSUE_CLAIMED,
    payload: issue
  }
)
