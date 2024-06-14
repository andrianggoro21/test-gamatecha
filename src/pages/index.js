import { useState, useEffect } from 'react';
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
        router.push('/auth/signin'); 
      }
    };

    fetchData();
  }, [session, status, router]);

  if (loading || status === 'loading') return <p>Loading...</p>; 


  return (
    <div>
      <p>User role not found or handled.</p>
    </div>
  );
};

export default IndexPage;
