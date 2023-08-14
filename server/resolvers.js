import {countJobs, createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob} from "./db/jobs.js";
import { getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql/error/index.js";

export const resolvers = {
    Query: {
        jobs: async (_root, {limit, offset}) => {
            const items = await getJobs(limit, offset)
            const totalCount = await countJobs()
            return {items, totalCount}
        },
        job: async (_root, {id}) => {
            const job = await getJob(id)
            if (!job) {
                NotFoundError(`No job found with id ${id}`)
            }
            return job
        },

        company: async (_root, {id}) => {
            const company = await getCompany(id)
            if (!company) {
                NotFoundError(`No company found with id ${id}`)
            }
            return company
        }
    },

    Mutation: {
        createJob: async (_root, {input: {title, description}}, {user}) => {
            if (!user) {
                UnauthorizedError('Unauthorized')
            }
            return createJob({companyId: user.companyId, description, title})
        },
        updateJob: async (_root, {input: {id, title, description}}, {user}) => {
            if (!user) {
                UnauthorizedError('Unauthorized')
            }
            const job = await updateJob({id, companyId: user.companyId, title, description})
            if (!job) {
                NotFoundError(`No job found with id: ${id}`)
            }
            return job
        },
        deleteJob: async (_root, {id}, {user}) => {
            console.log(user)
            if (!user) {
                UnauthorizedError('Unauthorized')
            }
            const job = await deleteJob(id, user.companyId)
            if (!job) {
                NotFoundError(`No job found with id: ${id}`)
            }
            return job
        }
    },

    Company: {
        jobs: async (company) => {
            return await getJobsByCompany(company.id)
        }

    },

    Job: {
        company: async (job, _args, {companyLoader}) => {
            return companyLoader.load(job.companyId)
        },
        date: (job) => {
            return job.createdAt
        }
    }
}

function NotFoundError(message) {
    throw new GraphQLError(message, {extensions: {code: "NOT_FOUND"}})
}

function UnauthorizedError(message) {
    throw new GraphQLError(message, {extensions: {code: "UNAUTHORIZED"}})
}