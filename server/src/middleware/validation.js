export const validateTaskInput = (req, res, next) => {
  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      console.error('🚫 TaskValidation: Invalid request body format:', {
        body: req.body,
        contentType: req.headers['content-type'],
        url: req.url,
        method: req.method
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request body format'
      });
    }

    const { title, description, subject, dueDate, estimatedTime, priority, tags } = req.body;

    if (!title || title.trim().length === 0) {
      console.error('🚫 TaskValidation: Missing title:', { body: req.body });
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (title.length > 100) {
      console.error('🚫 TaskValidation: Title too long:', { title, length: title.length });
      return res.status(400).json({
        success: false,
        message: 'Task title must be less than 100 characters'
      });
    }

    if (description && description.length > 500) {
      console.error('🚫 TaskValidation: Description too long:', { description, length: description.length });
      return res.status(400).json({
        success: false,
        message: 'Task description must be less than 500 characters'
      });
    }

    if (estimatedTime && (estimatedTime < 1 || estimatedTime > 1440)) {
      console.error('🚫 TaskValidation: Invalid estimated time:', { estimatedTime });
      return res.status(400).json({
        success: false,
        message: 'Estimated time must be between 1 and 1440 minutes (24 hours)'
      });
    }

    if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority.toUpperCase())) {
      console.error('🚫 TaskValidation: Invalid priority:', { priority });
      return res.status(400).json({
        success: false,
        message: 'Priority must be LOW, MEDIUM, or HIGH'
      });
    }

    // Validate due date if provided
    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        console.error('🚫 TaskValidation: Invalid due date format:', { dueDate });
        return res.status(400).json({
          success: false,
          message: 'Invalid due date format'
        });
      }
    }

    console.log('✅ TaskValidation: Task input validation passed');
    next();
  } catch (error) {
    console.error('❌ TaskValidation: Validation error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      url: req.url,
      method: req.method
    });
    return res.status(500).json({
      success: false,
      message: 'Validation service error'
    });
  }
};

export const validateUserInput = (req, res, next) => {
  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      console.error('🚫 UserValidation: Invalid request body format:', {
        body: req.body,
        contentType: req.headers['content-type'],
        url: req.url,
        method: req.method
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request body format'
      });
    }

    const { email, password, name } = req.body;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      console.error('🚫 UserValidation: Missing or invalid email:', { email, body: req.body });
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    if (!email.includes('@') || email.trim().length < 3) {
      console.error('🚫 UserValidation: Invalid email format:', { email });
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      console.error('🚫 UserValidation: Missing password');
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    if (password.length < 6) {
      console.error('🚫 UserValidation: Password too short:', { passwordLength: password.length });
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (name && (typeof name !== 'string' || name.trim().length > 50)) {
      console.error('🚫 UserValidation: Invalid name:', { name, length: name?.length });
      return res.status(400).json({
        success: false,
        message: 'Name must be less than 50 characters'
      });
    }

    console.log('✅ UserValidation: User input validation passed for email:', email);
    next();
  } catch (error) {
    console.error('❌ UserValidation: Validation error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      url: req.url,
      method: req.method
    });
    return res.status(500).json({
      success: false,
      message: 'Validation service error'
    });
  }
};

export const validateLoginInput = (req, res, next) => {
  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      console.error('🚫 LoginValidation: Invalid request body format:', {
        body: req.body,
        contentType: req.headers['content-type'],
        url: req.url,
        method: req.method
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request body format'
      });
    }

    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      console.error('🚫 LoginValidation: Missing or invalid email:', { email, body: req.body });
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    if (!email.includes('@') || email.trim().length < 3) {
      console.error('🚫 LoginValidation: Invalid email format:', { email });
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      console.error('🚫 LoginValidation: Missing password');
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    console.log('✅ LoginValidation: Login input validation passed for email:', email);
    next();
  } catch (error) {
    console.error('❌ LoginValidation: Validation error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      url: req.url,
      method: req.method
    });
    return res.status(500).json({
      success: false,
      message: 'Validation service error'
    });
  }
};



