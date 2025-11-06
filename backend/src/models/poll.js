// Poll model and validation

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;
const LABEL_REGEX = /^[A-Za-z0-9 ]+$/;

export function isAlphanumericLabel(value) {
  return typeof value === "string" && LABEL_REGEX.test(value);
}

export function validatePollInput(title, options, createdByUserId) {
  if (!isAlphanumericLabel(title)) {
    throw new Error("Title must be alphanumeric");
  }
  if (!Array.isArray(options)) {
    throw new Error("Options must be an array");
  }
  if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
    throw new Error(`Options must contain between ${MIN_OPTIONS} and ${MAX_OPTIONS} items`);
  }
  for (const option of options) {
    if (!isAlphanumericLabel(option)) {
      throw new Error("Option labels must be alphanumeric");
    }
  }
  if (!Number.isInteger(createdByUserId) || createdByUserId <= 0) {
    throw new Error("createdByUserId must be a positive integer");
  }
}

export function createPoll({ title, options, createdByUserId }) {
  validatePollInput(title, options, createdByUserId);
  return { title, options: [...options], createdByUserId };
}


