import { getAllFaculty, getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyListPage = (req, res) => {
    const faculty = getAllFaculty();

    res.render('faculty/list', {
        title: 'Faculty',
        faculty: faculty
    });
};

// Route handler for individual faculty detail pages
const facultyDetailsPage = (req,res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // If faculty doesn't exist, create 404 error
    if (!faculty) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    };

    //Handle sorting if requested
    const sortBy = req.query.sort || 'name';
    const sortedFaculty = getSortedFaculty(faculty, sortBy);

    res.render('faculty-detail', {
        // [ ] TODO: decide whether to add more info here than just 'name'
        title: `${faculty.name}`,
        currentSort: sortBy
    });
};

export { facultyListPage, facultyDetailsPage };