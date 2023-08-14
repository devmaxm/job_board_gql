import {useMutation, useQuery} from "@apollo/client";
import {companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery} from "./graphql/queries";

export function useCompany(id) {
    const {data, loading, error} = useQuery(companyByIdQuery, {variables: {id}})
    return {company: data?.company, loading, error}
}

export function useJobs(limit, offset) {
    const {data, loading, error} = useQuery(jobsQuery, {
        variables: {limit, offset}
    })
    return {jobs: data?.jobs, loading, error}
}

export function useJob(id) {
    const {data, loading, error} = useQuery(jobByIdQuery, {variables: {id}})
    return {job: data?.job, loading, error}
}

export function useCreateJob(title, description) {
    const [mutate, {loading}] = useMutation(createJobMutation)

    async function createJob(title, description) {
        const {data: {job}} = await mutate({
            variables: {input: {title, description}},
            update: (cache, {data}) => {
                cache.writeQuery({
                    query: jobByIdQuery,
                    variables: {id: data.job.id},
                    data
                })
            }
        })
        return job
    }

    return {loading, createJob}
}