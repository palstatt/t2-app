const formatMessage = (text, name) => {
    return JSON.stringify({
        attachments: [
            {
                title: `${name}'s feedback from ${document.location.href}`,
                title_link: document.location.href,
                text,
                color: '#06D6A0',
                ts: Math.round((new Date()).getTime() / 1000),
                footer: 'Feedback Button by Paul Stott'
            }
        ]
    })
}

export default formatMessage