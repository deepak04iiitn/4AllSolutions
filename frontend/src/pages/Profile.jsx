import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Camera, LogOut, Trash2, Building, Mail, User } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase.js';
import { 
  updateFailure, 
  updateStart, 
  updateSuccess, 
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure, 
  signoutSuccess 
} from '../redux/user/userSlice.js';

const Input = ({ label, icon: Icon, ...props }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
      />
      <label className="absolute -top-2.5 left-3 bg-white dark:bg-gray-900 px-2 text-sm text-gray-600 dark:text-gray-400">
        {label}
      </label>
    </div>
  );
  
  const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95";
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25",
      secondary: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
      danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25",
    };
    
    return (
      <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };
  
  export default function Profile() {
    const { currentUser, error } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleImageChange = async(e) => {

        const file = e.target.files[0];

        if(file)
        {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));                    // this is going to create url of the image for us
        }

    }


    useEffect(() => {

        if(imageFile)
        {
            uploadImage();
        }

    } , [imageFile])

    const uploadImage = async() => {

        setImageFileUploading(true);

        setImageFileUploadError(null);

        const storage = getStorage(app);

        const fileName = new Date().getTime() + imageFile.name;

        const storageRef = ref(storage , fileName);

        const uploadTask = uploadBytesResumable(storageRef , imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData , profilePicture : downloadURL });
                    setImageFileUploading(false);
                })
            }
        )
    }


    const handleChange = (e) => {
        setFormData({ ...formData , [e.target.id] : e.target.value });
    }


    const handleSubmit = async(e) => {

        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if(Object.keys(formData).length === 0)
        {
            setUpdateUserError('No changes made!');
            return;
        }

        if(imageFileUploading)
        {
            setUpdateUserError('Please wait for image to upload!');
            return;
        }

        try {

            dispatch(updateStart());

            const res = await fetch(`/backend/user/update/${currentUser._id}` , {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(formData),
            });
            const data = await res.json();

            if(!res.ok)
            {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }
            else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully!");
            }

        } catch (error) {
            dispatch(updateFailure(error.message));
        }
    }


    const handleDeleteUser = async () => {

        setShowModal(false);

        try {

            dispatch(deleteUserStart());
            const res = await fetch(`/backend/user/delete/${currentUser._id}` , {
                method : 'DELETE',
            });

            const data = await res.json();

            if(!res.ok)
            {
                dispatch(deleteUserFailure(data.message));
            }
            else
            {
                dispatch(deleteUserSuccess(data));
                navigate('/sign-in');
            }
            
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }


    const handleSignout = async() => {

        try {

            const res = await fetch('/backend/user/signout', {
                method : 'POST',
            })

            const data = await res.json();

            if(!res.ok)
            {
                console.log(data.message);
            }
            else
            {
                dispatch(signoutSuccess());
                navigate('/sign-in');
            }

        } catch (error) {
            console.log(error.message);
        }

    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-blue-500/5 backdrop-blur-xl p-8 transform transition-all duration-500 hover:shadow-blue-500/10">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-10 blur-2xl" />
                <h1 className="relative text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Your Profile
                </h1>
              </div>
    
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative w-40 h-40 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse blur-xl opacity-30" />
                  <div 
                    className="relative w-full h-full rounded-full cursor-pointer overflow-hidden group"
                    onClick={() => filePickerRef.current.click()}
                  >
                    {imageFileUploadProgress && (
                      <div className="absolute inset-0 z-10 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center">
                        <CircularProgressbar
                          value={imageFileUploadProgress || 0}
                          text={`${imageFileUploadProgress}%`}
                          strokeWidth={5}
                          styles={{
                            root: { width: '60%', height: '60%' },
                            path: { stroke: '#3B82F6' },
                            text: { fill: '#3B82F6', fontSize: '24px' },
                          }}
                        />
                      </div>
                    )}
                    <img
                      src={imageFileUrl || currentUser.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
    
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={filePickerRef}
                  hidden
                />
    
                <div className="space-y-4">
                  <Input
                    label="Username"
                    icon={User}
                    type="text"
                    id="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                  />
                  <Input
                    label="Email"
                    icon={Mail}
                    type="email"
                    id="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                  />
                  <Input
                    label="Password"
                    icon={Building}
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
    
                <div className="space-y-4 pt-4">
                  <Button type="submit" className="w-full">
                    Update Profile
                  </Button>
                  
                  <Link to="/" className="block">
                    <Button variant="secondary" className="w-full">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </form>
    
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
                <button
                  onClick={handleSignout}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
    
              {(updateUserSuccess || error || imageFileUploadError) && (
                <div className="mt-6 space-y-4">
                  {updateUserSuccess && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 animate-fadeIn">
                      {updateUserSuccess}
                    </div>
                  )}
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 animate-fadeIn">
                      {error}
                    </div>
                  )}
                  {imageFileUploadError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 animate-fadeIn">
                      {imageFileUploadError}
                    </div>
                  )}
                </div>
              )}
    
              {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full animate-fadeIn">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                        <svg
                          className="w-full h-full animate-pulse"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button variant="danger" onClick={handleDeleteUser}>
                          Yes, delete
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }