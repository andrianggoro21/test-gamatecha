import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchUsers, fetchArticles, deleteUser } from '../../services/api';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import DataTable from '@/components/DataTable';
import Image from 'next/image';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); 

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  const loadArticles = useCallback(async (page = 1) => {
    try {
      const data = await fetchArticles(page, 10);
      setArticles(data.data); 
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        if (activeTab === 'users') {
          await loadUsers();
        } else if (activeTab === 'articles') {
          await loadArticles(currentPage);
        }
      }
    };

    fetchData();
  }, [session, loadUsers, loadArticles, activeTab, currentPage]);

  useEffect(() => {
    if (!session && status !== 'loading') {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false, callbackUrl: '/auth/signin' });
    router.push('/auth/signin');
  }, [router]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        if (activeTab === 'users') {
          await deleteUser(id);
          loadUsers(); // Refresh users after delete
        } else if (activeTab === 'articles') {
          // Logic for deleting articles (if needed)
        }
      } catch (error) {
        console.error(`Error deleting ${activeTab === 'users' ? 'user' : 'article'}:`, error);
      }
    },
    [activeTab, loadUsers]
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const columns = useMemo(() => {
    if (activeTab === 'users') {
      return [
        {
          Header: 'Full Name',
          accessor: (row) => `${row.first_name} ${row.last_name}`,
        },
        {
          Header: 'Email',
          accessor: 'email',
        },
        {
          Header: 'Actions',
          Cell: ({ row }) => (
            <div className="space-x-2">
              <button
                onClick={() => handleDelete(row.original.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none"
              >
                Delete
              </button>
              <button
                onClick={() => alert('Coming soon')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none"
              >
                Update
              </button>
            </div>
          ),
        },
      ];
    } else if (activeTab === 'articles') {
      return [
        {
          Header: 'Title',
          accessor: 'title',
        },
        {
          Header: 'Image',
          accessor: 'image',
          Cell: ({ value }) => (
            <div className="h-12 w-auto relative">
              <Image src={value} alt="Article" layout="fill" objectFit="cover" className="rounded" />
            </div>
          ),
        },
        {
          Header: 'Website',
          accessor: 'website.url',
          Cell: ({ value }) => (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {value}
            </a>
          ),
        },
      ];
    }
  }, [activeTab, handleDelete]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
            onClick={() => setActiveTab('users')}
            className={`mr-4 px-4 py-2 rounded ${
              activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded ${
              activeTab === 'articles' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            Articles
          </button>
        </div>
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={users} page={currentPage} />
          </div>
        )}
        {activeTab === 'articles' && (
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={articles} page={currentPage} />
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
