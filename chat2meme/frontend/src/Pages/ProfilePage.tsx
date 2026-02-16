import { useAuthStore } from "../Zustand/userStore";
import { User, Mail, Shield, CheckCircle, Smartphone } from "lucide-react";

const ProfilePage = () => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Profile Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-md p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-6 mb-8">
                    <div className="w-24 h-24 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-bold border border-blue-100 dark:border-blue-800">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-md text-sm font-medium flex items-center gap-1 border border-green-100 dark:border-green-800">
                                <CheckCircle size={14} />
                                {user.verified ? "Verified" : "Unverified"}
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md text-sm font-medium border border-blue-100 dark:border-blue-800 capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                            <User size={18} />
                            <span className="text-sm">Full Name</span>
                        </div>
                        <p className="font-medium text-lg text-gray-900 dark:text-white">{user.name}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                            <Mail size={18} />
                            <span className="text-sm">Email Address</span>
                        </div>
                        <p className="font-medium text-lg text-gray-900 dark:text-white">{user.email}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                            <Shield size={18} />
                            <span className="text-sm">Account Role</span>
                        </div>
                        <p className="font-medium text-lg capitalize text-gray-900 dark:text-white">{user.role}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                            <Smartphone size={18} />
                            <span className="text-sm">User ID</span>
                        </div>
                        <p className="font-medium text-sm font-mono text-gray-600 dark:text-gray-300 truncate">
                            {user.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
