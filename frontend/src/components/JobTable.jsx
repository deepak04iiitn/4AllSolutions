import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Tooltip, Pagination, TextInput, Select } from 'flowbite-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const truncateDescription = (description, wordLimit) => {
    if (typeof description !== "string" || !description.trim() || description === "Not Available") {
        return "No description available";
    }

    const words = description.split(" ");
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const formatUrlString = (company, title) => {
    const formatString = (str) => str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

    return `${formatString(company)}-${formatString(title)}`;
};

const isRecent = (dateStr) => {
    const jobDate = new Date(dateStr);
    const now = new Date();
    const hoursDifference = Math.floor((now - jobDate) / (1000 * 60 * 60));
    return hoursDifference <= 24;
};

const formatDateForComparison = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export default function JobTable() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [jobs, setJobs] = useState(() => {
        // Try to load jobs from sessionStorage on initial render
        const cachedJobs = sessionStorage.getItem('cachedJobs');
        return cachedJobs ? JSON.parse(cachedJobs) : [];
    });

    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const jobsPerPage = 10;
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
    const [minExpFilter, setMinExpFilter] = useState(searchParams.get('exp') || '');
    const [searchPage, setSearchPage] = useState(searchParams.get('page') || '');
    const [searchDate, setSearchDate] = useState(searchParams.get('date') || '');
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
    const [totalPages, setTotalPages] = useState(1);
    const [isFilterChange, setIsFilterChange] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const {currentUser} = useSelector((state) => state.user);

    // Add a ref to track if initial load is complete
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(() => {
        return sessionStorage.getItem('jobsLoadComplete') === 'true';
    });

    // Safe string check helper
    const safeString = (value) => {
        return typeof value === 'string' ? value.toLowerCase() : '';
    };

    // Update URL when filters change
    const updateSearchParams = (updates) => {
        const newSearchParams = new URLSearchParams(searchParams);
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newSearchParams.set(key, value);
            } else {
                newSearchParams.delete(key);
            }
        });
        
        setSearchParams(newSearchParams);
        
        if (updates.hasOwnProperty('page')) {
            setSearchPage(updates.page);
        }
    };

    const handleFilterChange = (updates) => {
        setIsFilterChange(true);
        updateSearchParams({ ...updates, page: '1' });
    };

    const handleSearchKeywordChange = (value) => {
        setSearchKeyword(value);
        handleFilterChange({ search: value });
    };

    const handleMinExpChange = (value) => {
        setMinExpFilter(value);
        handleFilterChange({ exp: value });
    };

    const handleDateChange = (value) => {
        setSearchDate(value);
        handleFilterChange({ date: value });
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        handleFilterChange({ category: value });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSearchPage(page.toString());
        updateSearchParams({ page: page.toString() });
    };

    const clearAllFilters = () => {
        setSearchKeyword('');
        setMinExpFilter('');
        setSearchDate('');
        setCategoryFilter('');
        setCurrentPage(1);
        setSearchPage('1');
        setIsFilterChange(true);
        setSearchParams(new URLSearchParams());
    };

    const handleApplyClick = (id, company, title) => {
        const formattedUrl = formatUrlString(company, title);
        const currentParams = new URLSearchParams(window.location.search);
        navigate(`/fulljd/${formattedUrl}/${id}?${currentParams.toString()}`);
    };

    const handleSearchByPage = () => {
        const pageNum = parseInt(searchPage);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            handlePageChange(pageNum);
        } else {
            alert(`Please enter a valid page number between 1 and ${totalPages}`);
        }
    };

    // Fetch initial data
    useEffect(() => {
        const fetchJobsProgressively = async () => {
            // Check if we already have cached data for this user
            const cachedUserKey = sessionStorage.getItem('cachedUserKey');
            const currentUserKey = currentUser?.id || 'guest'; // Use appropriate user identifier

            // If we have complete data for the current user, don't fetch again
            if (isInitialLoadComplete && cachedUserKey === currentUserKey && jobs.length > 0) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const jobsResponse = await axios.get("/backend/naukri");

                const processedJobs = jobsResponse.data
                    .filter(item => item.apply_link && item.apply_link !== "Not Found") 
                    .map(item => ({
                        ...item,
                        _id: item._id,
                        job_title: item.job_title || "Unknown",
                        min_exp: parseFloat(item.min_exp) || 0,
                        company: item.company || "Unknown",
                        location: Array.isArray(item.location) && item.location.length > 0 
                            ? item.location.join(" / ") 
                            : "Unknown",
                        jd: item.full_jd || "",
                        date: new Date(item.time).toISOString(),
                        apply_link: item.apply_link,
                        category: item.category || ""
                    }))
                    .filter(job => job._id);

                // Sort jobs by date
                processedJobs.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Update jobs in batches
                const batchSize = 5;
                const updateJobsInBatches = (jobs) => {
                    return new Promise((resolve) => {
                        const batch = jobs.slice(0, batchSize);
                        const remainingJobs = jobs.slice(batchSize);

                        setJobs(prevJobs => {
                            const updatedJobs = [...prevJobs, ...batch];
                            // Cache the updated jobs
                            sessionStorage.setItem('cachedJobs', JSON.stringify(updatedJobs));
                            return updatedJobs;
                        });

                        if (remainingJobs.length > 0) {
                            setTimeout(() => {
                                updateJobsInBatches(remainingJobs).then(resolve);
                            }, 100);
                        } else {
                            resolve();
                        }
                    });
                };

                await updateJobsInBatches(processedJobs);

                // Mark load as complete and cache user key
                sessionStorage.setItem('jobsLoadComplete', 'true');
                sessionStorage.setItem('cachedUserKey', currentUserKey);
                setIsInitialLoadComplete(true);

                const totalPages = Math.ceil(processedJobs.length / jobsPerPage);
                const pageFromUrl = parseInt(searchParams.get('page')) || 1;
                
                if (pageFromUrl > totalPages) {
                    setCurrentPage(totalPages);
                    updateSearchParams({ page: totalPages.toString() });
                } else {
                    setCurrentPage(pageFromUrl);
                }
                
                setTotalPages(totalPages);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setJobs([]);
                setFilteredJobs([]);
                setTotalPages(1);
                setIsLoading(false);
            }
        };

        fetchJobsProgressively();
    }, [currentUser]); // Only depend on currentUser

    // Add cleanup on user logout or session end
    useEffect(() => {
        if (!currentUser) {
            // Clear cached data when user logs out
            sessionStorage.removeItem('cachedJobs');
            sessionStorage.removeItem('jobsLoadComplete');
            sessionStorage.removeItem('cachedUserKey');
            setIsInitialLoadComplete(false);
            setJobs([]);
        }
    }, [currentUser]);


    // Filter jobs effect 
    useEffect(() => {
        const filtered = jobs.filter(job => {
            const keyword = searchKeyword.toLowerCase();
            
            const matchesSearch = !keyword || (
                safeString(job.title).includes(keyword) ||
                safeString(job.company).includes(keyword) ||
                safeString(job.location).includes(keyword) ||
                safeString(job.jd).includes(keyword)
            );

            let matchesMinExp = true;
            if (minExpFilter !== '') {
                const minExpValue = parseFloat(minExpFilter);
                const jobExp = parseFloat(job.min_exp) || 0;
                matchesMinExp = !isNaN(minExpValue) && jobExp == minExpValue;
            }

            const jobDate = job.date ? formatDateForComparison(job.date) : '';
            const searchDateFormatted = searchDate ? formatDateForComparison(searchDate) : '';
            const matchesDate = !searchDate || jobDate === searchDateFormatted;

            const matchesCategory = !categoryFilter || 
                safeString(job.category) === safeString(categoryFilter);

            return matchesSearch && matchesMinExp && matchesDate && matchesCategory;
        });

        setFilteredJobs(filtered);
        const newTotalPages = Math.ceil(filtered.length / jobsPerPage);
        setTotalPages(newTotalPages);

        // Only reset page if filters were explicitly changed and current page is out of bounds
        if (isFilterChange && currentPage > newTotalPages) {
            setCurrentPage(1);
            updateSearchParams({ page: '1' });
        }
        setIsFilterChange(false);
    }, [searchKeyword, minExpFilter, searchDate, categoryFilter, jobs]);

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const currentJobs = filteredJobs.slice(startIndex, endIndex);

    return (
        
        <div className="w-full bg-gray-100 dark:bg-gray-900 p-4">

            <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                "Explore, Apply, Succeed: Your Career Starts Here!"
            </h2>

            {/* Filter controls */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <TextInput
                    placeholder="🔍 Search by any keywords..."
                    value={searchKeyword}
                    onChange={(e) => handleSearchKeywordChange(e.target.value)}
                    className="w-full"
                />

                <TextInput
                    type="number"
                    placeholder="Min Experience (years)"
                    value={minExpFilter}
                    onChange={(e) => handleMinExpChange(e.target.value)}
                    className="w-full"
                />

                <TextInput
                    type="date"
                    placeholder="Search by date"
                    value={searchDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full"
                />

                <Select
                    value={categoryFilter}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full"
                >
                    <option value="">All Categories</option>
                    <option value="qa">QA</option>
                    <option value="developer">Developer</option>
                    <option value="devops">DevOps</option>
                    <option value="intern">Intern</option>
                </Select>

                <TextInput
                    placeholder={`Go to page (1-${totalPages})...`}
                    value={searchPage}
                    onChange={(e) => setSearchPage(e.target.value)}
                    className="w-full"
                />

                <Button onClick={handleSearchByPage} className="w-full">
                    Go to Page
                </Button>

                <Button 
                    onClick={clearAllFilters}
                    className="w-full bg-red-500 hover:bg-red-600"
                >
                    Clear Filters
                </Button>
            </div>


            {isLoading && jobs.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading jobs...
                    </p>
                    {/* Optional: Add a loading spinner */}
                    <div role="status" className="flex justify-center my-4">
                        <svg 
                            aria-hidden="true" 
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" 
                            viewBox="0 0 100 101" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" 
                                fill="currentColor"
                            />
                            <path 
                                d="M93.9676 39.0409C96.393 38.4168 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.3902C85.8452 15.192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.084 38.2158 91.5421 39.6781 93.9676 39.0409Z" 
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                        {/* Desktop Table - Hidden on small screens */}
                        <div className="hidden sm:block overflow-x-auto">
                            <Table hoverable className="w-full shadow-lg bg-white rounded-lg overflow-hidden">
                                <Table.Head className="bg-blue-800 text-gray-800">
                                    <Table.HeadCell>S.No.</Table.HeadCell>
                                    <Table.HeadCell>Job Title</Table.HeadCell>
                                    <Table.HeadCell>Company</Table.HeadCell>
                                    <Table.HeadCell>Location</Table.HeadCell>
                                    <Table.HeadCell>Date</Table.HeadCell>
                                    <Table.HeadCell>Min Exp</Table.HeadCell>
                                    <Table.HeadCell>Apply Now</Table.HeadCell>
                                </Table.Head>
    
                                <Table.Body className="divide-y">
                                    {currentJobs.map((job, index) => (
                                        <Table.Row key={job._id} className="transition-transform duration-300 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
                                            <Table.Cell className="p-4 text-gray-900 dark:text-gray-100">
                                                <Tooltip content={job.title}>
                                                    {startIndex + index + 1}
                                                </Tooltip>
                                            </Table.Cell>
    
                                            <Table.Cell className="p-4 text-gray-900 dark:text-gray-100">
                                                <Tooltip content={job.jd}>
                                                    <div className="flex items-center">
                                                        {isRecent(job.date) && (
                                                            <span className="glowing-badge text-xs font-semibold text-white bg-red-500 rounded-full px-2 py-1 mr-2">
                                                                New
                                                            </span>
                                                        )}
                                                        {job.title}
                                                    </div>
                                                </Tooltip>
                                            </Table.Cell>
    
                                            <Table.Cell className="p-4 text-gray-900 dark:text-gray-100">
                                                <Tooltip content={job.jd}>
                                                    {job.company}
                                                </Tooltip>
                                            </Table.Cell>
    
                                            <Table.Cell className="p-4 text-gray-900 dark:text-gray-100">
                                                <Tooltip content={job.jd}>
                                                    {job.location}
                                                </Tooltip>
                                            </Table.Cell>
    
                                            <Table.Cell className="p-4 text-gray-900 dark:text-gray-100">
                                                <Tooltip content={job.jd}>
                                                    {formatDate(job.date)}
                                                </Tooltip>
                                            </Table.Cell>
    
                                            <Table.Cell className="p-4 text-gray-900 dark:text-gray-100">
                                                <Tooltip content={job.jd}>
                                                    {job.min_exp} years
                                                </Tooltip>
                                            </Table.Cell>
    
                                            <Table.Cell className="p-4">
                                                <Button
                                                    className="apply-button"
                                                    onClick={() => handleApplyClick(job._id, job.company, job.title)}
                                                >
                                                    Apply
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
    
                        {/* Mobile Table - Shown only on small screens */}
                        <div className="block sm:hidden">
                            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                                <thead className="bg-blue-800 text-white">
                                    <tr>
                                        <th className="p-4 w-16">S.No.</th>
                                        <th className="p-4">Job Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {currentJobs.map((job, index) => (
                                        <tr key={job._id} className="hover:bg-blue-50">
                                            <td className="p-4 text-center align-top">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        {isRecent(job.date) && (
                                                            <span className="glowing-badge text-xs font-semibold text-white bg-red-500 rounded-full px-2 py-1">
                                                                New
                                                            </span>
                                                        )}
                                                        <h3 className="font-semibold text-lg">
                                                            {job.title}
                                                        </h3>
                                                    </div>
    
                                                    <div className="text-gray-600">
                                                        <span className="font-medium">Company:</span> {job.company}
                                                    </div>
    
                                                    <div className="text-gray-600">
                                                        <span className="font-medium">Location:</span> {job.location}
                                                    </div>
    
                                                    <div className="text-gray-600">
                                                        <span className="font-medium">Experience:</span> {job.min_exp} years
                                                    </div>
    
                                                    <div className="text-gray-600">
                                                        <span className="font-medium">Posted:</span> {formatDate(job.date)}
                                                    </div>
    
                                                    <div className="pt-2">
                                                        <Button
                                                            onClick={() => handleApplyClick(job._id, job.company, job.title)}
                                                            className="w-full"
                                                        >
                                                            Apply Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
    
                        <div className="flex justify-center mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                className="bg-blue-500 text-white rounded-lg"
                            />
                        </div>
                    </>
            )}

            

            <style jsx>{`
                .glowing-badge {
                    animation: glowing 1.5s infinite;
                }

                @keyframes glowing {
                    0% { box-shadow: 0 0 5px #ff0000; }
                    50% { box-shadow: 0 0 20px #ff0000; }
                    100% { box-shadow: 0 0 5px #ff0000; }
                }

                .apply-button {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    background-color: #3b82f6;
                    color: #ffffff;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }

                .apply-button:hover {
                    background-color: #2563eb;
                    transform: scale(1.05);
                }

                .apply-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </div>
    );
};