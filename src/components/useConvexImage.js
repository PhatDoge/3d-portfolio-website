import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Custom hook to get image URL from Convex storage ID
 * @param {string} storageId - The Convex storage ID
 * @returns {string|null} - The image URL or null if not available
 */
export const useConvexImage = (storageId) => {
  const imageUrl = useQuery(
    api.services.getImageUrl,
    storageId ? { storageId } : "skip"
  );

  return imageUrl;
};

/**
 * Component wrapper that handles Convex image loading with loading states
 */
export const ConvexImage = ({
  storageId,
  alt,
  className = "",
  fallback = "/default-service-icon.png",
  loadingClassName = "animate-pulse bg-gray-300",
}) => {
  const imageUrl = useConvexImage(storageId);

  // Show loading state while fetching URL
  if (imageUrl === undefined) {
    return (
      <div
        className={`${className} ${loadingClassName} rounded`}
        style={{ minHeight: "40px", minWidth: "40px" }}
      />
    );
  }

  // Show fallback if no URL returned
  if (!imageUrl) {
    return <img src={fallback} alt={alt} className={className} />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = fallback;
      }}
    />
  );
};
