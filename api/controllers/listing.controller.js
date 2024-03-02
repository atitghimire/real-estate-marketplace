import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
// import cosineSimilarity from "cosine-similarity";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Helper function to get the feature vector for a listing
function getFeatureVector(listing) {
  const featureVector = [];

  // Add text-based features to the vector
  featureVector.push(
    ...listing.name
      .toLowerCase()
      .split(" ")
      .map((char) => char.charCodeAt(0))
  );
  featureVector.push(
    ...listing.description
      .toLowerCase()
      .split(" ")
      .map((char) => char.charCodeAt(0))
  );
  featureVector.push(
    ...listing.address
      .toLowerCase()
      .split(" ")
      .map((char) => char.charCodeAt(0))
  );

  // Add numeric features to the vector
  featureVector.push(listing.regularPrice || 0);
  featureVector.push(listing.discountPrice || 0);
  featureVector.push(listing.bathrooms || 0);
  featureVector.push(listing.bedrooms || 0);

  // Add boolean features to the vector
  featureVector.push(listing.furnished ? 1 : 0);
  featureVector.push(listing.electricity ? 1 : 0);
  featureVector.push(listing.water ? 1 : 0);
  featureVector.push(listing.parking ? 1 : 0);
  featureVector.push(listing.offer ? 1 : 0);

  // Add other features as needed

  return featureVector;
}

// Function to calculate cosine similarity
function calculateCosineSimilarity(vectorA, vectorB) {
  const dotProduct = vectorA.reduce((acc, term, index) => {
    const termA = parseFloat(term);
    const termB = parseFloat(vectorB[index]) || 0;
    return acc + termA * termB;
  }, 0);

  const magnitudeA = calculateMagnitude(
    vectorA.map((term) => parseFloat(term))
  );
  const magnitudeB = calculateMagnitude(
    vectorB.map((term) => parseFloat(term))
  );
  const cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);

  // Convert cosine similarity to percentage
  const similarityPercentage = (cosineSimilarity * 100).toFixed(2);

  return parseFloat(similarityPercentage);
}

function calculateMagnitude(vector) {
  const magnitude = Math.sqrt(
    vector.reduce((sum, term) => {
      return sum + term * term;
    }, 0)
  );
  return magnitude;
}

export const getSimilarListings = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const limit = parseInt(req.query.limit) || 4; // Adjust the limit as needed

    const targetListing = await Listing.findById(listingId);
    if (!targetListing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Calculate cosine similarity for all features
    const allListings = await Listing.find({});
    const similarityVector = allListings.map((listing) => {
      if (listing._id.toString() === listingId) {
        return null;
      }
      const targetVector = getFeatureVector(targetListing);
      const listingVector = getFeatureVector(listing);

      // console.log("target vector:", targetVector);
      // console.log("listing vector:", listingVector);

      const similarity = calculateCosineSimilarity(targetVector, listingVector);
      console.log(
        `Cosine Similarity between ${targetListing.name} and ${listing.name}: ${similarity}`
      );

      return {
        id: listing._id,
        similarity,
      };
    });

    // Filter out entries with invalid similarity scores
    const validSimilarities = similarityVector.filter(
      (score) => score && !isNaN(score.similarity) && score.similarity >= 60
    );

    // Sort listings by similarity in descending order
    const sortedListings = validSimilarities.sort(
      (a, b) => b.similarity - a.similarity
    );

    // Extract IDs of similar listings up to the specified limit
    const limitedListings = sortedListings.slice(0, limit);

    // Fetch similar listings based on sorted IDs
    const similarListings = await Listing.find({
      _id: { $in: limitedListings.map((listing) => listing.id) },
    }).sort({ _id: -1 }); // Sort by _id in descending order

    return res.status(200).json(similarListings);
  } catch (error) {
    next(error);
  }
};
