
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import API_BASE_URL from "./api";
function SubmitComplaint() {
  const navigate = useNavigate();

  const [municipalities, setMunicipalities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    municipality_id: "",
    gender: "",
    street_address: "",
    pin_code: "",
    category: "",
    subcategory: "",
    title: "",
    description: "",
    location: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [complaintId, setComplaintId] = useState("");

  const categoryData = {
    "waste management": [
      "Garbage collection",
      "Illegal dumping",
      "Littering",
      "Construction waste",
      "Plastic waste",
      "Dead animal",
      "Garbage burning",
    ],

    "roads and footpaths": [
      "Potholes",
      "Damaged road",
      "Broken footpath",
      "Road obstruction",
      "Missing road sign",
      "Damaged divider",
      "Manhole issue",
    ],

    "storm water drainage": [
      "Blocked drain",
      "Flooding",
      "Waterlogging",
      "Stagnant water",
      "Damaged drainage",
    ],

    "street lighting / electrical": [
      "Street light not working",
      "Flickering street light",
      "Damaged electric pole",
      "Exposed wire",
      "Electrical hazard",
    ],

    "water supply": [
      "Water leakage",
      "Low water pressure",
      "No water supply",
      "Contaminated water",
      "Broken water pipeline",
      "Illegal water connection",
    ],

    "public health": [
      "Mosquito problem",
      "Unhygienic area",
      "Public toilet issue",
      "Stray animal",
      "Health hazard",
    ],

    "parks and playgrounds": [
      "Damaged playground",
      "Park maintenance",
      "Broken bench",
      "Damaged fencing",
      "Walking path issue",
    ],

    "trees and environment": [
      "Fallen tree",
      "Tree branch",
      "Tree cutting",
      "Environmental pollution",
      "Open burning",
    ],

    "buildings and construction": [
      "Illegal construction",
      "Unauthorized building",
      "Unsafe building",
      "Construction debris",
      "Encroachment",
      "Building obstruction",
    ],

    "revenue / tax / licensing": [
      "Property tax",
      "Professional tax",
      "Trade license",
      "Tax payment",
      "Tax information",
      "License renewal",
    ],

    "public facilities": [
      "Public toilet",
      "Community hall",
      "Public building",
      "Drinking water",
      "Public facility",
    ],

    education: [
      "School issue",
      "Municipal school issue",
    ],

    general: [
      "Other civic issue",
      "General municipal complaint",
    ],
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingMunicipalities(true);
        setError("");

        const municipalityResponse = await fetch(
          `${API_BASE_URL}/municipalities`
        );

        const municipalityData = await municipalityResponse.json();

        if (!municipalityResponse.ok) {
          throw new Error(
            municipalityData.error ||
              "Unable to load municipalities."
          );
        }

        setMunicipalities(
          Array.isArray(municipalityData)
            ? municipalityData
            : []
        );

        setCategories(Object.keys(categoryData));
      } catch (err) {
        console.error("Loading form data error:", err);

        setError(
          "Unable to load municipalities. Please make sure the backend is running."
        );
      } finally {
        setLoadingMunicipalities(false);
      }
    };

    loadData();
  }, []);

  const getUserId = () => {
    const possibleKeys = [
      "user_id",
      "userId",
      "civicconnect_user_id",
      "user",
      "currentUser",
    ];

    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);

      if (!value) {
        continue;
      }

      try {
        const parsed = JSON.parse(value);

        if (typeof parsed === "number") {
          return parsed;
        }

        if (typeof parsed === "string") {
          const numericValue = Number(parsed);

          if (!Number.isNaN(numericValue)) {
            return numericValue;
          }
        }

        if (parsed && parsed.id) {
          return Number(parsed.id);
        }

        if (parsed && parsed.user_id) {
          return Number(parsed.user_id);
        }
      } catch {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          return numericValue;
        }
      }
    }

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "category"
        ? { subcategory: "" }
        : {}),
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setImage(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      setImage(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedFile);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setComplaintId("");

    const userId = getUserId();

    if (!userId) {
      setError(
        "User information was not found. Please login again."
      );
      return;
    }

    if (!formData.municipality_id) {
      setError("Please select a municipality.");
      return;
    }

    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }

    if (!formData.street_address.trim()) {
      setError("Please enter your street address.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pin_code.trim())) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!formData.category) {
      setError("Please select a complaint category.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a complaint title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe your complaint.");
      return;
    }

    setLoading(true);

    try {
      const body = new FormData();

      body.append("user_id", userId);
      body.append(
        "municipality_id",
        formData.municipality_id
      );
      body.append("gender", formData.gender);
      body.append(
        "street_address",
        formData.street_address.trim()
      );
      body.append(
        "pin_code",
        formData.pin_code.trim()
      );
      body.append("category", formData.category);
      body.append(
        "subcategory",
        formData.subcategory
      );
      body.append(
        "title",
        formData.title.trim()
      );
      body.append(
        "description",
        formData.description.trim()
      );
      body.append(
        "location",
        formData.location.trim()
      );

      if (image) {
        body.append("image", image);
      }

      const response = await fetch(
        `${API_BASE_URL}/complaint`,
        {
          method: "POST",
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to submit complaint."
        );
      }

      setComplaintId(data.complaint_id);

      setSuccess(
        "Complaint submitted successfully!"
      );

      setFormData({
        municipality_id: "",
        gender: "",
        street_address: "",
        pin_code: "",
        category: "",
        subcategory: "",
        title: "",
        description: "",
        location: "",
      });

      setImage(null);

      const imageInput =
        document.getElementById("complaint-image");

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (err) {
      console.error(
        "Complaint submission error:",
        err
      );

      setError(
        err.message ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTrackComplaint = () => {
    if (!complaintId) {
      return;
    }

    navigate(
      `/track-complaint?id=${complaintId}`
    );
  };

  return (
    <main className="submit-complaint-page">

      {/* PAGE HEADER */}
      <section className="inner-page-header">
        <div>
          <span>COMPLAINT REGISTRATION</span>

          <h1>Submit a Complaint</h1>

          <p>
            Report a civic issue to your municipality
            and help improve public services.
          </p>
        </div>
      </section>


      {/* FORM SECTION */}
      <section className="submit-complaint-section">

        <div className="complaint-form-card">

          <div className="form-heading">
            <span>COMPLAINT REGISTRATION</span>

            <h2>Report a Civic Issue</h2>

            <p>
              Provide accurate details so your complaint
              can be directed to the appropriate department.
            </p>
          </div>


          {/* SUCCESS */}
          {success && (
            <div className="auth-message success-message">

              <strong>{success}</strong>

              {complaintId && (
                <p>
                  Your Complaint ID is{" "}
                  <strong>
                    #{complaintId}
                  </strong>
                </p>
              )}

              {complaintId && (
                <button
                  type="button"
                  onClick={handleTrackComplaint}
                >
                  Track This Complaint
                </button>
              )}

            </div>
          )}


          {/* ERROR */}
          {error && (
            <div className="auth-message error-message">
              {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="complaint-form"
          >

            {/* MUNICIPALITY */}
            <div className="form-group">

              <label htmlFor="municipality_id">
                Municipality *
              </label>

              <select
                id="municipality_id"
                name="municipality_id"
                value={formData.municipality_id}
                onChange={handleChange}
                disabled={
                  loadingMunicipalities ||
                  loading
                }
              >
                <option value="">
                  {loadingMunicipalities
                    ? "Loading municipalities..."
                    : "Select municipality"}
                </option>

                {municipalities.map(
                  (municipality) => (
                    <option
                      key={
                        municipality.municipality_id
                      }
                      value={
                        municipality.municipality_id
                      }
                    >
                      {
                        municipality.municipality_name
                      }
                    </option>
                  )
                )}
              </select>

            </div>


            {/* GENDER */}
            <div className="form-group">

              <label htmlFor="gender">
                Gender *
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>

            </div>


            {/* ADDRESS */}
            <div className="form-group">

              <label htmlFor="street_address">
                Street Address *
              </label>

              <input
                type="text"
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="Enter your street address"
                disabled={loading}
              />

            </div>


            {/* PIN */}
            <div className="form-group">

              <label htmlFor="pin_code">
                PIN Code *
              </label>

              <input
                type="text"
                id="pin_code"
                name="pin_code"
                value={formData.pin_code}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  if (value.length <= 6) {
                    setFormData(
                      (previous) => ({
                        ...previous,
                        pin_code: value,
                      })
                    );
                  }

                  setError("");
                }}
                placeholder="Enter 6-digit PIN code"
                inputMode="numeric"
                maxLength="6"
                disabled={loading}
              />

            </div>


            {/* CATEGORY */}
            <div className="form-group">

              <label htmlFor="category">
                Complaint Category *
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">
                  Select complaint category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category.replace(
                        /\b\w/g,
                        (letter) =>
                          letter.toUpperCase()
                      )}
                    </option>
                  )
                )}
              </select>

            </div>


            {/* SUBCATEGORY */}
            <div className="form-group">

              <label htmlFor="subcategory">
                Subcategory
              </label>

              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={
                  loading ||
                  !formData.category
                }
              >
                <option value="">
                  {formData.category
                    ? "Select subcategory"
                    : "Select category first"}
                </option>

                {(
                  categoryData[
                    formData.category
                  ] || []
                ).map(
                  (subcategory) => (
                    <option
                      key={subcategory}
                      value={subcategory}
                    >
                      {subcategory}
                    </option>
                  )
                )}
              </select>

            </div>


            {/* TITLE */}
            <div className="form-group">

              <label htmlFor="title">
                Complaint Title *
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Large pothole near main road"
                maxLength="150"
                disabled={loading}
              />

            </div>


            {/* DESCRIPTION */}
            <div className="form-group">

              <label htmlFor="description">
                Complaint Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows="6"
                disabled={loading}
              />

            </div>


            {/* LOCATION */}
            <div className="form-group">

              <label htmlFor="location">
                Additional Location Details
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Landmark or additional location details"
                disabled={loading}
              />

              <small>
                If left empty, your street address
                and PIN code will be used as the
                location.
              </small>

            </div>


            {/* IMAGE */}
            <div className="form-group">

              <label htmlFor="complaint-image">
                Supporting Image
              </label>

              <input
                id="complaint-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />

              <small>
                Optional. Maximum file size: 5 MB.
              </small>

              {image && (
                <small>
                  Selected: {image.name}
                </small>
              )}

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              className="submit-complaint-button"
              disabled={
                loading ||
                loadingMunicipalities
              }
            >
              {loading
                ? "Submitting Complaint..."
                : "Submit Complaint"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default SubmitComplaint;

