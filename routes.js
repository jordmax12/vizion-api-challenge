const express = require("express");

const {
  createReference,
  findReference,
  deleteReference,
  reprocessReference,
} = require("./controllers/reference");
const {
  deleteResultsByReferenceId,
  getAllResultsByReferenceId,
  findResult,
} = require("./controllers/result");

const {
  genericReferenceIdInteger,
  getResultIdInteger,
  postReferencesValidation,
} = require("./helpers/validation");

const routes = express.Router();

routes.post(
  "/references",
  postReferencesValidation,
  async ({ body: { url } }, res) => {
    await createReference(url);
    res.status(200).json({ message: url });
  }
);

routes.post(
  "/references/reprocess",
  genericReferenceIdInteger,
  async ({ body: { reference_id: referenceId } }, res) => {
    const { error } = await reprocessReference(referenceId);

    if (error) {
      res
        .status(400)
        .json({ error: "Error reprocessing session, make sure it exists." });
    } else {
      res.status(200).json({ success: true });
    }
  }
);

routes.get("/results", getResultIdInteger, async ({ body: { id } }, res) => {
  const result = await findResult(id);

  res.status(200).json(result);
});

routes.get(
  "/references",
  genericReferenceIdInteger,
  async ({ body: { reference_id: referenceId } }, res) => {
    const result = await findReference(referenceId);

    res.status(200).json(result);
  }
);

routes.get(
  "/references/results",
  genericReferenceIdInteger,
  async ({ body: { reference_id: referenceId } }, res) => {
    const results = await getAllResultsByReferenceId(referenceId);
    res.status(200).json({
      items: results,
    });
  }
);

routes.delete(
  "/resultsByReferenceId",
  genericReferenceIdInteger,
  async ({ body: { reference_id: referenceId } }, res) => {
    const deleteResults = await deleteResultsByReferenceId(referenceId);
    const deleteRef = await deleteReference(referenceId);

    res.status(200).json({ success: deleteRef && deleteResults });
  }
);

routes.use((_, res) =>
  res.status(400).json({
    success: false,
    message: res,
  })
);

module.exports = routes;
