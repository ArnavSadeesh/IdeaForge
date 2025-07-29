import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userType, setUserType] = useState(() => localStorage.getItem('userType'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [hackathonCode, setHackathonCode] = useState(() => localStorage.getItem('hackathonCode'));
  const [hackathonId, setHackathonId] = useState(() => localStorage.getItem('hackathonId'));
  const [hackathonName, setHackathonName] = useState(() => localStorage.getItem('hackathonName'));


  const login = ({ token, userType, hackathonCode, userName, hackathonId, hackathonName }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('hackathonCode', hackathonCode);
    localStorage.setItem('userName', userName);
    localStorage.setItem('hackathonId', hackathonId);
    localStorage.setItem('hackathonName', hackathonName);

    setToken(token);
    setUserType(userType);
    setUserName(userName);
    setHackathonCode(hackathonCode);
    setHackathonId(hackathonId);
    setHackathonName(hackathonName);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserType(null);
    setUserName(null);
    setHackathonCode(null);
    setHackathonId(null);
    setHackathonName(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{
      token, userType, userName, hackathonCode, hackathonId, hackathonName,
      login, logout, isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};
