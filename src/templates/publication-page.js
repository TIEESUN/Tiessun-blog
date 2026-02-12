/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

export const pageQuery = graphql`
  query PublicationQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "publication-page" } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            abstract
            link
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;

const PublicationPage = ({ data }) => {
  const publications = data.allMarkdownRemark.edges;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPublications = publications.filter(({ node }) => {
    const { title, abstract } = node.frontmatter;
    const search = searchTerm.toLowerCase();
    return (
      title?.toLowerCase().includes(search) ||
      abstract?.toLowerCase().includes(search)
    );
  });

  return (
    <Layout>
      <Seo title="Publications" />
      <div
        sx={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: ["2rem 1rem", "3rem 2rem"],
        }}
      >
        {/* Header */}
        <div sx={{ marginBottom: "2.5rem" }}>
          <h1
            sx={{
              fontSize: ["1.75rem", "2.25rem"],
              fontWeight: "700",
              marginBottom: "0.5rem",
              color: "text",
            }}
          >
            Publications
          </h1>
          <p
            sx={{
              fontSize: "1rem",
              color: "muted",
              marginBottom: "1.5rem",
            }}
          >
            Research publications and academic work
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: "500px",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              border: "1px solid",
              borderColor: "muted",
              borderRadius: "6px",
              outline: "none",
              transition: "all 0.2s ease",
              "&:focus": {
                borderColor: "primary",
                boxShadow: "0 0 0 3px rgba(0, 123, 255, 0.1)",
              },
            }}
          />
        </div>

        {/* Publications List */}
        <div sx={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredPublications.map(({ node }) => {
            const { title, abstract, link, date } = node.frontmatter;
            return (
              <article
                key={node.id}
                sx={{
                  backgroundColor: "background",
                  border: "1px solid",
                  borderColor: "#e5e7eb",
                  borderRadius: "8px",
                  padding: ["1.25rem", "1.5rem"],
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                {/* Title and Date */}
                <div
                  sx={{
                    display: "flex",
                    flexDirection: ["column", "row"],
                    justifyContent: "space-between",
                    alignItems: ["flex-start", "baseline"],
                    gap: ["0.5rem", "1rem"],
                    marginBottom: "0.75rem",
                  }}
                >
                  <h2
                    sx={{
                      fontSize: ["1.15rem", "1.25rem"],
                      fontWeight: "600",
                      margin: 0,
                      color: "text",
                      lineHeight: "1.4",
                    }}
                  >
                    {title || "Untitled"}
                  </h2>
                  <time
                    sx={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                      fontWeight: "500",
                    }}
                  >
                    {date || "Unknown date"}
                  </time>
                </div>

                {/* Abstract */}
                <p
                  sx={{
                    fontSize: "0.95rem",
                    lineHeight: "1.65",
                    color: "#4b5563",
                    marginBottom: "1rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {abstract || "No abstract available"}
                </p>

                {/* Link */}
                {link && (
                  
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "primary",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "gap 0.2s ease",
                      "&:hover": {
                        textDecoration: "underline",
                        gap: "0.6rem",
                      },
                    }}
                  >
                    View Publication
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                )}
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPublications.length === 0 && (
          <div
            sx={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#9ca3af",
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              sx={{ margin: "0 auto 1rem", opacity: 0.5 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p sx={{ fontSize: "1.05rem", fontWeight: "500" }}>
              {searchTerm
                ? "No publications found matching your search"
                : "No publications available yet"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PublicationPage;
