import { useEffect } from "react";
import { supabase } from "../lib/supabase";

interface VisitorTrackerProps {
  pageTitle?: string;
  pagePath?: string;
}

const VisitorTracker: React.FC<VisitorTrackerProps> = ({
  pageTitle = document.title,
  pagePath = window.location.pathname,
}) => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get visitor info
        const visitorData = {
          page_path: pagePath,
          page_title: pageTitle,
          referrer: document.referrer || "direct",
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          browser: getBrowser(),
          operating_system: getOperatingSystem(),
          screen_resolution: `${screen.width}x${screen.height}`,
          is_mobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            ),
          visited_at: new Date().toISOString(),
        };

        // Try to get location data (this would require a geolocation API in production)
        try {
          const locationData = await getLocationData();
          Object.assign(visitorData, locationData);
        } catch (error) {
          console.warn("Could not get location data:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
          });
          Object.assign(visitorData, {
            country: "Unknown",
            city: "Unknown",
            ip_address: "Unknown",
          });
        }

        // Track page view
        const { error: pageError } = await supabase
          .from("page_views")
          .insert(visitorData);

        if (pageError) {
          console.warn("Failed to track page view:", {
            message: pageError?.message || "Unknown page tracking error",
            code: pageError?.code || "NO_CODE",
            details: pageError?.details || "No details available",
          });
        }

        // Track visitor analytics
        const { error: visitorError } = await supabase
          .from("visitor_analytics")
          .insert({
            ...visitorData,
            page_visited: pagePath,
            session_duration: 0, // This would be updated on page unload
            session_id: getSessionId(),
          });

        if (visitorError) {
          console.warn("Failed to track visitor:", {
            message: visitorError?.message || "Unknown visitor tracking error",
            code: visitorError?.code || "NO_CODE",
            details: visitorError?.details || "No details available",
          });
        }
      } catch (error) {
        console.warn("Visitor tracking error:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    };

    // Track immediately
    trackVisitor();

    // Track session duration on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - startTime;
      // In a real implementation, you'd send this data to the server
      console.log("Session duration:", sessionDuration);
    };

    const startTime = Date.now();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pageTitle, pagePath]);

  return null; // This component doesn't render anything
};

// Helper functions
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return "Tablet";
  }
  if (
    /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
      userAgent,
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
};

const getBrowser = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Unknown";
};

const getOperatingSystem = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  return "Unknown";
};

const getLocationData = async () => {
  // In production, you would use a geolocation API service
  // For now, return mock data or try to use a free IP geolocation service
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
        ip_address: data.ip || "Unknown",
      };
    }
  } catch (error) {
    console.warn("Geolocation API failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // Fallback to default values
  return {
    country: "Unknown",
    city: "Unknown",
    ip_address: "Unknown",
  };
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

export default VisitorTracker;
