import { colors } from 'is-ui-library'

export const bugMessage = (error, action, user) => {
  return JSON.stringify({
    text: '*NEW BUG REPORTED*',
    attachments: [
      {
      title: error,
      text: `Error from action type: \`\`\`${action}\`\`\`\nReported by user *${user}*`,
      mrkdwn_in: ['text'],
      color: colors.warning,
      ts: Math.round((new Date()).getTime() / 1000)
      }
    ],
  })
}
