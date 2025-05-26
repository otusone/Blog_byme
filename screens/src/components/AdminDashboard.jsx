import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaSearch, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import './AdminDashboard.css';
import axios from 'axios';
import { baseurl } from '../baseUrl/baseUrl';
import DOMPurify from 'dompurify';


const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  //const [filteredPosts, setFilteredPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    featuredImage: '',
    readTime: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [currentPost, setCurrentPost] = useState(null);
  const postsRef = useRef(null);
  const editorRef = useRef(null);

  const navigate = useNavigate();


  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${baseurl}/posts/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(data)) {
        setPosts(data);
        setFilteredPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // useEffect(() => {
  //   if (Array.isArray(posts)) {
  //     const results = posts.filter(post =>
  //       post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredPosts(results);
  //   }
  // }, [searchTerm, posts]);

  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    if (searchTerm && postsRef.current) {
      postsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchTerm]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`${baseurl}/posts/update/${editingPostId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${baseurl}/posts/create`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchPosts();
      resetForm();
      alert("Successfully created the blog");

    } catch (err) {
      alert("Failed in creating the blog");
      console.error('Error saving post:', err);
    }
  };

  const handleEdit = (post) => {

    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || '',
      featuredImage: post.featuredImage || '',
      readTime: post.readTime || ''

    });
    setEditingPostId(post._id);
    setIsEditing(true);
    setViewMode('list');
    window.scrollTo(0, 0);

  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${baseurl}/posts/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Successfully deleted the blog");
        resetForm();
        fetchPosts();

      } catch (err) {
        alert("Failed to delete the blog");
        console.error('Error deleting post:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      featuredImage: '',
      readTime: ''
    });
    setIsEditing(false);
    setEditingPostId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setCurrentPost(null);
  };

  const handleViewPreviousPost = () => {
    setViewMode('previous');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTrimmedHTML = (html, wordLimit = 20) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const trimmedText = text.split(/\s+/).slice(0, wordLimit).join(" ") + "...";
    return trimmedText;
  };


  const renderPostDetail = (post) => (
    <div className="post-detail">
      <button onClick={handleBackToList} className="back-btn">
        <FaArrowLeft /> Back to Posts
      </button>

      <div className="post-detail-body">
        {post.featuredImage && (
          <div className="post-detail-image">
            <img src={post.featuredImage} alt={post.title} />
          </div>
        )}

        <div className="post-detail-content">
          <h2>{post.title}</h2>
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">
              | {new Date(post.updatedAt).toLocaleDateString('en-GB')}
            </span>
            <span className="post-date"> | {post.readTime} mins read</span>
          </div>
          <div className="post-details-content">
            <p className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            <div
              className="post-full-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          <div className="post-actions">
            <button onClick={() => handleEdit(post)} className="edit-btn"><FaEdit /> Edit Post</button>
            <button onClick={() => handleDelete(post._id)} className="delete-btn"><FaTrash /> Delete Post</button>
          </div>
        </div>
      </div>
    </div>
  );


  const renderPostsList = () => (
    <>
      <div className="admin-actions">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="new-post-btn" onClick={resetForm}>
          <FaPlus /> New Post
        </button>
      </div>

      <div className="post-form-container active">
        <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Excerpt</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_KEY}
              onInit={(evt, editor) => editorRef.current = editor}
              value={formData.excerpt}
              onEditorChange={(newExcerpt) =>
                setFormData((prev) => ({ ...prev, excerpt: newExcerpt }))
              }
              init={{
                plugins: [
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media',
                  'searchreplace', 'table', 'visualblocks', 'wordcount',
                  'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker',
                  'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage',
                  'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes',
                  'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                  { value: 'First.Name', title: 'First Name' },
                  { value: 'Email', title: 'Email' },
                ],
                ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                height: 300,
                menubar: false
              }}
            />
          </div>


          <div className="form-group">
            <label>Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_KEY}
              onInit={(evt, editor) => editorRef.current = editor}
              value={formData.content}
              onEditorChange={(newContent) =>
                setFormData((prev) => ({ ...prev, content: newContent }))
              }
              init={{
                plugins: [
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media',
                  'searchreplace', 'table', 'visualblocks', 'wordcount',
                  'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker',
                  'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage',
                  'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes',
                  'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                  { value: 'First.Name', title: 'First Name' },
                  { value: 'Email', title: 'Email' },
                ],
                ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                height: 300,
                menubar: false
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter category"
              />
            </div>

            <div className="form-group">
              <label>Featured Image URL</label>
              <input name="featuredImage" value={formData.featuredImage} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Read Time</label>
            <input
              type="text"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              placeholder="e.g. 3 min"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">{isEditing ? 'Update Post' : 'Publish Post'}</button>
            <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="posts-list" ref={postsRef}>
        <h2>All Posts ({filteredPosts.length})</h2>
        {isLoading ? (
          <div className="loading">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="no-posts">No posts found.</div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <div key={post._id} className="post-card">
                {post.featuredImage && (
                  <div className="post-image">
                    <img src={post.featuredImage} alt={post.title} />
                  </div>
                )}
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                  <p
                    className="post-excerpt"
                    dangerouslySetInnerHTML={{ __html: getTrimmedHTML(post.excerpt, 20) }}
                  />

                  <div className="post-actions">
                    <button onClick={() => handleEdit(post)} className="edit-btn"><FaEdit /> Edit</button>
                    <button onClick={() => handleDelete(post._id)} className="delete-btn"><FaTrash /> Delete</button>
                    <button onClick={() => {
                      setCurrentPost(post);
                      setViewMode('detail');
                    }} className="view-btn">View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderPreviousPostsList = () => {
    if (filteredPosts.length === 0) return <p>No posts available</p>;

    return (
      <div>
        <button onClick={handleBackToList} className="back-btn">
          <FaArrowLeft /> Back to Posts
        </button>
        <h2 style={{ marginBottom: "10px" }}>All Previous Posts</h2>
        <ul className="previous-posts-list">
          {filteredPosts.map(post => (
            <li key={post._id} className="previous-post-item">
              {post.featuredImage && (
                <div className="post-image">
                  <img src={post.featuredImage} alt={post.title} />
                </div>
              )}
              <div className="post-details">
                <h3>{post.title}</h3>
                <small>{post.category} | {new Date(post.updatedAt).toLocaleDateString('en-GB')} | {post.readTime} mins read</small>
                <p dangerouslySetInnerHTML={{ __html: getTrimmedHTML(post.excerpt, 20) }} />
                {/* <p dangerouslySetInnerHTML={{ __html: getTrimmedHTML(post.content, 20) }} /> */}
                {/* <small>{post.category} | {new Date(post.updatedAt).toLocaleDateString('en-GB')} | {post.readTime} mins read</small> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };




  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1><FaFileAlt /> Blog Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</button>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li className={viewMode === 'list' ? 'active' : ''}>
                <button onClick={handleBackToList}>Posts</button>
              </li>
              <li><button>Categories</button></li>
              <li><button>Media</button></li>
              <li><button>Comments</button></li>
              <li><button>Settings</button></li>
              <li className={viewMode === 'previous' ? 'active' : ''}>
                <button onClick={handleViewPreviousPost}>Previous Post</button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-main">
          {viewMode === 'list' && renderPostsList()}
          {viewMode === 'detail' && currentPost && renderPostDetail(currentPost)}
          {viewMode === 'previous' && renderPreviousPostsList()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
