import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser?._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }

        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };

    // Fetch user listings when the component mounts or when currentUser changes
    fetchUserListings();
  }, [currentUser?._id]);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleListingDelete = async (listingId) => {
    try {
      setShowDeleteConfirmation(false);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 mx-auto w-2/3">
      <p className="text-red-700 mt-5">
        {showListingsError && "Error showing listings"}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            My Properties
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 hover:shadow-lg transition duration-300"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-32 w-32 object-contain rounded-md"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline text-lg"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex items-center gap-6 ml-auto">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase h-full px-4 py-2 rounded-md bg-green-100 hover:bg-green-200 transition duration-300">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={handleDeleteConfirmation}
                  className="text-red-700 uppercase h-full px-4 py-2 rounded-md bg-red-100 hover:bg-red-200 transition duration-300"
                >
                  Delete
                </button>
                {showDeleteConfirmation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-md">
                      <p className="mb-3">
                        Are you sure you want to delete your Property?
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md"
                        >
                          OK
                        </button>
                        <button
                          onClick={handleDeleteCancel}
                          className="bg-gray-300 px-3 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
