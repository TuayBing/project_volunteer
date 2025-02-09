import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import MainLayout from '../../layout/NavigationBar/MainLayout';
import UserProfile from './UserProfile';
import AuthModal from '../../layout/ProfileModal/AuthModal';

function Profile() {
  const { token } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // ถ้าไม่มี token ให้แสดง modal
    if (!token) {
      setShowAuthModal(true);
    }
  }, [token]);

  return (
    <div>
    
        {token ? <UserProfile /> : null}
        <AuthModal isOpen={showAuthModal} />
    
    </div>
  );
}

export default Profile;