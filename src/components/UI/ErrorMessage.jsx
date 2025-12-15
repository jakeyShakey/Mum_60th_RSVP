/**
 * ErrorMessage component - Displays errors for invalid tokens or failed data loading
 */
export default function ErrorMessage({ error, onRetry }) {
  // Determine user-friendly message based on error type
  const getMessage = () => {
    if (error === 'No invitation token found') {
      return 'This invitation link appears to be invalid.';
    }
    if (error === 'Invitation not found') {
      return "We couldn't find your invitation. Please check your link.";
    }
    if (error === 'Google Apps Script URL not configured') {
      return 'System configuration error. Please contact the host.';
    }
    return 'Unable to load invitation. Please try again.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center max-w-md px-8">
        {/* Large emoji */}
        <div className="text-6xl mb-6">😕</div>

        {/* Title */}
        <h2 className="text-3xl font-display text-white mb-4">
          Oops! Something went wrong
        </h2>

        {/* Error message */}
        <p className="text-lg text-spice-yellow mb-8">
          {getMessage()}
        </p>

        {/* Try Again button (if retry function provided) */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-spice-orange text-white px-6 py-3 rounded-full
                     hover:scale-105 active:scale-95 transition-transform
                     shadow-lg font-semibold"
          >
            Try Again
          </button>
        )}

        {/* Contact info */}
        <p className="text-sm text-gray-400 mt-8">
          If the problem persists, please contact the event host.
        </p>
      </div>
    </div>
  );
}
