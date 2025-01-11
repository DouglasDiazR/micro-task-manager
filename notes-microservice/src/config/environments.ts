import * as joi from 'joi'
import 'dotenv/config'

interface EnvironmentsVariables {
    NATS_SERVER: string
}

const environmentsSchema = joi
    .object({
        NATS_SERVER: joi.string().required(),
    })
    .unknown()

const { error, value } = environmentsSchema.validate({
    ...process.env,
})

if (error) {
    throw new Error(`Environments error ${error.message}`)
}

const env: EnvironmentsVariables = value

export const environmentVariables = {
    natsServer: env.NATS_SERVER,
}
