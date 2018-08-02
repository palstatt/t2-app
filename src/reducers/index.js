import {
    ALL_ISSUES_LOADED,
    ASSIGN_ISSUE,
    CHANGE_STATUS,
    CLAIM_ISSUE,
    CLEAR_MESSAGES,
    ERROR_QUERY,
    FOLLOW_UP_MARKED,
    ISSUES_LOADED,
    ISSUE_ASSIGNED,
    ISSUE_CLAIMED,
    ISSUE_RESOLVED,
    ISSUE_UNASSIGNED,
    LOAD_ALL_ISSUES,
    LOAD_ISSUES,
    LOAD_FOLLOW_UP_ISSUES,
    FOLLOW_UP_ISSUES_LOADED,
    LOAD_USERS,
    LOGIN_FULFILLED,
    LOGIN_REQUEST,
    MARK_FOLLOW_UP,
    MESSAGE_CLEARED,
    NAVIGATE_TO_PAGE,
    RESOLVE_ISSUE,
    STATUS_CHANGED,
    UNASSIGN_ISSUE,
    USERS_LOADED
} from '../actions';

const initialState = {
    loading: false,
    messages: [],
    unclaimedIssues: [],
    claimedIssues: [],
    resolvedIssues: [],
    followUpIssues: [],
    users: [],
    currentUser: {},
    lastLoaded: null,
    currentPage: 'issuesQueue'
}

const filterIssues = (data, logic) => {
    if (data) {
        return data.filter(logic)
    }
    return []
}

export default function issuesReducer(state = initialState, action) {
    switch (action.type) {
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
                unclaimedIssues: filterIssues(action.payload, issue => issue.IssueStatus.id === 1),
                claimedIssues: filterIssues(action.payload, issue => issue.IssueStatus.id === 2),
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
        case LOAD_FOLLOW_UP_ISSUES:
            return {
                ...state,
                loading: true,
            }
        case FOLLOW_UP_ISSUES_LOADED:
            return {
                ...state,
                loading: false,
                followUpIssues: action.payload,
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
                unclaimedIssues: state.unclaimedIssues.filter(({ id }) => id !== action.payload),
                loading: true,
            }
        case ISSUE_CLAIMED:
            return {
                ...state,
                loading: false,
            }
        case ASSIGN_ISSUE:
            return {
                ...state,
                unclaimedIssues: state.unclaimedIssues.filter(({ id }) => id !== action.payload),
                loading: true,
            }
        case ISSUE_ASSIGNED:
            return {
                ...state,
                loading: false,
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
        case CHANGE_STATUS:
            return {
                ...state,
                loading: true,
                currentUser: {
                    ...state.currentUser, EmployeeStatus: {
                        ...state.currentUser.EmployeeStatus,
                        id: action.payload
                    },
                }
            }
        case STATUS_CHANGED:
            return {
                ...state,
                loading: false,
            }
        case UNASSIGN_ISSUE:
            return {
                ...state,
                loading: true,
                claimedIssues: state.claimedIssues.filter(({ id }) => id !== action.payload),
            }
        case ISSUE_UNASSIGNED:
            return {
                ...state,
                loading: false,
            }
        case MARK_FOLLOW_UP:
            return {
                ...state,
                loading: true,
                claimedIssues: state.claimedIssues.filter(({ id }) => id !== action.payload),
            }
        case FOLLOW_UP_MARKED:
            return {
                ...state,
                loading: false,
            }
        case NAVIGATE_TO_PAGE:
            return {
                ...state,
                currentPage: action.payload,
            }
        default:
            return state
    }
}