// src/pages/frontend/SingleArticle.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/frontend/Header";
import Footer from "../../components/frontend/Footer";
import SidebarWidget from "../../components/frontend/SidebarWidget";
import CommentForm from "../../components/frontend/CommentForm";
import api, { getSingleArticle } from "../../api/api";

const SingleArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:3000/uploads/";

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const res = await getSingleArticle(id);

      console.log("SingleArticle API response:", res); // ✅ log full response

      // Adjust according to your backend response structure
      const articleData = res.data?.article || res.article || null;
      const allComments = res.data?.comments || res.comments || [];

      setArticle(articleData);
      setComments(allComments.filter((c) => c.status === "approved"));
      
      // Optional: update sidebar data if sent from backend
      setLatestNews(res.data?.latestNews || []);
      setCategories(res.data?.categories || []);
    } catch (err) {
      console.error("Error fetching article:", err.response?.data || err.message);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    // Only add if approved (or wait for admin approval)
    if (newComment.status === "approved") {
      setComments((prev) => [newComment, ...prev]);
    } else {
      alert("Comment submitted for review!");
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!article) return <p className="p-4">Article not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-bgMain">
      <Header categories={categories} latestNews={latestNews} />

      <main className="bg-pale-yellow flex flex-col lg:flex-row gap-8 container mx-auto px-4 py-8 flex-grow">
        {/* Article Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-deep-green">{article.title}</h1>
          {article.image && (
            <img
              src={`${API_BASE}${article.image}`}
              alt={article.title}
              className="w-full h-80 object-cover rounded-lg my-4"
            />
          )}
          <div
            className="text-muted-green"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>

          {/* Comment Form */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">Add a Comment</h2>
          <CommentForm articleId={article._id} onCommentAdded={handleCommentAdded} />

          {/* Approved Comments */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">Comments</h2>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="bg-light-mint p-3 rounded-lg space-y-4">
              {comments.map((c) => (
                <div key={c._id} className="border rounded-lg p-3 bg-bgCard">
                  <p className="font-semibold">{c.name}</p>
                  <p>{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3 flex-shrink-0">
          <SidebarWidget latestNews={latestNews} categories={categories} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleArticle;
