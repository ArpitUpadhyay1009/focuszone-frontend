import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewsSection.css";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchReviews = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/review?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      console.log("Reviews API response:", response.data);
      
      if (response.data.success) {
        // Log the first review to see its structure
        if (response.data.data && response.data.data.length > 0) {
          console.log("Sample review data:", response.data.data[0]);
        }
        
        setReviews(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.response?.data?.message || "An error occurred while fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handlePageChange = (newPage) => {
    fetchReviews(newPage, pagination.limit);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="star-icon"
          >
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </span>
      );
    }
    return <div className="star-rating-display">{stars}</div>;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{error}</p>
        <button 
          onClick={() => fetchReviews()} 
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>User Reviews</h2>
        <div className="reviews-stats">
          <div className="stat-card">
            <span className="stat-value">{pagination.total}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {reviews.length > 0 
                ? (reviews.reduce((acc, review) => acc + review.starRating, 0) / reviews.length).toFixed(1) 
                : "0.0"}
            </span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <svg xmlns="http://www.w3.org/2000/svg" className="no-reviews-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No reviews found</p>
        </div>
      ) : (
        <div className="reviews-container">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {(() => {
                      if (!review.userId) {
                        return "G";
                      }
                      
                      if (typeof review.userId === 'object' && review.userId.username) {
                        return review.userId.username.charAt(0).toUpperCase();
                      } else if (typeof review.userId === 'string') {
                        return "U";
                      } else {
                        return "?";
                      }
                    })()}
                  </div>
                  <div className="user-details">
                    <h3>
                      {(() => {
                        // Debug the userId structure
                        console.log(`Review ${review._id} userId:`, review.userId);
                        
                        if (!review.userId) {
                          return "Guest User";
                        }
                        
                        if (typeof review.userId === 'object') {
                          if (review.userId.username) {
                            return review.userId.username;
                          } else {
                            console.log("userId is object but no username:", review.userId);
                            return "User (No Name)";
                          }
                        } else if (typeof review.userId === 'string') {
                          return `User #${review.userId.substring(0, 6)}`;
                        } else {
                          console.log("Unexpected userId type:", typeof review.userId);
                          return "Unknown User";
                        }
                      })()}
                    </h3>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.starRating)}
                  <span className="rating-value">{review.starRating}/5</span>
                </div>
              </div>
              <div className="review-content">
                <p>{review.textReview}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={!pagination.hasPrev}
            className="pagination-button"
          >
            &laquo; First
          </button>
          <button 
            onClick={() => handlePageChange(pagination.page - 1)} 
            disabled={!pagination.hasPrev}
            className="pagination-button"
          >
            &lsaquo; Prev
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)} 
            disabled={!pagination.hasNext}
            className="pagination-button"
          >
            Next &rsaquo;
          </button>
          <button 
            onClick={() => handlePageChange(pagination.totalPages)} 
            disabled={!pagination.hasNext}
            className="pagination-button"
          >
            Last &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
