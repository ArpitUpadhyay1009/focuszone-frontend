import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsletterAdminSection.css";

const NewsletterAdminSection = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const subscribersPerPage = 10;

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : undefined,
      };

      // Fetch both subscribers and stats in parallel
      const [subscribersResponse, statsResponse] = await Promise.all([
        axios.get("/api/newsletter/admin/subscribers", { headers }),
        axios.get("/api/newsletter/admin/stats", { headers }),
      ]);

      setSubscribers(subscribersResponse.data.subscribers || []);
      setStats(statsResponse.data.stats || {});
    } catch (error) {
      console.error("Failed to fetch newsletter data:", error);
      setError("Failed to load newsletter data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = () => {
    fetchNewsletterData();
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.newsletterEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = filteredSubscribers.slice(
    indexOfFirstSubscriber,
    indexOfLastSubscriber
  );
  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="newsletter-admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading newsletter data...</p>
      </div>
    );
  }

  return (
    <div className="newsletter-admin-container">
      {error && (
        <div className="newsletter-admin-error">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="newsletter-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <h3>Total Subscribers</h3>
              <p className="stat-number">{stats.totalSubscribers || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Subscription Rate</h3>
              <p className="stat-number">{stats.subscriptionRate || "0%"}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-content">
              <h3>Recent Subscribers</h3>
              <p className="stat-number">{stats.recentSubscribers || 0}</p>
              <span className="stat-subtitle">Last 7 days</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="newsletter-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="search-input"
          />
        </div>

        <div className="control-buttons">
          <button onClick={handleRefresh} className="refresh-button">
            🔄 Refresh
          </button>
          <span className="total-count">
            {filteredSubscribers.length} subscriber
            {filteredSubscribers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Subscribers Table */}
      {subscribers.length === 0 ? (
        <div className="no-subscribers">
          <p>No newsletter subscribers found.</p>
        </div>
      ) : (
        <>
          <div className="subscribers-table-container">
            <table className="subscribers-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>User Email</th>
                  <th>Newsletter Email</th>
                  <th>Subscribed Date</th>
                  <th>User Registered</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscribers.map((subscriber) => (
                  <tr key={subscriber.subscriptionId}>
                    <td className="username-cell">{subscriber.username}</td>
                    <td className="email-cell">{subscriber.userEmail}</td>
                    <td className="email-cell">{subscriber.newsletterEmail}</td>
                    <td className="date-cell">
                      {formatDate(subscriber.subscribedAt)}
                    </td>
                    <td className="date-cell">
                      {formatDate(subscriber.userRegisteredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-number ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsletterAdminSection;
