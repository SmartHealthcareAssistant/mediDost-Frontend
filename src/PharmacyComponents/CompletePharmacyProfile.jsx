import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 
import { FaUser, FaIdCard, FaStore } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

// Helper to get authorization headers 
const authHeaders = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
};

// Base API URL
const API_BASE = "https://medidost-smart-healthcare-app-txxt.onrender.com/api";

/* ---------------- LOCATION CONSTANTS (Assuming these are available globally) ---------------- */
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
  "Puducherry", "Chandigarh", "Andaman & Nicobar Islands",
  "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep",
];

const locationData = {
  "Uttar Pradesh": {
    Lucknow: ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar"],
    Kanpur: ["Kakadeo", "Swaroop Nagar", "Govind Nagar"],
  },
  Maharashtra: {
    Mumbai: ["Andheri", "Bandra", "Borivali", "Dadar"],
    Pune: ["Hinjewadi", "Kothrud", "Shivajinagar"],
  },
  Delhi: {
    "New Delhi": ["Chanakyapuri", "Karol Bagh", "Dwarka"],
    "South Delhi": ["Saket", "Malviya Nagar", "Hauz Khas"],
  },
};

const pincodeDatabase = {
  "226010": {
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Gomti Nagar",
  },
  "226012": {
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Aliganj",
  },
  "400001": {
    state: "Maharashtra",
    district: "Mumbai",
    city: "Fort",
  },
  "110001": {
    state: "Delhi",
    district: "New Delhi",
    city: "Connaught Place",
  },
};
/* ---------------- END LOCATION CONSTANTS ---------------- */


const CompletePharmacyProfile = () => {
    // Get Pharmacy ID 
    const pharmacyId = localStorage.getItem("pharmacyId") || localStorage.getItem("doctorId"); 
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Consolidated State Management
    const [formData, setFormData] = useState({
        // STEP 1 – Pharmacist basic details
        pharmacistName: "", 
        pharmacistRegistrationNo: "",
        pharmacistPhone: "",
        gender: "",
        pincode: "",
        state: "",
        district: "",
        city: "",

        // STEP 2 – Pharmacist documents (stored as File objects)
        pharmacistAadharCard: null,
        pharmacistCertificate: null,
        pharmacistPhoto: null,

        // STEP 3 – Pharmacy details
        pharmacyName: "",
        pharmaPhone: "",
        pharmacyAddress: "",
        licenseNumber: "",
        licenseCertificateImage: null,
        gstNumber: "",
        timings: "9:00 AM - 9:00 PM",
        storeImage: null,
    });


    const [preview, setPreview] = useState({
        pharmacistAadharCard: null,
        pharmacistCertificate: null,
        pharmacistPhoto: null,
        storeImage: null,
        licenseCertificateImage: null,
    });
    
    // Separate error states for cleaner rendering
    const [phoneErrors, setPhoneErrors] = useState({});
    const [fileErrors, setFileErrors] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [pincodeMessage, setPincodeMessage] = useState("");

    const navigate = useNavigate();
        useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "pharmacy") {
        navigate("/login");
      }
    }, [navigate]);

    const initialRegistrationName = localStorage.getItem("name") || "Pharmacy Admin";
    const [dataLoading, setDataLoading] = useState(true); 

    // Safety ref to avoid setState on unmounted component
    const isMountedRef = useRef(true);
    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
        // Clean up object URLs created for image previews
        Object.values(preview).forEach(url => {
          if (url) URL.revokeObjectURL(url);
        });
      };
    }, [preview]);


    /* ---------------- Derived Options (Location) ---------------- */
    const districtOptions =
        formData.state && locationData[formData.state]
        ? Object.keys(locationData[formData.state])
        : [];

    const cityOptions =
        formData.state &&
        formData.district &&
        locationData[formData.state] &&
        locationData[formData.state][formData.district]
        ? locationData[formData.state][formData.district]
        : [];
        
    const useDistrictSelect = districtOptions.length > 0;
    const useCitySelect = cityOptions.length > 0;
    
    
    /* ---------------- PINCODE LOOKUP (Wrapped in useCallback) ---------------- */
    const lookupPincode = useCallback(async (pin) => {
        setPincodeMessage("Checking pincode...");
        setFieldErrors((prev) => ({ ...prev, pincode: "" }));

        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await res.json();

            if (Array.isArray(data) && data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
                const po = data[0].PostOffice[0];
                const state = po.State || "";
                const district = po.District || "";
                const city = po.Block || po.Name || "";

                if (isMountedRef.current) {
                    // Use functional update form for stability
                    setFormData((prev) => ({
                        ...prev,
                        state,
                        district,
                        city,
                    }));
                    setPincodeMessage("Pincode found and address auto-filled.");
                }
                return;
            }
            throw new Error("API lookup failed");
        } catch (err) {
            if (pincodeDatabase[pin]) {
                const { state, district, city } = pincodeDatabase[pin];
                if (isMountedRef.current) {
                    setFormData((prev) => ({
                        ...prev,
                        state,
                        district,
                        city,
                    }));
                    setPincodeMessage("Pincode matched using offline data. Please verify address.");
                }
            } else {
                if (isMountedRef.current) {
                    setPincodeMessage("Could not auto-fill address for this pincode.");
                    setFieldErrors((prev) => ({
                        ...prev,
                        pincode: "Invalid or unsupported pincode",
                    }));
                }
            }
        }
    }, []); // Stable setters used, no need for complex dependencies

    
    const fetchInitialData = useCallback(async () => {
        if (!pharmacyId) return;

        try {
            const res = await axios.get(`${API_BASE}/pharmacy/my-profile`, { headers: authHeaders() });
            const data = res.data;
            
            if (data && isMountedRef.current) {
                
  localStorage.setItem("pharmacyProfileCompleted", String(data.profileCompleted));
  localStorage.setItem("pharmacyVerified", String(data.verified));

  if (data.profileCompleted) {
    if (!data.verified) {
      navigate("/pharmacy/pending-verification");
      return;
    } else {
      navigate("/pharmacy");
      return;
    }
  }
                setFormData(prev => ({ 
                    ...prev, 
                    // Pre-fill fields
                    pharmacistName: data.name || initialRegistrationName, 
                    pharmacistRegistrationNo: data.pharmacistRegistrationNo || prev.pharmacistRegistrationNo,
                    pharmacistPhone: data.pharmacistPhone || prev.pharmacistPhone,
                    gender: data.gender || prev.gender,
                    pincode: data.pincode || prev.pincode,
                    state: data.state || prev.state,
                    district: data.district || prev.district,
                    city: data.city || prev.city,
                    
                    pharmacyName: data.pharmacyName || prev.pharmacyName,
                    pharmaPhone: data.pharmaPhone || prev.pharmaPhone,
                    pharmacyAddress: data.pharmacyAddress || prev.pharmacyAddress,
                    licenseNumber: data.licenseNumber || prev.licenseNumber,
                    gstNumber: data.gstNumber || prev.gstNumber,
                    timings: data.timings || prev.timings,
                }));
                
                // If pincode was loaded from API, run lookup to fill dependent fields
                if (data.pincode && data.pincode.length === 6) {
                    lookupPincode(data.pincode); 
                }
            }
        } catch (err) {
            console.error("Error fetching initial pharmacy data:", err);
            if (err.response?.status === 401) {
                navigate("/login");
            } else if (err.response?.status !== 404) {
                toast.error("Failed to load existing profile data.");
            }
        } finally {
            if (isMountedRef.current) setDataLoading(false); 
        }
    }, [pharmacyId, navigate, initialRegistrationName, lookupPincode]);


    /* ---------------- CRITICAL FIX: useEffect runs only on mount/ID change ---------------- */
    useEffect(() => {
        if (pharmacyId) {
            setDataLoading(true); 
            fetchInitialData();
        } else {
             navigate('/login');
        }
    }, [pharmacyId, navigate, fetchInitialData]);


    /* ---------------- HANDLE INPUT CHANGE ---------------- */
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const file = e.target.files?.[0];

        // --- Basic Text/Value Updates ---
        if (name === "pincode") {
            if (!/^\d{0,6}$/.test(value)) return;

            setFormData((prev) => ({ ...prev, pincode: value }));

            if (value.length === 6) {
                lookupPincode(value);
            } else {
                setPincodeMessage("");
            }
            return;
        }

        if (name === "state") {
            setFormData((prev) => ({
                ...prev,
                state: value,
                district: "",
                city: "",
            }));
            return;
        }

        if (name === "district") {
            setFormData((prev) => ({
                ...prev,
                district: value,
                city: "",
            }));
            return;
        }
        
        // Phone fields
        if (
            (name === "pharmacistPhone" || name === "pharmaPhone") &&
            !/^\d*$/.test(value)
        ) {
            return;
        }


        // --- File Upload Handling ---
        if (
            [
                "pharmacistAadharCard", "pharmacistCertificate", "pharmacistPhoto", 
                "storeImage", "licenseCertificateImage",
            ].includes(name)
        ) {
            if (file) {
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
                const maxSize = 5 * 1024 * 1024; // 5MB limit
                
                if (!allowedTypes.includes(file.type)) {
                    setFileErrors((prev) => ({ ...prev, [name]: "Only JPG, JPEG, PNG, PDF allowed" }));
                    return;
                }
                if (file.size > maxSize) {
                    setFileErrors((prev) => ({ ...prev, [name]: "File size must be under 5MB" }));
                    return;
                }

                setFileErrors((prev) => ({ ...prev, [name]: "" }));
                
                // Create preview URL (revoke previous for that field if any)
                setPreview((prev) => {
                    try {
                        if (prev[name]) URL.revokeObjectURL(prev[name]);
                    } catch (e) {
                        // ignore revoke errors
                    }
                    return { ...prev, [name]: URL.createObjectURL(file) };
                });
                
                setFormData((prev) => ({ ...prev, [name]: file })); // Save File object to formData
            }
            return;
        }

        // --- Default Text Input Update ---
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    /* ---------------- PURE (SILENT) VALIDATORS — NO SIDE EFFECTS ---------------- */
    // NOTE: These silent validators are used for disabling the Next button ONLY, 
    // to prevent unnecessary re-renders during typing.
    const validateStep1Silent = () => {
        if (!formData.pharmacistName) return false;
        if (!formData.pharmacistRegistrationNo) return false;
        if (!formData.gender) return false;
        if (!/^\d{10}$/.test(formData.pharmacistPhone)) return false;
        if (!/^\d{6}$/.test(formData.pincode)) return false;
        if (!formData.state) return false;
        if (!formData.city) return false;
        return true;
    };

    const validateStep2Silent = () => {
        if (!(formData.pharmacistAadharCard instanceof File)) return false;
        if (!(formData.pharmacistCertificate instanceof File)) return false;
        if (!(formData.pharmacistPhoto instanceof File)) return false;
        if (Object.values(fileErrors).some((e) => e)) return false;
        return true;
    };

    const validateStep3Silent = () => {
        if (!/^\d{10}$/.test(formData.pharmaPhone)) return false;
        if (!formData.licenseNumber) return false;
        if (!/^[a-zA-Z0-9]{6,20}$/.test(formData.licenseNumber)) return false;
        if (formData.gstNumber) {
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
            if (!gstRegex.test(formData.gstNumber)) return false;
        }
        if (!formData.pharmacyName) return false;
        if (!formData.pharmacyAddress) return false;
        // CRITICAL FIX: Ensure files are selected using the correct validation logic
        if (!(formData.storeImage instanceof File)) return false;
        if (!(formData.licenseCertificateImage instanceof File)) return false;
        return true;
    };

    /* ---------------- ORIGINAL VALIDATORS (with side effects) ---------------- */
    const isStep1Valid = () => {
        const phoneErr = {};
        const fieldErr = {};

        if (!formData.pharmacistName) fieldErr.pharmacistName = "Name is required";
        if (!formData.pharmacistRegistrationNo) fieldErr.pharmacistRegistrationNo = "Registration No. is required";
        if (!formData.gender) fieldErr.gender = "Gender is required";

        if (!formData.pharmacistPhone || !/^\d{10}$/.test(formData.pharmacistPhone)) {
            phoneErr.pharmacistPhone = "Phone must be exactly 10 digits";
        }

        if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
            fieldErr.pincode = "Pincode must be 6 digits";
        }
        if (!formData.state) fieldErr.state = "State is required";
        if (!formData.city) fieldErr.city = "City is required";

        setPhoneErrors(phoneErr);
        setFieldErrors((prev) => ({ ...prev, ...fieldErr }));

        const isValid = Object.keys(phoneErr).length === 0 && Object.keys(fieldErr).length === 0;

        if (!isValid) {
            toast.error("Please fix highlighted errors in Pharmacist Details.");
        }
        return isValid;
    };

    const isStep2Valid = () => {
        const fileErr = {};

        if (!(formData.pharmacistAadharCard instanceof File)) fileErr.pharmacistAadharCard = "Aadhar card image is required";
        if (!(formData.pharmacistCertificate instanceof File)) fileErr.pharmacistCertificate = "Certificate image is required";
        if (!(formData.pharmacistPhoto instanceof File)) fileErr.pharmacistPhoto = "Pharmacist photo is required";

        // Merge with existing fileErrors to present a combined picture
        const mergedFileErrors = { ...fileErrors, ...fileErr };
        setFileErrors((prev) => ({ ...prev, ...fileErr }));

        const isValid = Object.keys(fileErr).length === 0 && Object.values(mergedFileErrors).every((e) => !e);

        if (!isValid) {
            toast.error("Please upload all pharmacist documents (check file size/type).");
        }
        return isValid;
    };

    const isStep3Valid = () => {
        const phoneErr = {};
        const fieldErr = {};

        if (!formData.pharmaPhone || !/^\d{10}$/.test(formData.pharmaPhone)) {
            phoneErr.pharmaPhone = "Phone must be 10 digits";
        }

        if (!formData.licenseNumber || !/^[a-zA-Z0-9]{6,20}$/.test(formData.licenseNumber)) {
            fieldErr.licenseNumber = "License must be 6–20 alphanumeric characters";
        }

        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        if (formData.gstNumber && !gstRegex.test(formData.gstNumber)) {
            fieldErr.gstNumber = "Invalid GST number format";
        }

        if (!formData.pharmacyName) fieldErr.pharmacyName = "Pharmacy name is required";
        if (!formData.pharmacyAddress) fieldErr.pharmacyAddress = "Pharmacy address is required";
        if (!(formData.storeImage instanceof File)) fieldErr.storeImage = "Store image is required";
        if (!(formData.licenseCertificateImage instanceof File)) fieldErr.licenseCertificateImage = "License certificate image is required";

        setPhoneErrors((prev) => ({ ...prev, ...phoneErr }));
        setFieldErrors((prev) => ({ ...prev, ...fieldErr }));

        const isValid = Object.keys(phoneErr).length === 0 && Object.keys(fieldErr).length === 0;

        if (!isValid) {
            setError("Fix highlighted errors in Pharmacy details.");
        }
        return isValid;
    };

    /* ---------------- STEP NAVIGATION ---------------- */
    const nextStep = () => {
        if (step === 1 && isStep1Valid()) setStep(2);
        else if (step === 2 && isStep2Valid()) setStep(3);
        else {
            // Force validation check on current step for toast message
            if (step === 1) isStep1Valid();
            else if (step === 2) isStep2Valid();
        }
    };

    const goBack = () => setStep((s) => Math.max(1, s - 1));


    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // CRITICAL FIX: Run the full validation with side effects (to show errors)
        // If validation fails, isStep3Valid() returns false and the function exits.
        if (!isStep3Valid()) {
            console.log("Submission stopped due to validation errors.");
            return; 
        }

        if (!pharmacyId) {
            toast.error("Pharmacy ID missing. Please log in again.");
            navigate("/login");
            return;
        }

        // Build complete FormData
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            const value = formData[key];
            
            if (value instanceof File) {
                 form.append(key, value);
            } else if (value !== null && value !== undefined) {
                 form.append(key, String(value));
            }
        });

        try {
            setLoading(true);
            
            const res = await axios.put(
                `${API_BASE}/pharmacy/complete-profile/${pharmacyId}`,
                form,
                { 
                    headers: { 
                        // "Content-Type": "multipart/form-data" is set automatically by axios when using FormData
                        ...authHeaders() 
                    } 
                }
            );

            toast.success(res.data?.message || "Verification Submitted Successfully!");

            // Update status flags in localStorage for ProtectedRoute
            localStorage.setItem("pharmacyProfileCompleted", "true");
            localStorage.setItem("pharmacyVerified", "false"); 

            // Redirect to pending verification page
            navigate(res.data?.redirectTo || "/pharmacy/pending-verification");
        } catch (error) {
            console.error("Submit error:", error);
            const msg = error.response?.data?.message || "Server error! Submission failed.";
            toast.error(msg);
        } finally {
            if (isMountedRef.current) setLoading(false);
        }
    };


    /* ---------------- RENDER ---------------- */
    
    if (!pharmacyId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">Error: Pharmacy ID is missing.</p>
            </div>
        );
    }
    
    // ADDED: Check data loading state to prevent rendering before initial API fetch completes
    if (dataLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-blue-600 font-semibold text-lg">Loading Profile Data...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">

                <h1 className="text-3xl font-bold text-center text-gray-600 mb-6">
                    Complete Pharmacy Profile
                </h1>
                
                {/* STEP HEADER */}
                <div className="flex justify-center gap-10 mb-10">
                    <StepIcon label="Pharmacist Details" current={1} step={step} Icon={FaUser} />
                    <StepIcon label="Pharmacist Documents" current={2} step={step} Icon={FaIdCard} />
                    <StepIcon label="Pharmacy Details" current={3} step={step} Icon={FaStore} />
                </div>

                {error && (
                    <div className="p-3 mb-5 bg-red-200 text-red-800 border border-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {/* STEP 1 – Pharmacist Basic Info (Modified to use the correct formData structure) */}
                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                            Pharmacist Basic Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Pharmacist Name (Autofilled and ReadOnly/Editable) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Pharmacist Name</label>
                                <InputField
                                    name="pharmacistName"
                                    placeholder="Pharmacist Name (From Registration)"
                                    value={formData.pharmacistName}
                                    handleChange={handleChange}
                                />
                                {fieldErrors.pharmacistName && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.pharmacistName}</p>
                                )}
                            </div>


                            {/* Registration No */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Registration No.</label>
                                <InputField
                                    name="pharmacistRegistrationNo"
                                    placeholder="Pharmacist Registration Number"
                                    value={formData.pharmacistRegistrationNo}
                                    handleChange={handleChange}
                                />
                                {fieldErrors.pharmacistRegistrationNo && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.pharmacistRegistrationNo}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Pharmacist Phone (10 Digits)</label>
                                <InputField
                                    name="pharmacistPhone"
                                    placeholder="Pharmacist Phone"
                                    value={formData.pharmacistPhone}
                                    handleChange={handleChange}
                                    type="tel"
                                    maxLength="10"
                                />
                                {phoneErrors.pharmacistPhone && (
                                    <p className="text-red-600 text-sm mt-1">{phoneErrors.pharmacistPhone}</p>
                                )}
                            </div>
                            
                            {/* Gender */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                                <select
                                    name="gender"
                                    className="border p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {fieldErrors.gender && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.gender}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                                <InputField
                                    name="pincode"
                                    placeholder="Pincode (6 Digits)"
                                    value={formData.pincode}
                                    handleChange={handleChange}
                                    maxLength="6"
                                />
                                {fieldErrors.pincode && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.pincode}</p>
                                )}
                                {pincodeMessage && !fieldErrors.pincode && (
                                    <p className="text-xs mt-1 text-blue-600">
                                        {pincodeMessage}
                                    </p>
                                )}
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">State</label>
                                <select
                                    name="state"
                                    className="border p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.state}
                                    onChange={handleChange}
                                >
                                    <option value="">Select State</option>
                                    {indianStates.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors.state && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.state}</p>
                                )}
                            </div>

                            {/* District – dropdown if we have data, else input */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">District</label>
                                {useDistrictSelect ? (
                                    <select
                                        name="district"
                                        className="border p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.district}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select District</option>
                                        {districtOptions.map((dis) => (
                                            <option key={dis} value={dis}>
                                                {dis}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <InputField
                                        name="district"
                                        placeholder="District"
                                        value={formData.district}
                                        handleChange={handleChange}
                                    />
                                )}
                                {fieldErrors.district && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.district}</p>
                                )}
                            </div>

                            {/* City – dropdown if we have data, else input */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">City</label>
                                {useCitySelect ? (
                                    <select
                                        name="city"
                                        className="border p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.city}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select City</option>
                                        {cityOptions.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <InputField
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        handleChange={handleChange}
                                    />
                                )}
                                {fieldErrors.city && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.city}</p>
                                )}
                            </div>
                        </div>

                        <NextButton nextStep={nextStep} disabled={!validateStep1Silent()} />
                    </>
                )}

                {/* STEP 2 – Pharmacist Documents */}
                {step === 2 && (
                    <>
                        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                            Pharmacist Documents
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FileField
                                name="pharmacistAadharCard"
                                label="Pharmacist Aadhar Card*"
                                preview={preview.pharmacistAadharCard}
                                handleChange={handleChange}
                                fileErrors={fileErrors}
                            />
                            <FileField
                                name="pharmacistCertificate"
                                label="Pharmacist Certificate*"
                                preview={preview.pharmacistCertificate}
                                handleChange={handleChange}
                                fileErrors={fileErrors}
                            />
                            <FileField
                                name="pharmacistPhoto"
                                label="Pharmacist Photo*"
                                preview={preview.pharmacistPhoto}
                                handleChange={handleChange}
                                fileErrors={fileErrors}
                            />
                        </div>

                        <NavigationButtons
                            goBack={goBack}
                            nextStep={nextStep}
                            disabled={!validateStep2Silent()}
                        />
                    </>
                )}

                {/* STEP 3 – Pharmacy Details */}
                {step === 3 && (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                            Pharmacy Details
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Pharmacy Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Pharmacy/Store Name</label>
                                <InputField
                                    name="pharmacyName"
                                    placeholder="Pharmacy Name"
                                    value={formData.pharmacyName}
                                    handleChange={handleChange}
                                />
                                {fieldErrors.pharmacyName && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.pharmacyName}</p>
                                )}
                            </div>

                            {/* Pharmacy Phone */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Pharmacy Phone (10 Digits)</label>
                                <InputField
                                    name="pharmaPhone"
                                    placeholder="Pharmacy Phone"
                                    value={formData.pharmaPhone}
                                    handleChange={handleChange}
                                    type="tel"
                                    maxLength="10"
                                />
                                {phoneErrors.pharmaPhone && (
                                    <p className="text-red-600 text-sm mt-1">{phoneErrors.pharmaPhone}</p>
                                )}
                            </div>

                            {/* License Number */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">License Number</label>
                                <InputField
                                    name="licenseNumber"
                                    placeholder="License Number"
                                    value={formData.licenseNumber}
                                    handleChange={handleChange}
                                />
                                {fieldErrors.licenseNumber && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.licenseNumber}</p>
                                )}
                            </div>

                            {/* GST Number */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">GST Number (optional)</label>
                                <InputField
                                    name="gstNumber"
                                    placeholder="GST Number (optional)"
                                    value={formData.gstNumber}
                                    handleChange={handleChange}
                                />
                                {fieldErrors.gstNumber && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.gstNumber}</p>
                                )}
                            </div>

                            {/* Timings */}
                            <div className="sm:col-span-2">
                                <label className="block text-gray-700 font-medium mb-1">Store Timings (e.g., 9:00 AM - 9:00 PM)</label>
                                <InputField
                                    name="timings"
                                    placeholder="Store Timings"
                                    value={formData.timings}
                                    handleChange={handleChange}
                                />
                            </div>
                            
                            {/* Pharmacy Address */}
                            <div className="sm:col-span-2">
                                <label className="block text-gray-700 font-medium mb-1">Full Pharmacy Address</label>
                                <textarea
                                    name="pharmacyAddress"
                                    rows="3"
                                    placeholder="Full Pharmacy Address"
                                    value={formData.pharmacyAddress}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                />
                                {fieldErrors.pharmacyAddress && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.pharmacyAddress}</p>
                                )}
                            </div>


                            {/* License certificate image */}
                            <FileField
                                name="licenseCertificateImage"
                                label="License Certificate Image*"
                                preview={preview.licenseCertificateImage}
                                handleChange={handleChange}
                                fileErrors={fileErrors}
                            />

                            {/* Store image */}
                            <FileField
                                name="storeImage"
                                label="Pharmacy Store Front Image*"
                                preview={preview.storeImage}
                                handleChange={handleChange}
                                fileErrors={fileErrors}
                            />
                        </div>

                        <SubmitNavigation goBack={goBack} disabled={!validateStep3Silent() || loading} />
                    </form>
                )}
                
                {/* Fallback to render Steps 1 and 2 if not in Step 3 */}
                {step !== 3 && <div className="mt-10">Use the Next and Back buttons to navigate.</div>}

            </div>
        </div>
    );
};

export default CompletePharmacyProfile;

/* ---------------- SMALL COMPONENTS ---------------- */

const StepIcon = ({ label, current, step, Icon }) => (
    <div
        className={`flex flex-col items-center text-center ${
            step === current ? "text-blue-600 scale-110" : "text-gray-400"
        } transition duration-300`}
    >
        <Icon className="text-3xl" />
        <p className="font-semibold text-sm mt-1">{label}</p>
        {step === current && <div className="h-1 w-1 bg-blue-600 rounded-full mt-1"></div>}
    </div>
);

const InputField = ({
    name,
    placeholder,
    value,
    handleChange,
    type = "text",
    readOnly = false,
    maxLength,
}) => (
    <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={readOnly ? undefined : handleChange}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`border p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
);


const FileField = ({ name, label, preview, handleChange, fileErrors }) => (
    <div className="mt-4">
        <p className="font-medium mb-1 capitalize">
            {label || name.replace(/([A-Z])/g, " $1")}
        </p>

        {preview && (
            <img
                src={preview}
                className="w-full h-36 rounded-lg shadow mb-2 object-cover border border-gray-300"
                alt="preview"
            />
        )}

        <input
            key={name}
            type="file"
            accept="image/png, image/jpeg, image/jpg, application/pdf"
            name={name}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-sm file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200"
        />

        {fileErrors?.[name] && (
            <p className="text-red-600 text-sm mt-1">{fileErrors[name]}</p>
        )}
    </div>
);

const NextButton = ({ nextStep, disabled }) => (
    <button
        onClick={nextStep}
        type="button"
        disabled={disabled}
        className={`mt-10 px-8 py-3 rounded-xl mx-auto flex items-center gap-2 transition text-white 
        ${disabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
    >
        Next <MdNavigateNext size={25} />
    </button>
);

const NavigationButtons = ({ goBack, nextStep, disabled }) => (
    <div className="flex justify-between mt-10">
        <button
            onClick={goBack}
            type="button"
            className="bg-gray-300 px-6 py-3 rounded-xl hover:bg-gray-400 transition flex items-center gap-2"
        >
            <MdNavigateBefore /> Back
        </button>

        <button
            onClick={nextStep}
            type="button"
            disabled={disabled}
            className={`px-6 py-3 rounded-xl text-white transition flex items-center gap-2 
        ${disabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
            Next <MdNavigateNext />
        </button>
    </div>
);

const SubmitNavigation = ({ goBack, disabled }) => (
    <div className="flex justify-between mt-10">
        <button
            onClick={goBack}
            type="button"
            className="bg-gray-300 px-6 py-3 rounded-xl hover:bg-gray-400 transition flex items-center gap-2"
        >
            <MdNavigateBefore /> Back
        </button>

        <button
            type="submit" // CRITICAL FIX: Ensure this is type="submit"
            disabled={disabled}
            className={`px-6 py-3 rounded-xl font-bold text-white transition 
        ${disabled ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
            Submit Verification
        </button>
    </div>
);
