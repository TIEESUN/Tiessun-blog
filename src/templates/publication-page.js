/** @jsx jsx */
import { jsx } from "theme-ui";
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

  return (
    <Layout>
      <Seo title="Publications" />
      <div
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          sx={{
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          <h1
            sx={{
              fontSize: ["2rem", "2.5rem", "3rem"],
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "text",
            }}
          >
            Publications
          </h1>
          <p
            sx={{
              fontSize: "1.1rem",
              color: "muted",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            A collection of research publications and academic work
          </p>
        </div>

        <div
          sx={{
            display: "grid",
            gap: "1.5rem",
          }}
        >
          {publications.map(({ node }) => {
            const { title, abstract, link, date } = node.frontmatter;
            return (
              <article
                key={node.id}
                sx={{
                  backgroundColor: "background",
                  border: "1px solid",
                  borderColor: "muted",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                    borderColor: "primary",
                  },
                }}
              >
                <div
                  sx={{
                    display: "flex",
                    flexDirection: ["column", "column", "row"],
                    justifyContent: "space-between",
                    alignItems: ["flex-start", "flex-start", "center"],
                    marginBottom: "0.75rem",
                    gap: "0.5rem",
                  }}
                >
                  <h2
                    sx={{
                      fontSize: "1.4rem",
                      fontWeight: "600",
                      margin: 0,
                      color: "text",
                      flex: 1,
                    }}
                  >
                    {title || "Untitled"}
                  </h2>
                  <time
                    sx={{
                      fontSize: "0.9rem",
                      color: "muted",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {date || "Unknown date"}
                  </time>
                </div>

                <p
                  sx={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "text",
                    marginBottom: "1rem",
                    opacity: 0.9,
                  }}
                >
                  {abstract || "No abstract available"}
                </p>

                {link && (
                  
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "primary",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        textDecoration: "underline",
                        gap: "0.75rem",
                      },
                    }}
                  >
                    View Publication
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}
              </article>
            );
          })}
        </div>

        {publications.length === 0 && (
          <div
            sx={{
              textAlign: "center",
              padding: "3rem",
              color: "muted",
            }}
          >
            <p sx={{ fontSize: "1.1rem" }}>No publications available yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PublicationPage;
