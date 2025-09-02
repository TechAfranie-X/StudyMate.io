import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import { Camera, Upload, X, User, Mail, Shield, AlertCircle } from 'lucide-react'
import ConnectionDiagnostics from '../components/ConnectionDiagnostics'
import ThemeToggle from '../components/ThemeToggle'

const Settings = () => {
  const { user, updateProfile, loading, error } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)

  // Debug logging
  useEffect(() => {
    console.log('Settings: Component mounted');
  }, []);

  useEffect(() => {
    console.log('Settings: User data updated:', user);
  }, [user]);

  const getUserInitials = (email) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('studymate_profile_image')
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target.result
      setProfileImage(imageData)
      
      // Save to localStorage
      localStorage.setItem('studymate_profile_image', imageData)
      
      // Also save to backend if available (mock for now)
      console.log('💾 Profile image saved to localStorage')
      
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    localStorage.removeItem('studymate_profile_image')
    console.log('🗑️ Profile image removed')
  }

  const handleChangeImage = () => {
    fileInputRef.current?.click()
  }

  const handleProfileUpdate = async () => {
    const result = await updateProfile(profileData)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="h1 text-text-primary">Settings</h1>
        <p className="mt-2 text-text-secondary">Manage your StudyMate preferences and account settings</p>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-10 border border-error-20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-error" size={20} />
            <span className="text-error">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Settings sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="h2 text-text-primary">Profile Settings</h3>
          </div>
          <div className="card-body space-y-6">
            {/* Profile Image */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl font-semibold">
                      {getUserInitials(user?.email)}
                    </span>
                  )}
                </div>
                
                {/* Upload/Change Image Button */}
                <button
                  onClick={handleChangeImage}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                  title="Change profile image"
                >
                  <Camera size={12} />
                </button>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="h3 text-text-primary">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || 'User'
                  }
                </h4>
                <p className="text-text-secondary">
                  {user?.email || 'No email provided'}
                </p>
                
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleChangeImage}
                    className="text-sm text-primary hover:text-primary-hover"
                  >
                    Change Photo
                  </button>
                  {profileImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="text-sm text-error hover:text-error"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className="form-input disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  className="form-input disabled:opacity-50"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed for security reasons
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>

            {/* Profile Actions */}
            <div className="flex justify-end space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="h2 text-text-primary">Appearance</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="h3 text-text-primary">Theme Selection</h4>
                <p className="text-text-secondary">
                  Choose your preferred theme or follow system preference
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="h2 text-text-primary">Account</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="text-text-muted" size={20} />
                <div>
                  <h4 className="font-medium text-text-primary">Password</h4>
                  <p className="text-sm text-text-secondary">
                    Last changed: Never
                  </p>
                </div>
              </div>
              <button className="text-primary hover:text-primary-hover text-sm font-medium">
                Change
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="text-text-muted" size={20} />
                <div>
                  <h4 className="font-medium text-text-primary">Account Status</h4>
                  <p className="text-sm text-text-secondary">
                    Active
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-20 text-accent">
                Verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* Connection Diagnostics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ConnectionDiagnostics />
        </motion.div>
      </div>
    </div>
  )
}

export default Settings

