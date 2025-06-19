import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/profile';
import { 
  User, 
  Mail, 
  Edit, 
  Save, 
  X, 
  Loader2,
  Calendar,
  CheckCircle,
  List,
  Clock
} from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="h-7 w-7 text-primary-500" />
          Profile
        </h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {editMode ? (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-gray-700 font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={profile.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div className="mb-6 space-y-1">
            <label htmlFor="bio" className="block text-gray-700 font-medium flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
              <p className="text-lg font-medium text-gray-800">{profile.username}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </h3>
              <p className="text-lg font-medium text-gray-800">{profile.email}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </h3>
              <p className="text-lg font-medium text-gray-800">
                {profile.name || 'Not specified'}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Bio
              </h3>
              <p className="text-gray-800 whitespace-pre-line">
                {profile.bio || 'Not specified'}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </h3>
              <p className="text-gray-800">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="text-sm font-medium text-primary-600 mb-1 flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Todos
                </h3>
                <p className="text-2xl font-bold text-primary-700">
                  {profile.todo_count}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Active
                </h3>
                <p className="text-gray-800">
                  {new Date(profile.updated_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;