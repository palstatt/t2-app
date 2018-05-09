import {
  ASSIGN_ISSUE,
  CLAIM_ISSUE,
  ERROR_LOAD_ISSUES,
  ISSUES_LOADED,
  ISSUE_RESOLVED,
  LOAD_ISSUES,
  LOAD_USERS,
  LOAD_ALL_ISSUES,
  RESOLVE_ISSUE,
  USERS_LOADED
} from '../actions';

const initialState = {
  loading: false,
  messages: [],
  unclaimedIssues: [],
  claimedIssues: [],
  resolvedIssues: [],
  users: [],
  lastLoaded: null,
}

export default function issuesReducer(state = initialState, action) {
  switch(action.type) {
    case LOAD_ISSUES:
    case LOAD_ALL_ISSUES:
      return {
        ...state,
        loading: true,
      }
    case ERROR_LOAD_ISSUES:
      return {
        ...state,
        messages: [{ type: 'error', text: action.payload }],
      }
    case ISSUES_LOADED:
      return {
        ...state,
        loading: false,
        [action.collectionName]: action.payload,
        messages: [],
        lastLoaded: action.loadedAt
      }
    case RESOLVE_ISSUE:
      return {
        ...state,
        loading: true,
        claimedIssues: state.claimedIssues.filter(({ id }) => id !== action.payload),
      }
    case ISSUE_RESOLVED:
      return {
        ...state,
        loading: false,
        resolvedIssues: [...state.resolvedIssues, action.payload],
      }
    case LOAD_USERS:
      return {
        ...state,
        loading: true,
      }
    case USERS_LOADED:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload]
      }
    case CLAIM_ISSUE:
      return {
        ...state,
        unclaimedIssues: state.unclaimedIssues.filter(({id}) => id !== action.payload),
      }
    case ASSIGN_ISSUE:
      return {
        ...state,
      }
    default:
      return state
  }
}
