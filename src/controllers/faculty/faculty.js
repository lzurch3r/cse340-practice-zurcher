import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyListPage = (req, res) => {
    const sortBy = req.query.sort || 'name'; // Default sort is 'name'
    const faculty = getSortedFaculty(sortBy); //Returns an array of sorted faculty members

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: faculty,
        currentSort: sortBy
    });
};

// Route handler for individual faculty detail pages
const facultyDetailsPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // If faculty doesn't exist, create 404 error
    if (!faculty) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    };

    res.render('faculty/detail', {
        title: `${faculty.name}`,
        faculty
    });
};

export { facultyListPage, facultyDetailsPage };