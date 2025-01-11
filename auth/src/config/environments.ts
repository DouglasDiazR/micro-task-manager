import 'dotenv/config'
import * as joi from 'joi'

interface EnvironmentVariables {
    NATS_SERVER: string
    JWT_SECRET: string
}

const environmentSchema = joi
    .object({
        NATS_SERVER: joi.string().required(),
        JWT_SECRET: joi.string().required(),
    })
    .unknown()

const { error, value } = environmentSchema.validate({
    ...process.env,
})

if (error) {
    throw new Error(`Environments error ${error}`)
}

const env: EnvironmentVariables = value

export const environmentVariables = {
    natsServer: env.NATS_SERVER,
    jwtSecret: env.JWT_SECRET,
}
