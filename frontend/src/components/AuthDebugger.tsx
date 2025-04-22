import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuthStore } from 'utils/authStore';

// This component is for development purposes only
// It helps diagnose authentication issues by displaying the current auth state
export function AuthDebugger() {
  const { user, profile, isAuthenticated, isLoading } = useUser();
  const { session, loading: storeLoading } = useAuthStore();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        overflow: 'auto',
        maxHeight: '200px'
      }}
    >
      <h4 style={{ margin: '0 0 5px 0', borderBottom: '1px solid #666' }}>Auth Debug</h4>
      <div>
        <strong>isAuthenticated:</strong> {String(isAuthenticated)}
      </div>
      <div>
        <strong>isLoading:</strong> {String(isLoading)}
      </div>
      <div>
        <strong>storeLoading:</strong> {String(storeLoading)}
      </div>
      <div>
        <strong>hasUser:</strong> {String(!!user)}
      </div>
      <div>
        <strong>hasSession:</strong> {String(!!session)}
      </div>
      <div>
        <strong>hasProfile:</strong> {String(!!profile)}
      </div>
      {user && (
        <div style={{ marginTop: '5px', fontSize: '10px', wordBreak: 'break-all' }}>
          <strong>User ID:</strong> {user.id}
        </div>
      )}
    </div>
  );
}
