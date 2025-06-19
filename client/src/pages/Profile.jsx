import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/profile';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error && !profile) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Username</h3>
            <p className="text-gray-600">{profile.username}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Name</h3>
            <p className="text-gray-600">{profile.name || 'Not specified'}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Bio</h3>
            <p className="text-gray-600">{profile.bio || 'Not specified'}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Member Since</h3>
            <p className="text-gray-600">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Todo Count</h3>
            <p className="text-gray-600">{profile.todo_count}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;