import passport from 'passport';

export const authenticateToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ msg: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

export const requireAuth = authenticateToken;

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};

export default authenticateToken;
