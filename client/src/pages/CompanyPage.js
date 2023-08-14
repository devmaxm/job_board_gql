import {useParams} from 'react-router';
import JobList from "../components/JobList";
import {useCompany} from "../lib/hooks";



function CompanyPage() {
    const {companyId} = useParams();
    const {company, loading, error} = useCompany(companyId)

    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Data unavailable</div>
    }
    if (!company) {
        return <div>Not found!</div>
    }
    return (
        <div>
            <h1 className="title">
                {company.name}
            </h1>
            <div className="box">
                {company.description}
            </div>
            <h1>Jobs at {company.name}</h1>
            <JobList jobs={company.jobs}/>
        </div>
    );
}

export default CompanyPage;
