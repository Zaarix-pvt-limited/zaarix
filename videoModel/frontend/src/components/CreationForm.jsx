import React from 'react';

const CreationForm = ({
    formData,
    setFormData,
    handleImageUpload,
    handleAvatarUpload, // New prop
    loading,
    handleSubmit
}) => {
    const voices = ["Adam", "Rachel", "Antoni", "Josh", "Elli", "Bella", "Sam"];
    const themes = ["Casual", "Professional", "Funny", "Serious", "Excited", "Educational"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create New Conversation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Speaker A Configuration */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3">Speaker A</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                        {/* Voice Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Voice</label>
                            <select
                                name="voice1"
                                value={formData.voice1}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                            >
                                {voices.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>

                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Avatar Image</label>
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAvatarUpload(e, 'avatar1')}
                                    className="hidden"
                                    id="avatar1-upload"
                                />
                                <label
                                    htmlFor="avatar1-upload"
                                    className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex-1 text-center truncate"
                                >
                                    {formData.avatar1 ? 'Change Avatar' : 'Upload Avatar'}
                                </label>
                                {formData.avatar1 && (
                                    <img src={formData.avatar1} alt="Avatar A" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Speaker B Configuration */}
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide mb-3">Speaker B</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                        {/* Voice Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Voice</label>
                            <select
                                name="voice2"
                                value={formData.voice2}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-purple-500 outline-none text-sm"
                            >
                                {voices.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>

                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Avatar Image</label>
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAvatarUpload(e, 'avatar2')}
                                    className="hidden"
                                    id="avatar2-upload"
                                />
                                <label
                                    htmlFor="avatar2-upload"
                                    className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-purple-600 hover:border-purple-300 transition-colors flex-1 text-center truncate"
                                >
                                    {formData.avatar2 ? 'Change Avatar' : 'Upload Avatar'}
                                </label>
                                {formData.avatar2 && (
                                    <img src={formData.avatar2} alt="Avatar B" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Conversation Theme</label>
                    <select
                        name="theme"
                        value={formData.theme}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none cursor-pointer hover:bg-white"
                    >
                        {themes.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Content Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, inputType: 'text' }))}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formData.inputType === 'text'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Text Input
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, inputType: 'image' }))}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formData.inputType === 'image'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Context Image
                    </button>
                </div>

                {/* Dynamic Input Field */}
                <div className="space-y-2">
                    {formData.inputType === 'text' ? (
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            placeholder="What should they talk about? Paste a topic or a full dialogue..."
                            className="w-full h-32 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                        />
                    ) : (
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                id="file-upload"
                                className="hidden"
                                disabled={loading}
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group-hover:bg-indigo-50/50"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="text-4xl mb-2">📷</span>
                                    <p className="text-sm text-gray-500 font-medium">Click to upload context image</p>
                                    {formData.image && <p className="text-xs text-green-600 mt-2 font-semibold">Image selected ✓</p>}
                                </div>
                            </label>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || (!formData.text && !formData.image)}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Podcast...
                        </span>
                    ) : (
                        'Generate Conversation'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreationForm;
