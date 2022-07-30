/* eslint-disable no-unused-expressions, no-useless-escape */
const genericReferenceIdInteger = (
  { body: { reference_id: referenceId } },
  res,
  next
) => {
  if (!referenceId) {
    res.status(400).json({ error: "reference_id required in request." });
  } else {
    const parsed = parseInt(referenceId, 10);
    if (parsed === referenceId) {
      next();
    } else {
      res
        .status(400)
        .json({ error: "reference_id required to be an integer." });
    }
  }
};

const postReferencesValidation = ({ body: { url } }, res, next) => {
  if (!url) {
    res.status(400).json({ error: "url is required in request." });
  }
  const expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);

  url.match(regex)
    ? next()
    : res.status(400).json({ error: "url is invalid." });
};

const getResultIdInteger = ({ body: { id } }, res, next) => {
  if (!id) {
    res.status(400).json({ error: "id required in request." });
  } else {
    const parsed = parseInt(id, 10);
    if (parsed === id) {
      next();
    } else {
      res.status(400).json({ error: "id required to be an integer." });
    }
  }
};

module.exports = {
  genericReferenceIdInteger,
  getResultIdInteger,
  postReferencesValidation,
};
