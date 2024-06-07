function executeShellCommandsOnInstance(ssm, commands) {
    const params = {
        DocumentName: 'AWS-RunShellScript',
        InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
        Parameters: {
            'commands': commands,
        },
    }

    ssm.sendCommand(params, (err, data) => {
        if (err) {
            console.log(err, err.stack)
        } else {
            setTimeout(() => {
                const commandId = data.Command.CommandId

                ssm.getCommandInvocation({
                    CommandId: commandId,
                    InstanceId: process.env.OPENVPN_INSTANCE_ID,
                }, (err, data) => {
                    if (err) {
                        console.log(err, err.stack)
                    } else {
                        console.log(data.StandardOutputContent)
                    }
                })
            }, 5000)
        }
    })
}

module.exports = {
    executeShellCommandsOnInstance
}