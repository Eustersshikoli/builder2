import { RequestHandler } from "express";

export const handleVisitorInfo: RequestHandler = (req, res) => {
  // Get IP address from various possible headers
  const getClientIP = (req: any) => {
    return req.ip ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.headers['x-client-ip'] ||
           'unknown';
  };

  const visitorInfo = {
    ip: getClientIP(req),
    userAgent: req.headers['user-agent'] || 'unknown',
    timestamp: new Date().toISOString(),
    referer: req.headers['referer'] || null,
    acceptLanguage: req.headers['accept-language'] || null
  };

  res.json(visitorInfo);
};
