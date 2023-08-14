import JobList from '../components/JobList';
import {useJobs} from "../lib/hooks";
import {useState} from "react";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 7

function HomePage() {
    const [currentPage, setCurrentPage] = useState(1)
    const {jobs, error, loading} = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE)

    if (error) {
        return <div>Data unavailable...</div>
    }
    if (loading) {
        return <div>Loading...</div>
    }
    const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);
    return (
        <div>
            <h1 className="title">
                Job Board
            </h1>
            <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
            <JobList jobs={jobs.items}/>
        </div>
    );
}

export default HomePage;
