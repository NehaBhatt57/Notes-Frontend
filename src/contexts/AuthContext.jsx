import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const tenantFromStorage = localStorage.getItem('tenant');
    const email = localStorage.getItem('email');    
    let tenant = null;
    let slug = null;
    let subscription = null;
    try {
      tenant = tenantFromStorage ? JSON.parse(tenantFromStorage) : null;   
    } catch {
      tenant = { slug: tenantFromStorage };
    }

    if (token && (!tenant || !tenant.slug)) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.tenantSlug) {
          slug =  decoded.tenantSlug;
        }
        if (decoded.tenantSubscription) {
          subscription = decoded.tenantSubscription;
        }
      } catch {}
    }

    return token
      ? { token, role, tenant, email, subscription, slug }
      : null;
  });

  // Persist auth to localStorage
  useEffect(() => {
    if (auth) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('role', auth.role);
      localStorage.setItem('tenant', JSON.stringify(auth.tenant));
      localStorage.setItem('email', auth.email);
      localStorage.setItem('subscription', auth.subscription);
      localStorage.setItem('slug', auth.slug);
    } else {
      localStorage.clear();
    }
  }, [auth]);

  // refreshAuth fetches fresh user info and updates state including subscription
  const refreshAuth = async () => {
    if (!auth?.token) return;
    try {
      const res = await fetch('https://notes-backend-teal.vercel.app/api/auth/me', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });      
      if (res) {
        const data = await res.json();
        let refreshedTenant = data.tenant;        
        let refreshedSubscription = data.tenant?.subscription;
        if ((!refreshedTenant || !refreshedTenant.slug) && auth.token) {
          try {
            const decoded = jwtDecode(auth.token);
            if (decoded.tenantSlug) {
              refreshedTenant = { slug: decoded.tenantSlug };
            }
            if (decoded.tenantSubscription) {
              refreshedSubscription = decoded.tenantSubscription;              
            }
          } catch {}
        }
        
        setAuth({
          token: auth.token,
          role: data.role,
          tenant: refreshedTenant,
          email: data.email,
          slug: refreshedTenant?.slug,
          subscription: refreshedSubscription,
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error('refreshAuth error:', error);
      logout();
    }
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthContext, AuthProvider };
