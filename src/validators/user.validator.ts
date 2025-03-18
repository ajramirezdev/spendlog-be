import { checkSchema } from "express-validator";

const userValidatorSchema = {
  firstName: {
    trim: true,
    notEmpty: {
      errorMessage: "First name cannot be empty.",
    },
    isString: {
      errorMessage: "First name must be a string.",
    },
    isLength: {
      options: {
        min: 2,
        max: 24,
      },
      errorMessage:
        "First name must be at least 2 characters with a max of 24 characters.",
    },
  },
  lastName: {
    trim: true,
    notEmpty: {
      errorMessage: "Last name cannot be empty.",
    },
    isString: {
      errorMessage: "Last name must be a string.",
    },
    isLength: {
      options: {
        min: 2,
        max: 24,
      },
      errorMessage:
        "Last name must be at least 2 characters with a max of 24 characters.",
    },
  },
  email: {
    normalizeEmail: true,
    notEmpty: {
      errorMessage: "Email cannot be empty.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },
  password: {
    trim: true,
    escape: true,
    notEmpty: { errorMessage: "Password cannot be empty." },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long.",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      errorMessage:
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    },
  },
};

const validateUser = checkSchema(userValidatorSchema);

export default validateUser;
