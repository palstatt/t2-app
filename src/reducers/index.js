import {
  ALL_ISSUES_LOADED,
  ASSIGN_ISSUE,
  CLAIM_ISSUE,
  CLEAR_MESSAGES,
  ERROR_QUERY,
  ISSUES_LOADED,
  ISSUE_RESOLVED,
  LOAD_ALL_ISSUES,
  LOAD_ISSUES,
  LOAD_USERS,
  LOGIN_FULFILLED,
  LOGIN_REQUEST,
  MESSAGE_CLEARED,
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
  currentUser: {},
  lastLoaded: null,
}

export default function issuesReducer(state = initialState, action) {
  switch(action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case LOGIN_FULFILLED:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
      }
    case LOAD_ISSUES:
    case LOAD_ALL_ISSUES:
      return {
        ...state,
        loading: true,
      }
    case ALL_ISSUES_LOADED:
      return {
        ...state,
        loading: false,
        unclaimedIssues: action.payload.filter(({claimed}) => !claimed),
        claimedIssues: action.payload.filter(({claimed}) => claimed),
        lastLoaded: action.loadedAt,
      }
    case ERROR_QUERY:
      return {
        ...state,
        messages: [
          ...state.messages,
          { type: 'error', text: action.payload, actionSource: action.actionSource }
        ],
      }
    case ISSUES_LOADED:
      return {
        ...state,
        loading: false,
        [action.collectionName]: action.payload,
        lastLoaded: action.loadedAt,
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
        users: [...action.payload]
      }
    case CLAIM_ISSUE:
      return {
        ...state,
        unclaimedIssues: state.unclaimedIssues.filter(({id}) => id !== action.payload),
      }
    case ASSIGN_ISSUE:
      return {
        ...state,
        unclaimedIssues: state.unclaimedIssues.filter(({id}) => id !== action.payload),
      }
    case CLEAR_MESSAGES:
      return {
        ...state,
        loading: true,
      }
    case MESSAGE_CLEARED:
      return {
        ...state,
        loading: false,
        messages: state.messages.filter(message => message !== action.payload),
      }
    default:
      return state
  }
}
