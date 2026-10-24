import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    // COMPLETE: Render the registration form view (forms/registration/form)
    res.render('forms/registration/form', {
    // COMPLETE: Pass title: 'User Registration' in the data object
        title: 'User Registration'
    });
};

/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // COMPLETE: Log validation errors to console for debugging
        console.error('Validation errors:', errors.array());
        // COMPLETE: Redirect back to /register
        return res.redirect('/register');
    }

    // Extract validated data from request body
    // COMPLETE: Destructure name, email, password from req.body
    const { name, email, password } = req.body;

    try {
        // Check if email already exists in database
        // COMPLETE: Call emailExists(email) and store the result in a variable
        const emailChecker = await emailExists(email);

        if (emailChecker) {
            // COMPLETE: Log message: 'Email already registered'
            console.log('Email already registered');
            // COMPLETE: Redirect back to /register
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        // COMPLETE: Use bcrypt.hash(password, 10) to hash the password
        // COMPLETE: Store the result in a variable called hashedPassword
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database with hashed password
        // COMPLETE: Call saveUser(name, email, hashedPassword)
        await saveUser(name, email, hashedPassword);

        // COMPLETE: Log success message to console
        console.log('User registered successfully');

        // COMPLETE: Redirect to /register/list to show successful registration
        // NOTE: Later when we add authentication, we'll change this to require login first
        res.redirect('/register/list');
    } catch (error) {
        // COMPLETE: Log the error to console
        console.error(error);
        // COMPLETE: Redirect back to /register
        res.redirect('/register');
    }
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];

    try {
        // COMPLETE: Call getAllUsers() and assign to users variable
        users = await getAllUsers();
    } catch (error) {
        // COMPLETE: Log the error to console
        console.error(error);
        // users remains empty array on error
        users = [];
    }

    // COMPLETE: Render the users list view (forms/registration/list)
    // COMPLETE: Pass title: 'Registered Users' and the users variable in the data object
    res.render('forms/registration/list', {
        title: 'Registered Users',
        users
    })
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;