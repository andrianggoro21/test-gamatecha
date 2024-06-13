// pages/index.jsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { checkUserRole } from '@/services/auth';

const IndexPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated') {
        await checkUserRole(session, router);
        setLoading(false);
      } else {
        router.push('/auth/signin'); // Redirect to sign-in page
      }
    };

    fetchData();
  }, [session, status, router]);

  if (loading || status === 'loading') return <p>Loading...</p>; // Optional loading indicator

  // Optional fallback content if role-based redirection fails
  return (
    <div>
      <p>User role not found or handled.</p>
    </div>
  );
};

export default IndexPage;
