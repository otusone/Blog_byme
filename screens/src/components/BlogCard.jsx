import { Link } from 'react-router-dom';
import React from 'react';
import './BlogCard.css';

export default function BlogCard({ post = {} }) {
  const {
    _id = '',
    featuredImage = '/assets/idea.png',
    title = 'Untitled Post',
    category = 'Uncategorized',
    excerpt = 'No content available.',
    updatedAt = '',
    readTime = '0'
  } = post;

  const getTrimmedHTML = (html, wordLimit = 20) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const trimmedText = text.split(/\s+/).slice(0, wordLimit).join(" ") + "...";
    return trimmedText;
  };


  return (
    <div className="blog-card">
      <div className="card-image">
        <Link to={`/posts/get/${_id}`}>
          <img src={featuredImage} alt={title} />
        </Link>
      </div>
      <div className="card-content">
        <span className="category">{category}</span>
        <h3><Link to={`/posts/get/${_id}`}>{title}</Link></h3>
        <div className="meta">
          <span>{updatedAt.split('T')[0]}</span>
          <span>• {readTime} min read</span>
        </div>
        <p className="excerpt" dangerouslySetInnerHTML={{ __html: getTrimmedHTML(post.excerpt, 20) }} />
        {/* <div className="meta">
          <span>{updatedAt.split('T')[0]}</span>
          <span>• {readTime} min read</span>
        </div> */}
        <div className="card-footer">
          {/* <div className="meta">
            <span>{updatedAt.split('T')[0]}</span>
            <span>• {readTime} min read</span>
          </div> */}
          <div className="button-group">
            <Link to={`/posts/get/${_id}`} className="view-btn">View</Link>
          </div>
        </div>

        {/* <div className="button-group">
          <Link to={`/posts/get/${_id}`} className="view-btn">View</Link>
        </div> */}
      </div>
    </div>
  );
}
