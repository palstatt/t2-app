export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_FULFILLED = 'LOGIN_FULFILLED'
export const LOAD_ISSUES = 'LOAD_ISSUES'
export const LOAD_ALL_ISSUES = 'LOAD_ALL_ISSUES'
export const ALL_ISSUES_LOADED = 'ALL_ISSUES_LOADED'
export const LOAD_FOLLOW_UP_ISSUES = 'LOAD_FOLLOW_UP_ISSUES'
export const FOLLOW_UP_ISSUES_LOADED = 'FOLLOW_UP_ISSUES_LOADED'
export const ERROR_QUERY = 'ERROR_QUERY'
export const RESOLVE_ISSUE = 'RESOLVE_ISSUE'
export const ISSUES_LOADED = 'ISSUES_LOADED'
export const ISSUE_RESOLVED = 'ISSUE_RESOLVED'
export const LOAD_USERS = 'LOAD_USERS'
export const USERS_LOADED = 'USERS_LOADED'
export const CLAIM_ISSUE = 'CLAIM_ISSUE'
export const ISSUE_CLAIMED = 'ISSUE_CLAIMED'
export const ASSIGN_ISSUE = 'ASSIGN_ISSUE'
export const ISSUE_ASSIGNED = 'ISSUE_ASSIGNED'
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES'
export const MESSAGE_CLEARED = 'MESSAGE_CLEARED'
export const CHANGE_STATUS = 'CHANGE_STATUS'
export const STATUS_CHANGED = 'STATUS_CHANGED'
export const UNASSIGN_ISSUE = 'UNASSIGN_ISSUE'
export const ISSUE_UNASSIGNED = 'ISSUE_UNASSIGNED'
export const MARK_FOLLOW_UP = 'MARK_FOLLOW_UP'
export const FOLLOW_UP_MARKED = 'FOLLOW_UP_MARKED'
export const NAVIGATE_TO_PAGE = 'NAVIGATE_TO_PAGE'

export const loginRequestAction = () => (
  {
    type: LOGIN_REQUEST,
  }
)

export const loginFulfilledAction = (user) => (
  {
    type: LOGIN_FULFILLED,
    payload: user,
  }
)

export const loadIssuesAction = (filter, collectionName) => (
  {
    type: LOAD_ISSUES,
    payload: `issues?${filter}`,
    collectionName: collectionName,
  }
)

export const loadAllIssuesAction = () => (
  {
    type: LOAD_ALL_ISSUES,
  }
)

export const allIssuesLoadedAction = (issues) => (
  {
    type: ALL_ISSUES_LOADED,
    payload: issues,
    loadedAt: Date.now(),
  }
)

export const errorQueryAction = (error, action) => (
  {
    type: ERROR_QUERY,
    payload: error,
    actionSource: action,
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

export const resolveIssueAction = (notes, id) => (
  {
    type: RESOLVE_ISSUE,
    payload: notes,
		issueId: id,
 }
)

export const issueResolvedAction = (issue) => (
  {
    type: ISSUE_RESOLVED,
    payload: issue,
  }
)

export const loadUsersAction = () => (
  {
    type: LOAD_USERS,
  }
)

export const usersLoadedAction = (users) => (
  {
    type: USERS_LOADED,
    payload: users,
  }
)

export const loadFollowUpIssuesAction = () => (
  {
    type: LOAD_FOLLOW_UP_ISSUES,
  }
)

export const followUpIssuesLoadedAction = (issues) => (
  {
    type: FOLLOW_UP_ISSUES_LOADED,
    payload: issues,
    loadedAt: Date.now(),
  }
)

export const claimIssueAction = (id) => (
  {
    type: CLAIM_ISSUE,
    payload: id,
  }
)

export const issueClaimedAction = (issue) => (
  {
    type: ISSUE_CLAIMED,
    payload: issue,
  }
)

export const assignIssueAction = (issueID, techID) => (
  {
    type: ASSIGN_ISSUE,
    payload: issueID,
    assignTo: techID,
  }
)

export const issueAssignedAction = (issue) => (
  {
    type: ISSUE_ASSIGNED,
    payload: issue,
  }
)

export const clearMessagesAction = () => (
  {
    type: CLEAR_MESSAGES,
  }
)

export const messageClearedAction = (message) => (
   {
     type: MESSAGE_CLEARED,
     payload: message,
   }
)

export const changeStatusAction = (statusId) => (
  {
    type: CHANGE_STATUS,
    payload: statusId,
  }
)

export const statusChangedAction = () => (
  {
		type: STATUS_CHANGED,
  }
)

export const unassignIssueAction = (id) => (
	{
		type: UNASSIGN_ISSUE,
		payload: id,
	}
)

export const issueUnassignedAction = () => (
	{
		type: ISSUE_UNASSIGNED,
	}
)

export const markFollowUpAction = (id, notes) => (
	{
		type: MARK_FOLLOW_UP,
		issueId: id,
		payload: notes,
	}
)

export const followUpMarkedAction = () => (
	{
		type: FOLLOW_UP_MARKED,
	}
)

export const navigateToPageAction = (page) => (
  {
    type: NAVIGATE_TO_PAGE,
    payload: page,
  }
)
