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
        className="publication-page"
        sx={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <h1
          sx={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textAlign: "center",
            color: "text",
          }}
        >
          Publications
        </h1>

        {/* Search Bar */}
        <div
          sx={{
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div sx={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            <input
              type="text"
              placeholder="Search publications by title or abstract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                fontSize: "1rem",
                backgroundColor: "cardBg",
                color: "text",
                border: "1px solid",
                borderColor: "borderColor",
                borderRadius: "8px",
                outline: "none",
                transition: "all 0.2s ease",
                "&:focus": {
                  borderColor: "primary",
                  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.2)",
                },
                "&::placeholder": {
                  color: "muted",
                  opacity: 0.6,
                },
              }}
            />
            {/* Search Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              sx={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "muted",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                sx={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "muted",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "text",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
                aria-label="Clear search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        {searchTerm && (
          <p
            sx={{
              textAlign: "center",
              color: "muted",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            Found {filteredPublications.length} publication
            {filteredPublications.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Publications List */}
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {filteredPublications.map(({ node }) => {
            const { title, abstract, link, date } = node.frontmatter;
            return (
              <article
                key={node.id}
                sx={{
                  backgroundColor: "cardBg",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  border: "1px solid",
                  borderColor: "borderColor",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <h2
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    lineHeight: "1.4",
                  }}
                >
                  {link ? (
                    
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "text",
                        textDecoration: "none",
                        "&:hover": {
                          color: "muted",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {title || "Untitled"}
                    </a>
                  ) : (
                    <span sx={{ color: "text" }}>
                      {title || "Untitled"}
                    </span>
                  )}
                </h2>
                <time
                  sx={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "muted",
                    marginBottom: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  {date || "Unknown date"}
                </time>
                <p
                  sx={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "muted",
                    marginBottom: "1rem",
                  }}
                >
                  {abstract || "No abstract available"}
                </p>
                {link && (
                  
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-block",
                      padding: "0.5rem 1.25rem",
                      backgroundColor: "primary",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      border: "1px solid",
                      borderColor: "borderColor",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "accent",
                        borderColor: "text",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Read Full Paper →
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
              color: "muted",
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
              sx={{
                margin: "0 auto 1rem",
                opacity: 0.4,
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p sx={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              No publications found
            </p>
            <p sx={{ fontSize: "0.95rem", opacity: 0.8 }}>
              Try adjusting your search term
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PublicationPage;
