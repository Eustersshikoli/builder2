import { useEffect } from "react";

interface VisitorTrackerProps {
  pageTitle?: string;
  pagePath?: string;
}

const VisitorTracker: React.FC<VisitorTrackerProps> = ({
  pageTitle = document.title,
  pagePath = window.location.pathname,
}) => {
  useEffect(() => {
    // Temporarily disable tracking until analytics tables are available
    console.log(`Page view tracked: ${pageTitle} at ${pagePath}`);
  }, [pageTitle, pagePath]);

  return null; // This component doesn't render anything
};

export default VisitorTracker;