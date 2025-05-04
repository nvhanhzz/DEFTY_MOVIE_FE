import React, { useState, useRef, MouseEvent, ChangeEvent, FormEvent } from "react"; // Added ChangeEvent, FormEvent
import { FiUser, FiX, FiLock, FiSmartphone, FiMail, FiPhone, FiCalendar, FiMapPin, FiArrowLeft, FiEye, FiEyeOff, FiLoader } from "react-icons/fi"; // Added more icons
import { FaGoogle, FaFacebook, FaRegUserCircle, FaTransgender } from "react-icons/fa"; // Added more icons
import './Auth.scss';
import {postLogin, postRegister} from "../../../services/auth.tsx";
import {message} from "antd"; // Import file SCSS

// --- Type Definitions ---
type ModalView = 'main' | 'passwordLogin' | 'signup'; // Possible views inside the modal

export type SignUpFormData = {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    gender: string;
    address: string;
    dateOfBirth: string;
    password: string;
}

export type LoginFormData = {
    username: string;
    password: string;
}

interface HoverPopupProps {
    onLoginClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void; // Simplified onClose
}

// --- Hover Popup Component (No changes) ---
const HoverPopup: React.FC<HoverPopupProps> = ({ onLoginClick }) => {
    return (
        <div className="auth__hover-popup">
            <p className="auth__hover-popup-text">Login to watch trendy content</p>
            <button className="auth__hover-popup-button" onClick={onLoginClick}>Login</button>
            <div className="auth__hover-popup-arrow"></div>
        </div>
    );
};

// --- Password Login View Component ---
interface PasswordLoginViewProps {
    onSwitchView: (view: ModalView) => void;
    onClose: () => void;
}
const PasswordLoginView: React.FC<PasswordLoginViewProps> = ({ onSwitchView, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    // Use the defined LoginFormData type
    const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(isLoading) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        const loginUser = async () => {
            setIsLoading(true); // Start loading indicator
            try {
                const response = await postLogin(formData); // Call your API function
                const result = await response.json(); // Parse the result

                // Your check based on backend requirements
                if (!response.ok || !(result.status === 200)) {
                    (message.error || message.success)("Login fail!", 5);
                    return;
                }

                // Success case
                message.success("Login success!", 5);
                onClose(); // Close modal on successful signup

            } catch (error) {
                (message.error || message.success)(error instanceof Error ? error.message : "An unexpected error occurred.", 5);
            } finally {
                setIsLoading(false); // Stop loading indicator regardless of outcome
            }
        }

        loginUser();
    };

    // Inline style for spinner animation
    const spinnerStyle: React.CSSProperties = {
        animation: 'spin 1s linear infinite',
        display: 'inline-block' // Ensure spinner displays correctly
    };
    const keyframesStyle = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

    return (
        <div className="auth__modal-view auth__modal-view--password">
            {/* Add keyframes style tag */}
            <style>{keyframesStyle}</style>
            {/* Disable back button */}
            <button className="auth__modal-back" onClick={() => onSwitchView('main')} disabled={isLoading}>
                <FiArrowLeft size={20} />
            </button>
            <h2 className="auth__modal-title">Log in with Password</h2>
            {/* Add loading class to form */}
            <form onSubmit={handleSubmit} className={`auth__form ${isLoading ? 'auth__form--loading' : ''}`}>
                <div className="auth__form-group">
                    <FiUser className="auth__input-icon" />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username or Email" // Keep placeholder generic
                        className="auth__input"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading} // Disable when loading
                    />
                </div>
                <div className="auth__form-group">
                    <FiLock className="auth__input-icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="auth__input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading} // Disable when loading
                    />
                    {/* Disable password toggle */}
                    <button
                        type="button"
                        className="auth__input-icon auth__input-icon--toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
                {/* Disable button and show loader */}
                <button type="submit" className="auth__button auth__button--primary" disabled={isLoading}>
                    {isLoading ? <FiLoader style={spinnerStyle} size={18}/> : 'Login'}
                </button>
            </form>
            {/* Disable link button */}
            <button className="auth__button auth__button--link" onClick={() => console.log('Forgot password clicked')} disabled={isLoading}>
                Forgot password?
            </button>
            {/* Disable footer links */}
            <div className="auth__modal-footer-links">
                <button className="auth__link" onClick={() => onSwitchView('signup')} disabled={isLoading}>Sign Up</button>
                <span className="auth__link-separator">|</span>
                <button className="auth__link" onClick={() => onSwitchView('main')} disabled={isLoading}>Log in with other account</button>
            </div>
        </div>
    );
};

// --- Sign Up View Component ---
interface SignUpViewProps {
    onSwitchView: (view: ModalView) => void;
    onClose: () => void;
}
const SignUpView: React.FC<SignUpViewProps> = ({ onSwitchView, onClose }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<SignUpFormData>({
        username: "",
        email: "",
        fullName: "",
        phone: "",
        gender: "",
        address: "",
        dateOfBirth: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Prevent changes while loading
        if (isLoading) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Keeping your handleSubmit logic exactly as provided ---
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Prevent multiple submissions if already loading
        if (isLoading) return;

        const registerUser = async () => {
            setIsLoading(true); // Start loading indicator
            try {
                const response = await postRegister(formData); // Call your API function
                const result = await response.json(); // Parse the result

                // Your check based on backend requirements
                if (!response.ok || !(result.status === 201)) {
                    // Use error type notification if available
                    (message.error || message.success)("Register fail!", 5);
                    // Do not close modal on failure
                    return;
                }

                // Success case
                message.success("Register success!", 5);
                onClose(); // Close modal on successful signup

            } catch (error) {
                (message.error || message.success)(error instanceof Error ? error.message : "An unexpected error occurred.", 5);
            } finally {
                setIsLoading(false); // Stop loading indicator regardless of outcome
            }
        }

        registerUser();
        // Remove onClose() from here - it's handled within registerUser now
    };
    // --- End of your handleSubmit logic ---


    // Inline style for spinner animation
    const spinnerStyle: React.CSSProperties = {
        animation: 'spin 1s linear infinite',
        display: 'inline-block' // Needed for animation to work correctly
    };
    // Define keyframes using a style tag (less ideal, but fulfills inline request)
    const keyframesStyle = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

    return (
        <div className="auth__modal-view auth__modal-view--signup">
            {/* Add keyframes style tag */}
            <style>{keyframesStyle}</style>
            {/* Disable back button when loading */}
            <button className="auth__modal-back" onClick={() => onSwitchView('main')} disabled={isLoading}>
                <FiArrowLeft size={20} />
            </button>
            <h2 className="auth__modal-title">Sign Up</h2>
            {/* Add loading class to form for potential extra styling (e.g., opacity) */}
            <form onSubmit={handleSubmit} className={`auth__form ${isLoading ? 'auth__form--loading' : ''}`}>
                {/* Disable all form elements when loading */}
                <div className="auth__form-group">
                    <FaRegUserCircle className="auth__input-icon" />
                    <input type="text" name="username" placeholder="Username" className="auth__input" value={formData.username} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="auth__form-group">
                    <FiMail className="auth__input-icon" />
                    <input type="email" name="email" placeholder="Email" className="auth__input" value={formData.email} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="auth__form-group">
                    <FiUser className="auth__input-icon" />
                    <input type="text" name="fullName" placeholder="Full Name" className="auth__input" value={formData.fullName} onChange={handleChange} disabled={isLoading} />
                </div>
                <div className="auth__form-group">
                    <FiPhone className="auth__input-icon" />
                    <input type="tel" name="phone" placeholder="Phone Number" className="auth__input" value={formData.phone} onChange={handleChange} disabled={isLoading} />
                </div>
                <div className="auth__form-group">
                    <FaTransgender className="auth__input-icon" />
                    <select name="gender" className="auth__input auth__input--select" value={formData.gender} onChange={handleChange} disabled={isLoading}>
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="auth__form-group">
                    <FiMapPin className="auth__input-icon" />
                    <input type="text" name="address" placeholder="Address" className="auth__input" value={formData.address} onChange={handleChange} disabled={isLoading} />
                </div>
                <div className="auth__form-group">
                    <FiCalendar className="auth__input-icon" />
                    <input type="date" name="dateOfBirth" placeholder="Date of Birth" className="auth__input" value={formData.dateOfBirth} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="auth__form-group">
                    <FiLock className="auth__input-icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="auth__input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                    {/* Disable password toggle button */}
                    <button
                        type="button"
                        className="auth__input-icon auth__input-icon--toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>

                {/* Disable submit button and show spinner */}
                <button type="submit" className="auth__button auth__button--primary" disabled={isLoading}>
                    {/* Conditionally render spinner or text */}
                    {isLoading ? <FiLoader style={spinnerStyle} size={18}/> : 'Sign Up'}
                </button>
            </form>
            {/* Disable footer link */}
            <div className="auth__modal-footer-links">
                <span>Already have an account?</span>
                <button className="auth__link" onClick={() => onSwitchView('passwordLogin')} disabled={isLoading}>Log In</button>
            </div>
        </div>
    );
};


// --- Main Login Modal Component ---
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [currentView, setCurrentView] = useState<ModalView>('main');

    if (!isOpen) return null;

    const handleOverlayClick = () => {
        setCurrentView('main'); // Reset view when closing
        onClose();
    };

    const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleSwitchView = (view: ModalView) => {
        setCurrentView(view);
    };

    // Function to handle closing and resetting the view
    const handleCloseAndReset = () => {
        setCurrentView('main');
        onClose();
    };

    return (
        <div className="auth__modal-overlay" onClick={handleOverlayClick}>
            <div className="auth__modal-content" onClick={handleContentClick}>
                {/* Close button always visible */}
                <button className="auth__modal-close" onClick={handleCloseAndReset}>
                    <FiX size={24} />
                </button>

                {/* Conditionally render views */}
                {currentView === 'main' && (
                    <div className="auth__modal-view auth__modal-view--main">
                        <h2 className="auth__modal-title">Login</h2>
                        <p className="auth__modal-description">
                            Log in to manage your account, and synchronize watching history and favorites on multi-devices.
                        </p>
                        <div className="auth__login-options">
                            {/* Button to switch to Password Login */}
                            <button className="auth__login-option" onClick={() => handleSwitchView('passwordLogin')}>
                                <FiLock className="auth__login-icon" /> Log in with Password
                            </button>
                            <button className="auth__login-option" onClick={() => alert('SMS Login Clicked!')}>
                                <FiSmartphone className="auth__login-icon" /> Log in with SMS
                            </button>
                            <button className="auth__login-option" onClick={() => alert('Google Login Clicked!')}>
                                <FaGoogle className="auth__login-icon auth__login-icon--google" /> Log in with Google
                            </button>
                            <button className="auth__login-option" onClick={() => alert('Facebook Login Clicked!')}>
                                <FaFacebook className="auth__login-icon auth__login-icon--facebook" /> Log in with Facebook
                            </button>
                        </div>
                        <p className="auth__signup-link">
                            Don't have an account? <button className="auth__link" onClick={() => handleSwitchView('signup')}>Sign Up</button>
                        </p>
                        <p className="auth__terms-text">
                            By clicking "Login", you indicate that you have read and agreed to the <a href="#privacy">Privacy Agreement</a> and <a href="#terms">Terms of Service</a>, and confirm that you are aged 18 or above.
                        </p>
                    </div>
                )}

                {currentView === 'passwordLogin' && (
                    <PasswordLoginView onSwitchView={handleSwitchView} onClose={handleCloseAndReset} />
                )}

                {currentView === 'signup' && (
                    <SignUpView onSwitchView={handleSwitchView} onClose={handleCloseAndReset} />
                )}

            </div>
        </div>
    );
};


// --- Main Auth Component (Manages Hover and Modal Open State) ---
const Auth: React.FC = () => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(false);
        }, 150);
    };

    // Opens the modal (always starts at 'main' view)
    const handleOpenModal = () => {
        setIsHovering(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setIsModalOpen(true);
    };

    // Closes the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePopupMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handlePopupMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(false);
        }, 150);
    };

    return (
        <div
            className="auth"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="auth__trigger" onClick={handleOpenModal}>
                <FiUser className="auth__icon" />
                <span className="auth__text">Me</span>
            </div>

            {isHovering && (
                <div
                    onMouseEnter={handlePopupMouseEnter}
                    onMouseLeave={handlePopupMouseLeave}
                >
                    <HoverPopup onLoginClick={handleOpenModal}/>
                </div>
            )}

            {/* Pass only isOpen and onClose to LoginModal */}
            <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Auth;