import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyListPage = async (req, res) => {
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'name';
    const faculty = await getSortedFaculty(sortBy); //Returns an array of sorted faculty members

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: faculty,
        currentSort: sortBy
    });
};

// Route handler for individual faculty detail pages
const facultyDetailsPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    const facultyMember = await getFacultyBySlug(facultySlug);

    // If faculty doesn't exist, create 404 error
    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    };

    res.render('faculty/detail', {
        title: `${facultyMember.name}`,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailsPage };