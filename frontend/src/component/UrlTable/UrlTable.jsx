import React from "react";
import "./UrlTable.scss";
export default function UrlTable({ urls, onAliasClick, onAnalyticsClick }) {
  if (!urls || urls.length === 0) {
    return <p className="no-data">No URLs have been shortened yet</p>;
  }
  const handleRedirect = (id, alias) => {
    onAliasClick(id);

    window.open(`http://localhost:8000/${alias}`, "_blank");
  };
  return (
    <div className="UrlTable">
      <table>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short Alias</th>
            <th>Clicked</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td className="original-url-cell">
                <div className="truncate">{url.original_url}</div>
              </td>
              <td className="short-alias-cell">
                <span
                  className="alias-link"
                  onClick={() => handleRedirect(url.id, url.short_alias)}
                >
                  {url.short_alias}
                </span>
              </td>
              <td className="click-count-cell">{url.click_count}</td>
              <td className="create-at-cell">{url.created_at}</td>
              <td className="actions-cell">
                <button
                  className="analytics-btn"
                  onClick={() => onAnalyticsClick(url.short_alias)}
                >
                  Analytics
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
