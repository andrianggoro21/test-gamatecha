import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { fetchArticles, fetchUserProfile } from '@/services/api';
import CardArticle from '@/components/CardArticles';

const OwnerDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadArticles = useCallback(async (page = 1) => {
    try {
      const data = await fetchArticles(page, 10); 
      setArticles(data.data);
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const data = await fetchUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        if (activeTab === 'articles') {
          await loadArticles(currentPage);
        } else if (activeTab === 'profile') {
          await loadUserProfile();
        }
      }
    };

    fetchData();
  }, [session, activeTab, currentPage, loadArticles, loadUserProfile]);

  useEffect(() => {
    if (!session && status !== 'loading') {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  }, [router]);

  const handleViewProfile = () => {
    setActiveTab('profile');
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
      <div className="mb-8">
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('articles')}
            className={`mr-4 px-4 py-2 rounded ${
              activeTab === 'articles' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            Articles
          </button>
          <button
            onClick={handleViewProfile}
            className={`px-4 py-2 rounded ${
              activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            Profile
          </button>
        </div>
        {activeTab === 'articles' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <CardArticle key={article.id} article={article} />
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            {profile ? (
              <div className="bg-white shadow-md rounded-lg p-4">
                <p className="text-lg font-semibold">First Name: {profile.first_name}</p>
                <p className="text-lg font-semibold">Last Name: {profile.last_name}</p>
                <p className="text-lg font-semibold">Username: {profile.username}</p>
                <p className="text-lg font-semibold">Email: {profile.email}</p>
                <p className="text-lg font-semibold">Role: {profile.role}</p>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;