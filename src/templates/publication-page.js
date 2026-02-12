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
            marginBottom: "2rem",
            textAlign: "center",
            color: "text",
          }}
        >
          Publications
        </h1>
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {publications.map(({ node }) => {
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
                    <a
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
                  <a
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
      </div>
    </Layout>
  );
};
export default PublicationPage;
